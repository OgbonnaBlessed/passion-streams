import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiFileText,
  FiHeadphones,
  FiPlayCircle,
  // FiDownload,
  FiLock,
} from "react-icons/fi";
import { contentService } from "../../services/contentService";
import type { Content, ContentType, ModuleAccess } from "@/shared/types";
import toast from "react-hot-toast";

export default function TrainingLibraryPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedType, selectedCategory]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await contentService.getContent("PASSION_SINGLES");
      setContent(data);
      setFilteredContent(data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category).filter(Boolean)),
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error: any) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedType !== "ALL") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredContent(filtered);
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "PDF":
        return <FiFileText className="w-6 h-6" />;
      case "AUDIO":
        return <FiHeadphones className="w-6 h-6" />;
      case "VIDEO":
        return <FiPlayCircle className="w-6 h-6" />;
      default:
        return <FiFileText className="w-6 h-6" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        <h1 className="text-4xl font-bold mb-2 text-gradient-blue">
          Training Library
        </h1>
        <p className="text-gray-400">
          Browse PDFs, audio teachings, and faith-based content
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-accent-white/50 border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as ContentType | "ALL")
              }
              className="px-4 py-2 bg-accent-white/50 border border-accent-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="ALL">All Types</option>
              <option value="PDF">PDFs</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Videos</option>
              <option value="ARTICLE">Articles</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-accent-white/50 border border-accent-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredContent.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedContent(item)}
              className="relative bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white cursor-pointer hover:border-primary-blue transition-all group"
            >
              {/* Premium Badge */}
              {item.isPremium && (
                <div className="absolute top-4 right-4 bg-gradient-pink px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <FiLock className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-primary-blue/20 flex items-center justify-center text-primary-blue mb-4 group-hover:bg-primary-blue/30 transition-colors">
                {getContentIcon(item.type)}
              </div>

              {/* Content Info */}
              <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-blue transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                {item.duration && <span>{formatDuration(item.duration)}</span>}
                {item.category && (
                  <span className="px-2 py-1 bg-primary-blue/20 rounded text-primary-blue">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">
            No content found. Try adjusting your filters.
          </p>
        </motion.div>
      )}

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {selectedContent && (
          <ContentViewer
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ContentViewer({
  content,
  onClose,
}: {
  content: Content;
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
        className="bg-background rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto border border-accent-white"
      >
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-gray-400 mb-6">{content.description}</p>

        {content.type === "PDF" && (
          <iframe
            src={content.url}
            className="w-full h-[600px] rounded-lg border border-accent-white"
            title={content.title}
          />
        )}

        {content.type === "AUDIO" && (
          <audio controls className="w-full">
            <source src={content.url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        )}

        {content.type === "VIDEO" && (
          <video controls className="w-full rounded-lg">
            <source src={content.url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )}

        {content.type === "ARTICLE" && (
          <div className="prose prose-invert max-w-none">
            {/* Article content would be loaded here */}
            <p className="text-gray-300">Article content loading...</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
