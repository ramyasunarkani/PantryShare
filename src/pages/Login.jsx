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
      <NavBar/>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Login to <span className="text-blue-500">PantryShare</span>
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
  <input
    type="email"
    placeholder="Enter your email"
    className="p-2 rounded-md border border-gray-300 mb-2"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  <input
    type="password"
    placeholder="Enter your password"
    className="p-2 rounded-md border border-gray-300 mb-2"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
    type="submit"
    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
  >
    Login
  </button>
</form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not registered?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
