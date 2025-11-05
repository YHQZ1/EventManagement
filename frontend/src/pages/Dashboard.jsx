import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    notificationPreference: 'instant'
  });

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle input changes for admin registration
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Admin registration
  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/admin/register', formData);
      setMessage('Admin registered successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        notificationPreference: 'instant'
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
      fetchAllUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5001/api/auth/admin/users/${userId}`);
        setMessage('User deleted successfully');
        fetchAllUsers();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">ISKCON Dashboard</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto">
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
      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successful') || message.includes('updated')
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notification Preference</label>
                <p className="mt-1 text-lg text-gray-900 capitalize">{user.notificationPreference}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab (Admin Only) */}
        {activeTab === 'stats' && user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Total Users</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Admin Users</div>
                  <div className="text-2xl font-bold text-green-900">{stats.adminUsers}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-800">Regular Users</div>
                  <div className="text-2xl font-bold text-purple-900">{stats.regularUsers}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-orange-800">Notification Types</div>
                  <div className="mt-2 space-y-1">
                    {stats.notificationStats?.map(stat => (
                      <div key={stat._id} className="text-sm text-orange-900">
                        {stat._id}: {stat.count}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={fetchStats}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Load Statistics
              </button>
            )}
          </div>
        )}

        {/* Users Management Tab (Admin Only) */}
        {activeTab === 'users' && user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
              <span className="text-gray-500">{users.length} users</span>
            </div>
            
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {userItem.name}
                          {userItem._id === user._id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{userItem.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded text-xs ${
                            userItem.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Load Users
              </button>
            )}
          </div>
        )}

        {/* Admin Registration Tab (Admin Only) */}
        {activeTab === 'adminRegister' && user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Admin</h2>
            <form onSubmit={handleAdminRegister} className="max-w-md space-y-4">
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
        )}
      </main>
    </div>
  );
};

export default Dashboard;