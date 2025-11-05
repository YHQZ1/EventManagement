import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('profile');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    notificationPreference: 'instant'
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get('http://localhost:5001/api/auth/me');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };
    checkAuth();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let url;
      let payload;

      if (isLogin) {
        url = 'http://localhost:5001/api/auth/login';
        payload = { email: formData.email, password: formData.password };
      } else if (isAdminRegister) {
        url = 'http://localhost:5001/api/auth/admin/register';
        payload = formData;
      } else {
        url = 'http://localhost:5001/api/auth/register';
        payload = formData;
      }

      const response = await axios.post(url, payload);
      
      const { token: newToken, user: userData } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(userData);
      
      setMessage(`${isLogin ? 'Login' : 'Registration'} successful!`);
      resetForm();
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setMessage('Logged out successfully!');
    setActiveTab('profile');
    setUsers([]);
    setStats(null);
  };

  // Toggle between login/register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminRegister(false);
    setMessage('');
    resetForm();
  };

  // Toggle admin register
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

  // Admin functions
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/admin/users');
      setUsers(response.data);
      setActiveTab('users');
    } catch (error) {
      setMessage('Access denied: Admin privileges required');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/admin/stats');
      setStats(response.data);
      setActiveTab('stats');
    } catch (error) {
      setMessage('Failed to fetch statistics');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5001/api/auth/admin/users/${userId}/role`, {
        role: newRole
      });
      setMessage(`User role updated to ${newRole}`);
      fetchAllUsers(); // Refresh users list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5001/api/auth/admin/users/${userId}`);
        setMessage('User deleted successfully');
        fetchAllUsers(); // Refresh users list
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  🚀 ISKCON Events
                </h1>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Profile
              </button>

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'stats'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Statistics
                  </button>
                  <button
                    onClick={fetchAllUsers}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'users'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActiveTab('adminRegister')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'adminRegister'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Register Admin
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-md ${
                message.includes('successful') || message.includes('updated') || message.includes('Found')
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notification Preference</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{user.notificationPreference}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab (Admin Only) */}
            {activeTab === 'stats' && user.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">System Statistics</h3>
                  {stats ? (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Total Users</div>
                        <div className="mt-1 text-3xl font-semibold text-blue-900">{stats.totalUsers}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-green-800">Admin Users</div>
                        <div className="mt-1 text-3xl font-semibold text-green-900">{stats.adminUsers}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-purple-800">Regular Users</div>
                        <div className="mt-1 text-3xl font-semibold text-purple-900">{stats.regularUsers}</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-orange-800">Notification Types</div>
                        <div className="mt-1 text-sm text-orange-900">
                          {stats.notificationStats?.map(stat => (
                            <div key={stat._id}>{stat._id}: {stat.count}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={fetchStats}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Load Statistics
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Users Management Tab (Admin Only) */}
            {activeTab === 'users' && user.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Users</h3>
                    <span className="text-sm text-gray-500">{users.length} users found</span>
                  </div>
                  
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notifications</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((userItem) => (
                            <tr key={userItem._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {userItem.name}
                                {userItem._id === user._id && (
                                  <span className="ml-2 text-xs text-blue-600">(You)</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  userItem.role === 'admin' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {userItem.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                {userItem.notificationPreference}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {userItem._id !== user._id && (
                                  <div className="space-x-2">
                                    {userItem.role === 'user' ? (
                                      <button
                                        onClick={() => updateUserRole(userItem._id, 'admin')}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Make Admin
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => updateUserRole(userItem._id, 'user')}
                                        className="text-orange-600 hover:text-orange-900"
                                      >
                                        Make User
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteUser(userItem._id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <button
                      onClick={fetchAllUsers}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Load Users
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Admin Registration Tab (Admin Only) */}
            {activeTab === 'adminRegister' && user.role === 'admin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Register New Admin</h3>
                  <div className="mt-5">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {loading ? 'Creating Admin...' : 'Create Admin Account'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Login/Register Form (Unauthenticated State)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ISKCON Events</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 
             isAdminRegister ? 'Create Admin Account' : 'Create a new account'}
          </p>
          {isAdminRegister && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-md text-sm mt-2">
              ⚠️ Admin registration - elevated privileges
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && !isAdminRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Preference
                </label>
                <select
                  name="notificationPreference"
                  value={formData.notificationPreference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 
             isLogin ? 'Sign In' : 
             isAdminRegister ? 'Create Admin Account' : 'Create User Account'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 space-y-3 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          
          {!isLogin && !isAdminRegister && (
            <p className="text-gray-600">
              Need admin access?{' '}
              <button
                onClick={toggleAdminRegister}
                className="text-red-600 hover:text-red-500 font-medium focus:outline-none"
              >
                Register as Admin
              </button>
            </p>
          )}

          {isAdminRegister && (
            <p className="text-gray-600">
              Want regular user account?{' '}
              <button
                onClick={toggleAdminRegister}
                className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none"
              >
                Register as User
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;