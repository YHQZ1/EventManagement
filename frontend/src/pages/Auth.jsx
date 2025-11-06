/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowLeft, User, Mail, Lock, Phone, Bell, Shield } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login, register, registerAdmin, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    notificationPreference: 'instant'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;

      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else if (isAdminRegister) {
        result = await registerAdmin(formData);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        // The useEffect above will handle the redirect based on user role
        // No need to navigate here, it will happen automatically
      } else {
        setMessage(result.error);
      }
    } catch {
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminRegister(false);
    setMessage('');
    resetForm();
  };

  const toggleAdminRegister = () => {
    setIsAdminRegister(!isAdminRegister);
    setIsLogin(false);
    setMessage('');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      notificationPreference: 'instant'
    });
  };

  // Don't render if user is authenticated (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-orange-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ab5244] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-[#ab5244] to-[#8f4437] rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition duration-500">
              <div className="flex items-center gap-3 mb-8">
                <img 
    src="/iskcon_logo.jpg" // or your logo path
    alt="ISKCON Logo"
    className="w-12 h-12 object-contain"
  />
                <h1 className="text-3xl font-bold text-white">ISKCON Events</h1>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Empowering Spiritual Growth, Together
              </h2>
              
              <p className="text-orange-50 text-lg mb-8 leading-relaxed">
                Join our community to organize and participate in meaningful devotional events that bring spiritual seekers together.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={20} />
                  </div>
                  <span className="text-orange-50">Simple event management</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell size={20} />
                  </div>
                  <span className="text-orange-50">Smart notifications</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield size={20} />
                  </div>
                  <span className="text-orange-50">Secure and reliable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
              <Link 
                to="/" 
                className="text-[#ab5244] hover:text-[#8f4437] mb-6 inline-flex items-center gap-2 font-medium transition group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
                Back to Home
              </Link>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 lg:hidden">
                  <img 
    src="/iskcon_logo.jpg" // or your logo path
    alt="ISKCON Logo"
    className="w-12 h-12 object-contain"
  />
                  <h1 className="text-2xl font-bold text-gray-900">ISKCON Events</h1>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 
                   isAdminRegister ? 'Admin Registration' : 'Join Our Community'}
                </h2>
                <p className="text-gray-600">
                  {isLogin ? 'Sign in to manage your events' : 
                   isAdminRegister ? 'Create an admin account with elevated privileges' : 
                   'Create your account to get started'}
                </p>
                {isAdminRegister && (
                  <div className="mt-3 flex items-center gap-2 text-[#ab5244] bg-orange-50 px-3 py-2 rounded-lg">
                    <Shield size={18} />
                    <span className="text-sm font-medium">Admin privileges will be granted</span>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {!isLogin && !isAdminRegister && (
                  <div className="space-y-5 pt-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-gray-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="text-gray-400" size={20} />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notificationPreference" className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Preference
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Bell className="text-gray-400" size={20} />
                        </div>
                        <select
                          id="notificationPreference"
                          name="notificationPreference"
                          value={formData.notificationPreference}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition bg-white"
                        >
                          <option value="instant">Instant Notifications</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-white bg-[#ab5244] hover:bg-[#8f4437] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ab5244] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 
                       isAdminRegister ? 'Create Admin Account' : 'Create Account'}
                      <Sparkles size={18} />
                    </>
                  )}
                </button>

                {message && (
                  <div className={`p-4 rounded-xl ${
                    message.includes('successful') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </form>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[#ab5244] hover:text-[#8f4437] font-semibold transition"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                  
                  {!isLogin && !isAdminRegister && (
                    <div>
                      <button
                        type="button"
                        onClick={toggleAdminRegister}
                        className="text-gray-600 hover:text-[#ab5244] font-medium transition flex items-center gap-2 mx-auto"
                      >
                        <Shield size={16} />
                        Need admin access? Register as Admin
                      </button>
                    </div>
                  )}
                  
                  {isAdminRegister && (
                    <div>
                      <button
                        type="button"
                        onClick={toggleAdminRegister}
                        className="text-gray-600 hover:text-[#ab5244] font-medium transition"
                      >
                        Want regular user account? Register as User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;