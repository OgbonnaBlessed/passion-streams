import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gradient-blue">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
        >
          <FiHome className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}

