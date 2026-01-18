import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-background border-b border-accent-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="PassionStreams Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold text-gradient-blue">
                PassionStreams
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <FiUser className="w-4 h-4 text-primary-blue" />
                  <span className="text-gray-300">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-primary-blue transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-primary-blue"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-accent-white">
          <div className="px-4 py-4 space-y-3">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <FiUser className="w-4 h-4 text-primary-blue" />
                  <span>{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-primary-blue w-full"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

