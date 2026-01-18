import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBook,
  FiUsers,
  FiMessageCircle,
  // FiHome,
  FiHeart,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";

interface ModuleNavigationProps {
  module: "singles" | "connect" | "couples";
}

export default function ModuleNavigation({ module }: ModuleNavigationProps) {
  const location = useLocation();
  const basePath = `/passion-${module}`;

  const getNavItems = () => {
    switch (module) {
      case "singles":
        return [
          {
            path: `${basePath}/training-library`,
            label: "Training Library",
            icon: FiBook,
          },
          { path: `${basePath}/courses`, label: "Courses", icon: FiUsers },
          {
            path: `${basePath}/community`,
            label: "Community",
            icon: FiMessageCircle,
          },
          { path: `${basePath}/chat`, label: "Chat", icon: FiMessageCircle },
        ];
      case "connect":
        return [
          { path: `${basePath}/discover`, label: "Discover", icon: FiHeart },
          {
            path: `${basePath}/connections`,
            label: "Connections",
            icon: FiUsers,
          },
          { path: `${basePath}/profile`, label: "Profile", icon: FiSettings },
        ];
      case "couples":
        return [
          {
            path: `${basePath}/content-library`,
            label: "Content Library",
            icon: FiBook,
          },
          {
            path: `${basePath}/community`,
            label: "Community",
            icon: FiMessageCircle,
          },
          {
            path: `${basePath}/counseling`,
            label: "Counseling",
            icon: FiTrendingUp,
          },
          { path: `${basePath}/chat`, label: "Chat", icon: FiMessageCircle },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="mb-8 border-b border-accent-white">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {({ isActive: navIsActive }) => (
                <>
                  <Icon className="w-4 h-4" />
                  <span
                    className={
                      navIsActive ? "text-primary-blue" : "text-gray-400"
                    }
                  >
                    {item.label}
                  </span>
                  {navIsActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-blue"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
