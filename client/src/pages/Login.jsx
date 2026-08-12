import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Mail, Lock, Box, ShieldAlert, KeyRound, Users, ChevronDown } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Please select a user role.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(email, password, role);
      // Save token and user details to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update application auth state
      onLoginSuccess(data.user);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to quickly fill demo credentials
  const fillCredentials = (demoEmail, demoPassword, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gray-50 px-4">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl z-10">
        <div className="text-center bg-white py-[30px] animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-purple-700 rounded-2xl shadow-lg shadow-purple-650/20 mb-3 hover:scale-105 transition-transform duration-300">
            <Box className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            SmartAsset
          </h1>
          <p className="text-sm text-purple-600 mt-2">
            Role-Based Inventory & Asset Platform
          </p>
        </div>
        <div className="bg-white border-gray-200  p-8 shadow-xl relative">


          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                User Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-350 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="" disabled className="text-gray-400">Choose your role</option>
                  <option value="admin" className="text-gray-900">Admin</option>
                  <option value="manager" className="text-gray-900">Manager</option>
                  <option value="employee" className="text-gray-900">Employee</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-350 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-350 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-purple-600/10 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
