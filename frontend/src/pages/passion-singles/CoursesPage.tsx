import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiLock,
  FiUnlock,
  FiCheckCircle,
  FiPlayCircle,
  FiTrendingUp,
  // FiClock,
} from "react-icons/fi";
import { courseService } from "../../services/courseService";
// import { useAuthStore } from '../../store/authStore';
import type { Course, CourseProgress, CourseTier } from "@/shared/types";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<
    Record<string, CourseProgress>
  >({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | CourseTier>("ALL");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getCourses();
      setCourses(coursesData);

      // Fetch progress for each course
      const progressPromises = coursesData.map((course) =>
        courseService.getProgress(course.id).catch(() => null),
      );
      const progresses = await Promise.all(progressPromises);

      const progressObj: Record<string, CourseProgress> = {};
      progresses.forEach((progress, index) => {
        if (progress) {
          progressObj[coursesData[index].id] = progress;
        }
      });
      setProgressMap(progressObj);
    } catch (error: any) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses =
    filter === "ALL"
      ? courses
      : courses.filter((course) => course.tier === filter);

  const getProgress = (courseId: string): number => {
    return progressMap[courseId]?.completionPercentage || 0;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-gradient-blue">Courses</h1>
        <p className="text-gray-400">
          Enroll in free and premium courses to grow in your faith journey
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-4 mb-8"
      >
        {(["ALL", "FREE", "PREMIUM"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === tab
                ? "bg-gradient-blue text-white shadow-lg shadow-primary-blue/50"
                : "bg-accent-white/50 text-gray-300 hover:bg-accent-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredCourses.map((course) => {
            const progress = getProgress(course.id);
            const isCompleted = progress === 100;

            return (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white hover:border-primary-blue transition-all group overflow-hidden"
              >
                {/* Premium Badge */}
                {course.tier === "PREMIUM" && (
                  <div className="absolute top-4 right-4 bg-gradient-pink px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 z-10">
                    <FiLock className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 left-4 bg-gradient-blue px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 z-10">
                    <FiCheckCircle className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                )}

                {/* Thumbnail */}
                {course.thumbnailUrl ? (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg bg-primary-blue/20 flex items-center justify-center mb-4 group-hover:bg-primary-blue/30 transition-colors">
                    <FiBook className="w-16 h-16 text-primary-blue" />
                  </div>
                )}

                {/* Course Info */}
                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-blue transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-primary-blue font-semibold">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-accent-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-blue"
                      />
                    </div>
                  </div>
                )}

                {/* Course Meta */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <FiBook className="w-4 h-4" />
                    <span>{course.contents?.length || 0} Lessons</span>
                  </div>
                  {course.tier === "PREMIUM" && course.price && (
                    <span className="font-semibold text-primary-pink">
                      ${course.price}
                    </span>
                  )}
                </div>

                {/* Required for Connect Badge */}
                {course.requiredForConnect && (
                  <div className="mb-4 flex items-center space-x-2 text-xs text-flare-blue">
                    <FiTrendingUp className="w-4 h-4" />
                    <span>Required for Passion Connect</span>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/passion-singles/courses/${course.id}`}
                  className="block w-full px-4 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all text-center flex items-center justify-center space-x-2"
                >
                  {progress > 0 ? (
                    <>
                      <FiPlayCircle className="w-5 h-5" />
                      <span>
                        {isCompleted ? "Review Course" : "Continue Learning"}
                      </span>
                    </>
                  ) : (
                    <>
                      {course.tier === "PREMIUM" ? (
                        <>
                          <FiLock className="w-5 h-5" />
                          <span>Enroll Now</span>
                        </>
                      ) : (
                        <>
                          <FiUnlock className="w-5 h-5" />
                          <span>Start Course</span>
                        </>
                      )}
                    </>
                  )}
                </Link>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No courses found in this category.</p>
        </motion.div>
      )}
    </div>
  );
}
