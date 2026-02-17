import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to={userRole === 'manager' || userRole === 'admin' ? '/manager' : '/dashboard'} /> :
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to={userRole === 'manager' || userRole === 'admin' ? '/manager' : '/dashboard'} /> :
            <Register onRegister={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} /> :
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/manager" 
          element={
            isAuthenticated && (userRole === 'manager' || userRole === 'admin') ? 
            <ManagerDashboard onLogout={handleLogout} /> :
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? (userRole === 'manager' || userRole === 'admin' ? '/manager' : '/dashboard') : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
