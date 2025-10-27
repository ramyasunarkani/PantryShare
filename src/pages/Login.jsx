import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../Store/auth-actions';
import NavBar from '../components/NavBar';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(login(email, password));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Welcome Back to <span className="text-green-600">PantryShare</span>
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 rounded-xl border placeholder-gray-400 border-gray-300 text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="p-3 rounded-xl border placeholder-gray-400 border-gray-300 text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-green-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
