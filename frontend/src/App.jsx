import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Protected Route Components
const ProtectedUserRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/auth" replace />;
  if (user?.role !== 'user') return <Navigate to="/admin-dashboard" replace />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/auth" replace />;
  if (user?.role !== 'admin') return <Navigate to="/user-dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            {/* Separate dashboard routes - no old /dashboard route */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedUserRoute>
                  <UserDashboard />
                </ProtectedUserRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;