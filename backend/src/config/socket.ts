import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth';
import { db } from './firebase';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/socket.io',
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join chat room
    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Leave chat room
    socket.on('leave-chat', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Handle new message
    socket.on('send-message', async (data: { chatId: string; content: string; type?: string }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const { chatId, content, type = 'TEXT' } = data;

        // Verify chat exists and user is participant
        const chatDoc = await db.collection('chats').doc(chatId).get();
        if (!chatDoc.exists) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const chatData = chatDoc.data();
        if (!chatData?.participants.includes(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Save message to database
        const messageData = {
          chatId,
          senderId: socket.userId,
          content,
          type,
          createdAt: new Date(),
        };

        const messageRef = await chatDoc.ref.collection('messages').add(messageData);

        // Update chat last activity
        await chatDoc.ref.update({
          lastMessage: messageData,
          lastActivityAt: new Date(),
        });

        // Emit to all participants in the chat
        const message = {
          id: messageRef.id,
          ...messageData,
        };

        io.to(`chat:${chatId}`).emit('new-message', message);
      } catch (error: any) {
        socket.emit('error', { message: 'Failed to send message', error: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
      socket.to(`chat:${data.chatId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

