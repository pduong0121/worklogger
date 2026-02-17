import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmployeeCalendarProps {
  token: string;
  employeeId: number;
  employeeName: string;
}

interface CalendarDay {
  date: string;
  status: string | null;
  isCurrentMonth: boolean;
}

const EmployeeCalendar: React.FC<EmployeeCalendarProps> = ({ token, employeeId, employeeName }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [statusHistory, setStatusHistory] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchEmployeeHistory();
  }, [currentMonth, employeeId]);

  const fetchEmployeeHistory = async () => {
    try {
      const response = await axios.get(
        `/api/status/employee/${employeeId}/history?limit=365`,
        axiosConfig
      );
      const historyMap: { [key: string]: string } = {};
      
      response.data.forEach((entry: { status: string; date: string }) => {
        historyMap[entry.date] = entry.status;
      });
      
      setStatusHistory(historyMap);
      generateCalendar(historyMap);
    } catch (error) {
      console.error('Error fetching employee history:', error);
    }
  };

  const generateCalendar = (history: { [key: string]: string }) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevLastDate - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        status: history[dateStr] || null,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        status: history[dateStr] || null,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    for (let i = 1; days.length < 42; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        status: history[dateStr] || null,
        isCurrentMonth: false
      });
    }
    
    setCalendarDays(days);
  };

  const getStatusColor = (status: string | null): string => {
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
        return '#f8f9fa';
    }
  };

  const getStatusLabel = (status: string | null): string => {
    if (!status) return 'No status';
    return status.replace('_', ' ').toUpperCase();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>{employeeName}'s Status Calendar</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="button button-secondary" onClick={handlePrevMonth} style={{ padding: '0.5rem 1rem' }}>
          ← Previous
        </button>
        <h4 style={{ margin: 0, color: '#333' }}>{monthYear}</h4>
        <button className="button button-secondary" onClick={handleNextMonth} style={{ padding: '0.5rem 1rem' }}>
          Next →
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Sun</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Mon</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Tue</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Wed</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Thu</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Fri</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Sat</th>
            </tr>
          </thead>
          <tbody>
            {Array(6).fill(null).map((_, weekIndex) => (
              <tr key={weekIndex}>
                {Array(7).fill(null).map((_, dayIndex) => {
                  const dayIndex_abs = weekIndex * 7 + dayIndex;
                  const day = calendarDays[dayIndex_abs];
                  
                  return (
                    <td
                      key={dayIndex_abs}
                      onClick={() => setSelectedDate(day.date)}
                      style={{
                        width: '14.28%',
                        aspectRatio: '1',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        backgroundColor: day.isCurrentMonth ? getStatusColor(day.status) : '#f8f9fa',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        opacity: day.isCurrentMonth ? 1 : 0.6,
                        transition: 'all 0.2s',
                        borderWidth: selectedDate === day.date ? '2px' : '1px',
                        borderColor: selectedDate === day.date ? '#667eea' : '#ddd'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>
                        {parseInt(day.date.split('-')[2])}
                      </div>
                      {day.status && day.isCurrentMonth && (
                        <div style={{ fontSize: '0.65rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {day.status === 'in_office' && '🏢'}
                          {day.status === 'wfh' && '🏠'}
                          {day.status === 'business_trip' && '✈️'}
                          {day.status === 'off' && '📅'}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDate && (
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            <strong>Date:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
          </p>
          <p style={{ margin: 0, color: '#333' }}>
            <strong>Status:</strong>{' '}
            <span className={`status-badge status-${statusHistory[selectedDate] || 'not_logged'}`}>
              {getStatusLabel(statusHistory[selectedDate])}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeCalendar;
