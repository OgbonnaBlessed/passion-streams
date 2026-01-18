import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiUser, FiCheckCircle, FiClock } from 'react-icons/fi';
import { communityService } from '../../services/communityService';
import { useAuthStore } from '../../store/authStore';
import type { CommunityPost, Comment, ModuleAccess } from '@/shared/types';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await communityService.getPosts('PASSION_SINGLES');
      setPosts(data);

      // Fetch comments for each post
      const commentPromises = data.map(post =>
        communityService.getComments(post.id).catch(() => [])
      );
      const commentsData = await Promise.all(commentPromises);

      const commentsObj: Record<string, Comment[]> = {};
      data.forEach((post, index) => {
        commentsObj[post.id] = commentsData[index];
      });
      setComments(commentsObj);
    } catch (error: any) {
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      const post = await communityService.createPost(newPostContent, 'PASSION_SINGLES');
      toast.success('Post submitted! It will appear after admin approval.');
      setNewPostContent('');
      setShowCreatePost(false);
      fetchPosts();
    } catch (error: any) {
      toast.error('Failed to create post');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await communityService.likePost(postId);
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes?.includes(user?.id || '');
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter(id => id !== user?.id)
              : [...(post.likes || []), user?.id || ''],
          };
        }
        return post;
      }));
    } catch (error: any) {
      toast.error('Failed to like post');
    }
  };

  const handleCreateComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content?.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await communityService.createComment(postId, content);
      toast.success('Comment submitted! It will appear after admin approval.');
      setNewComment({ ...newComment, [postId]: '' });
      fetchPosts();
    } catch (error: any) {
      toast.error('Failed to create comment');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient-blue">Community</h1>
          <p className="text-gray-400">Connect with other singles on the same journey</p>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
        >
          Create Post
        </button>
      </motion.div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            content={newPostContent}
            onChange={setNewPostContent}
            onSubmit={handleCreatePost}
            onClose={() => {
              setShowCreatePost(false);
              setNewPostContent('');
            }}
          />
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnimatePresence>
          {posts.map((post) => {
            const isLiked = post.likes?.includes(user?.id || '');
            const postComments = comments[post.id] || [];

            return (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white hover:border-primary-blue/50 transition-all"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Anonymous User</div>
                      <div className="text-sm text-gray-400 flex items-center space-x-2">
                        <FiClock className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {post.status === 'PENDING' && (
                    <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                      <FiClock className="w-4 h-4" />
                      <span>Pending Approval</span>
                    </div>
                  )}
                  {post.status === 'APPROVED' && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Approved</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-accent-white">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked ? 'text-primary-pink' : 'text-gray-400 hover:text-primary-pink'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-primary-blue transition-colors"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                    <span>{postComments.length}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {selectedPost?.id === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-accent-white"
                    >
                      {/* Existing Comments */}
                      <div className="space-y-4 mb-4">
                        {postComments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue flex-shrink-0">
                              <FiUser className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-background rounded-lg p-3">
                                <p className="text-sm text-gray-300">{comment.content}</p>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateComment(post.id);
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          className="p-2 bg-gradient-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
                        >
                          <FiSend className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {posts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 mb-4">No posts yet. Be the first to share!</p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
          >
            Create First Post
          </button>
        </motion.div>
      )}
    </div>
  );
}

function CreatePostModal({
  content,
  onChange,
  onSubmit,
  onClose,
}: {
  content: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl p-8 max-w-2xl w-full border border-accent-white"
      >
        <h2 className="text-2xl font-bold mb-4">Create Post</h2>
        <p className="text-sm text-gray-400 mb-4">
          Your post will be reviewed by admin before being published.
        </p>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share your thoughts, experiences, or ask questions..."
          rows={8}
          className="w-full px-4 py-3 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-accent-white/50 text-white rounded-lg hover:bg-accent-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
          >
            Submit Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
