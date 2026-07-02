// Comment out these imports for now
// import { useAuthStore } from '../../store/authStore';
// import { authService } from '../../services/authService';
// import { auth } from '../../config/firebase';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    toast.success('Welcome back!');
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    toast.success('Welcome!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
  <div className="flex justify-center mb-4">
    <img
      src="/logo.png"
      alt="PassionStreams Logo"
      className="h-16 w-16 object-contain"
    />
  </div>

  <h1 className="text-4xl font-bold mb-2">
    <span className="text-gradient-blue">
      Passion
    </span>
    <span className="text-gradient-pink">
      Streams
    </span>
  </h1>

  <p className="text-gray-400">
    Sign in to your account
  </p>
</div>

        <div className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-8 border border-accent-white">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-accent-white rounded-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-accent-white rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-blue text-white py-3 rounded-lg font-semibold"
            >
              Sign In
            </button>

          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-6 px-4 py-3 bg-background border border-accent-white rounded-lg"
          >
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-blue hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}