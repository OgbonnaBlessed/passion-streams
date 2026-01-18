import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle, FiCheckCircle, FiLock, FiArrowLeft, FiBook, FiTrendingUp } from 'react-icons/fi';
import { courseService } from '../../services/courseService';
import { contentService } from '../../services/contentService';
import type { Course, CourseProgress, Content } from '@/shared/types';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [courseData, progressData] = await Promise.all([
        courseService.getCourseById(id),
        courseService.getProgress(id).catch(() => null),
      ]);

      setCourse(courseData);
      setProgress(progressData);

      // Fetch contents
      if (courseData.contents && courseData.contents.length > 0) {
        const contentsData = await Promise.all(
          courseData.contents.map((contentId: string) =>
            contentService.getContentById(contentId).catch(() => null)
          )
        );
        setContents(contentsData.filter(Boolean) as Content[]);
      }
    } catch (error: any) {
      toast.error('Failed to load course');
      navigate('/passion-singles/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleContentComplete = async (contentId: string) => {
    if (!id || !progress) return;

    const completedContents = progress.completedContents || [];
    if (completedContents.includes(contentId)) return;

    const newCompletedContents = [...completedContents, contentId];
    const totalContents = course?.contents.length || 1;
    const newCompletionPercentage = Math.round(
      (newCompletedContents.length / totalContents) * 100
    );

    try {
      const updatedProgress = await courseService.updateProgress(id, {
        completedContents: newCompletedContents,
        completionPercentage: newCompletionPercentage,
      });
      setProgress(updatedProgress);
      toast.success('Progress updated!');
    } catch (error: any) {
      toast.error('Failed to update progress');
    }
  };

  const isContentCompleted = (contentId: string): boolean => {
    return progress?.completedContents?.includes(contentId) || false;
  };

  const completionPercentage = progress?.completionPercentage || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Course not found</p>
        <Link
          to="/passion-singles/courses"
          className="text-primary-blue hover:underline"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/passion-singles/courses')}
        className="flex items-center space-x-2 text-gray-400 hover:text-primary-blue transition-colors mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </motion.button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {course.thumbnailUrl && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gradient-blue">{course.title}</h1>
            <p className="text-gray-400 text-lg">{course.description}</p>
          </div>
          {course.tier === 'PREMIUM' && course.price && (
            <div className="ml-4 px-4 py-2 bg-gradient-pink rounded-lg text-white font-semibold">
              ${course.price}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Course Progress</span>
              <span className="text-primary-blue font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-accent-white rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-blue"
              />
            </div>
            {completionPercentage === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-gradient-blue/20 rounded-lg border border-primary-blue/50 flex items-center space-x-2"
              >
                <FiCheckCircle className="w-5 h-5 text-primary-blue" />
                <span className="text-primary-blue font-semibold">
                  Course Completed! 🎉
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Required for Connect Badge */}
        {course.requiredForConnect && (
          <div className="flex items-center space-x-2 text-sm text-flare-blue mb-4">
            <FiTrendingUp className="w-4 h-4" />
            <span>This course is required for Passion Connect</span>
          </div>
        )}
      </motion.div>

      {/* Course Contents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <FiBook className="w-6 h-6 text-primary-blue" />
          <span>Course Content</span>
        </h2>

        <div className="space-y-3">
          {contents.map((content, index) => {
            const isCompleted = isContentCompleted(content.id);
            const isLocked = course.tier === 'PREMIUM' && !progress; // Simplified

            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isLocked && setSelectedContent(content)}
                className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  isLocked
                    ? 'border-gray-600 opacity-50 cursor-not-allowed'
                    : isCompleted
                    ? 'border-green-500/50 bg-green-500/10 hover:border-green-500/80'
                    : 'border-accent-white hover:border-primary-blue bg-background/50'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500/20 text-green-400'
                    : isLocked
                    ? 'bg-gray-600/20 text-gray-500'
                    : 'bg-primary-blue/20 text-primary-blue'
                }`}>
                  {isCompleted ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : isLocked ? (
                    <FiLock className="w-5 h-5" />
                  ) : (
                    <FiPlayCircle className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    Lesson {index + 1}: {content.title}
                  </div>
                  <div className="text-sm text-gray-400">{content.type}</div>
                </div>

                {isCompleted && (
                  <div className="text-sm text-green-400 font-semibold">Completed</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {selectedContent && (
          <ContentViewer
            content={selectedContent}
            isCompleted={isContentCompleted(selectedContent.id)}
            onClose={() => setSelectedContent(null)}
            onComplete={() => handleContentComplete(selectedContent.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ContentViewer({
  content,
  isCompleted,
  onClose,
  onComplete,
}: {
  content: Content;
  isCompleted: boolean;
  onClose: () => void;
  onComplete: () => void;
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
        className="bg-background rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto border border-accent-white"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{content.title}</h2>
          {!isCompleted && (
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-gradient-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-blue/50 transition-all flex items-center space-x-2"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>Mark as Complete</span>
            </button>
          )}
        </div>

        <p className="text-gray-400 mb-6">{content.description}</p>

        {content.type === 'PDF' && (
          <iframe
            src={content.url}
            className="w-full h-[600px] rounded-lg border border-accent-white"
            title={content.title}
          />
        )}

        {content.type === 'AUDIO' && (
          <audio controls className="w-full">
            <source src={content.url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        )}

        {content.type === 'VIDEO' && (
          <video controls className="w-full rounded-lg">
            <source src={content.url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )}

        {content.type === 'ARTICLE' && (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">Article content loading...</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

