import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatusCalendar from '../components/StatusCalendar';

interface DashboardProps {
  onLogout: () => void;
}

interface StatusHistory {
  status: string;
  date: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [todayStatus, setTodayStatus] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchUserData();
    fetchTodayStatus();
    fetchStatusHistory();
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

  const fetchTodayStatus = async () => {
    try {
      const response = await axios.get('/api/status/today', axiosConfig);
      setTodayStatus(response.data.status);
      setSelectedStatus(response.data.status || '');
    } catch (error) {
      console.error('Error fetching today status:', error);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      const response = await axios.get('/api/status/my-history', axiosConfig);
      setStatusHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleLogStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      setMessage('Please select a status');
      setMessageType('error');
      return;
    }

    try {
      await axios.post(
        '/api/status/log',
        { status: selectedStatus },
        axiosConfig
      );
      setMessage('Status logged successfully!');
      setMessageType('success');
      setTodayStatus(selectedStatus);
      fetchStatusHistory();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to log status');
      setMessageType('error');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <div className="navbar">
        <h1>Work Status Logger</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Log Your Work Status</h2>

          {message && (
            <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogStatus}>
            <div className="input-group">
              <label>Select Your Status for Today</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="in_office">In Office</option>
                <option value="wfh">Work From Home (WFH)</option>
                <option value="business_trip">Business Trip</option>
                <option value="off">Off</option>
              </select>
            </div>

            <button type="submit" className="button" style={{ width: '100%' }}>
              Log Status
            </button>
          </form>

          {todayStatus && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem', color: '#666' }}>Today's Status:</p>
              <span className={`status-badge status-${todayStatus}`}>
                {todayStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <StatusCalendar token={token || ''} title="Your Status Calendar" />
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Status History (Last 30 Days)</h2>

          {statusHistory.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${entry.status}`}>
                        {entry.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#666' }}>No status history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
