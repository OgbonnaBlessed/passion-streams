import { Server as HttpServer } from 'http';
import { Socket, Server as SocketServer } from 'socket.io';
import { Types } from 'mongoose';
import { ChatMessageModel, ChatModel } from '../models/chat.model';
import { verifyToken } from '../utils/auth';

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

  // Socket authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    if (!socket.userId || !Types.ObjectId.isValid(socket.userId)) {
      socket.disconnect();
      return;
    }

    const userObjectId = new Types.ObjectId(socket.userId);

    socket.join(`user:${socket.userId}`);

    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('leave-chat', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on(
      'send-message',
      async (data: { chatId: string; content: string; type?: 'TEXT' | 'IMAGE' | 'FILE' }) => {
        try {
          const { chatId, content, type = 'TEXT' } = data;

          if (!Types.ObjectId.isValid(chatId)) {
            socket.emit('error', { message: 'Invalid chat ID' });
            return;
          }

          const chat = await ChatModel.findById(chatId);
          if (!chat) {
            socket.emit('error', { message: 'Chat not found' });
            return;
          }

          const isParticipant = chat.participants.some((id) =>
            id.equals(userObjectId)
          );

          if (!isParticipant) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          const message = await ChatMessageModel.create({
            senderId: userObjectId,
            content,
            type,
            createdAt: new Date(),
          });

          chat.lastMessage = {
            senderId: userObjectId,
            content,
            type,
            createdAt: message.createdAt,
          };

          chat.lastActivityAt = new Date();
          chat.messages.push(message);
          await chat.save();

          io.to(`chat:${chatId}`).emit('new-message', {
            id: message._id.toString(),
            chatId,
            senderId: socket.userId,
            content,
            type,
            createdAt: message.createdAt,
          });
        } catch (error: any) {
          socket.emit('error', {
            message: 'Failed to send message',
            error: error.message,
          });
        }
      }
    );

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
