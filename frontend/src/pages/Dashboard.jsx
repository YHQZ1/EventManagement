import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Sparkles, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  LogOut, 
  BarChart3, 
  Users, 
  UserPlus,
  Settings,
  Crown,
  Trash2,
  Edit3
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-orange-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ab5244] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                
                <div className="flex items-center gap-3">
                  <Sparkles className="text-[#ab5244]" size={32} />
                  <h1 className="text-2xl font-bold text-gray-900">ISKCON Dashboard</h1>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {user.role === 'admin' && <Crown size={16} />}
                  {user.role.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#ab5244] text-white px-4 py-2 rounded-xl hover:bg-[#8f4437] flex items-center gap-2 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-orange-200/30">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-[#ab5244] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#ab5244] hover:bg-white/50'
                }`}
              >
                <User size={18} />
                My Profile
              </button>

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('stats');
                      fetchStats();
                    }}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                      activeTab === 'stats'
                        ? 'bg-[#ab5244] text-white shadow-lg'
                        : 'text-gray-600 hover:text-[#ab5244] hover:bg-white/50'
                    }`}
                  >
                    <BarChart3 size={18} />
                    Statistics
                  </button>
                  <button
                    onClick={fetchAllUsers}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                      activeTab === 'users'
                        ? 'bg-[#ab5244] text-white shadow-lg'
                        : 'text-gray-600 hover:text-[#ab5244] hover:bg-white/50'
                    }`}
                  >
                    <Users size={18} />
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActiveTab('adminRegister')}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                      activeTab === 'adminRegister'
                        ? 'bg-[#ab5244] text-white shadow-lg'
                        : 'text-gray-600 hover:text-[#ab5244] hover:bg-white/50'
                    }`}
                  >
                    <UserPlus size={18} />
                    Register Admin
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4">
          {/* Message Display */}
          {message && (
            <div className={`mb-8 p-4 rounded-xl border ${
              message.includes('successful') || message.includes('updated')
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <p className="font-medium">{message}</p>
                <button onClick={() => setMessage('')} className="text-current hover:opacity-70">
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">User Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <User className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{user.name}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Mail className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Shield className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">{user.role}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Bell className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">Notification Preference</label>
                    <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">{user.notificationPreference}</p>
                  </div>
                  
                  {user.phone && (
                    <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                      <Phone className="text-[#ab5244] mb-3" size={24} />
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab (Admin Only) */}
          {activeTab === 'stats' && user.role === 'admin' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">System Statistics</h2>
              </div>
              
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <Users className="text-blue-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-blue-800">Total Users</div>
                    <div className="text-3xl font-bold text-blue-900 mt-2">{stats.totalUsers}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 shadow-lg">
                    <Crown className="text-red-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-red-800">Admin Users</div>
                    <div className="text-3xl font-bold text-red-900 mt-2">{stats.adminUsers}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg">
                    <User className="text-green-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-green-800">Regular Users</div>
                    <div className="text-3xl font-bold text-green-900 mt-2">{stats.regularUsers}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200 shadow-lg">
                    <Bell className="text-purple-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-purple-800">Notifications</div>
                    <div className="mt-3 space-y-2">
                      {stats.notificationStats?.map(stat => (
                        <div key={stat._id} className="flex justify-between items-center text-sm">
                          <span className="text-purple-900 capitalize">{stat._id}:</span>
                          <span className="font-bold text-purple-900">{stat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No statistics loaded yet</p>
                  <button
                    onClick={fetchStats}
                    className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load Statistics
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Users Management Tab (Admin Only) */}
          {activeTab === 'users' && user.role === 'admin' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Users className="text-[#ab5244]" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>
                </div>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
                  {users.length} users
                </span>
              </div>
              
              {users.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-orange-200 shadow-lg">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-gradient-to-r from-orange-50 to-stone-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-100">
                      {users.map((userItem) => (
                        <tr key={userItem._id} className="hover:bg-orange-50/50 transition duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#ab5244] to-[#8f4437] rounded-full flex items-center justify-center text-white font-semibold">
                                {userItem.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {userItem.name}
                                  {userItem._id === user._id && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{userItem.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              userItem.role === 'admin' 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {userItem.role === 'admin' && <Crown size={12} />}
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {userItem._id !== user._id && (
                              <div className="flex items-center gap-2">
                                {userItem.role === 'user' ? (
                                  <button
                                    onClick={() => updateUserRole(userItem._id, 'admin')}
                                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition duration-200"
                                  >
                                    <Crown size={14} />
                                    Make Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateUserRole(userItem._id, 'user')}
                                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition duration-200"
                                  >
                                    <User size={14} />
                                    Make User
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteUser(userItem._id)}
                                  className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition duration-200"
                                >
                                  <Trash2 size={14} />
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
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No users loaded yet</p>
                  <button
                    onClick={fetchAllUsers}
                    className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load Users
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Admin Registration Tab (Admin Only) */}
          {activeTab === 'adminRegister' && user.role === 'admin' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <UserPlus className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Register New Admin</h2>
              </div>
              
              <form onSubmit={handleAdminRegister} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                        required
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ab5244] to-[#8f4437] text-white py-4 px-6 rounded-xl hover:shadow-xl transition duration-200 disabled:opacity-50 font-semibold text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Create Admin Account
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;