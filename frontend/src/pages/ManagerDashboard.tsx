import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeCalendar from '../components/EmployeeCalendar';

interface ManagerDashboardProps {
  onLogout: () => void;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [employeeHistory, setEmployeeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchUserData();
    fetchTeamStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me', axiosConfig);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamStatus = async () => {
    try {
      const response = await axios.get('/api/status/team-today', axiosConfig);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching team status:', error);
    }
  };

  const fetchEmployeeHistory = async (employeeId: number) => {
    try {
      const response = await axios.get(
        `/api/status/employee/${employeeId}/history`,
        axiosConfig
      );
      setEmployeeHistory(response.data);
    } catch (error) {
      console.error('Error fetching employee history:', error);
    }
  };

  const handleViewHistory = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setShowHistory(true);
    fetchEmployeeHistory(employeeId);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_office':
        return '#d4edda';
      case 'wfh':
        return '#cce5ff';
      case 'business_trip':
        return '#fff3cd';
      case 'off':
        return '#f8d7da';
      default:
        return '#e2e3e5';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <div className="navbar">
        <h1>Manager Dashboard - Work Status</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
            Today's Employee Status - {new Date().toLocaleDateString()}
          </h2>

          {employees.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td style={{ fontWeight: 500 }}>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span className={`status-badge status-${employee.status}`}>
                          {employee.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          className="button button-secondary"
                          onClick={() => handleViewHistory(employee.id)}
                          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666' }}>No employees found</p>
          )}
        </div>

        {showHistory && selectedEmployee && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#333', margin: 0 }}>
                Status History - {employees.find(e => e.id === selectedEmployee)?.name}
              </h2>
              <button
                className="button button-secondary"
                onClick={() => {
                  setShowHistory(false);
                  setSelectedEmployee(null);
                  setEmployeeHistory([]);
                }}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                Close
              </button>
            </div>

            <EmployeeCalendar 
              token={token || ''} 
              employeeId={selectedEmployee}
              employeeName={employees.find(e => e.id === selectedEmployee)?.name || 'Employee'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
