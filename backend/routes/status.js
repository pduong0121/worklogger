const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const STATUS_OPTIONS = ['in_office', 'wfh', 'business_trip', 'off'];

// Log work status for today
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.userId;

    if (!status || !STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + STATUS_OPTIONS.join(', ')
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const result = await db.run(
      `INSERT OR REPLACE INTO work_status (user_id, status, date) VALUES (?, ?, ?)`,
      [userId, status, today]
    );

    res.json({
      message: 'Status logged successfully',
      status: { user_id: userId, status, date: today }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's status history
router.get('/my-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = req.query.limit || 30;

    const history = await db.all(
      `SELECT status, date FROM work_status 
       WHERE user_id = ? 
       ORDER BY date DESC 
       LIMIT ?`,
      [userId, limit]
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's status for current user
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    const status = await db.get(
      `SELECT status FROM work_status WHERE user_id = ? AND date = ?`,
      [userId, today]
    );

    res.json({ status: status?.status || null, date: today });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all employees' status for today (manager only)
router.get('/team-today', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'manager' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date().toISOString().split('T')[0];

    const teamStatus = await db.all(
      `SELECT u.id, u.name, u.email, COALESCE(ws.status, 'not_logged') as status
       FROM users u
       LEFT JOIN work_status ws ON u.id = ws.user_id AND ws.date = ?
       WHERE u.role = 'employee'
       ORDER BY u.name`,
      [today]
    );

    res.json({ date: today, employees: teamStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee's status history (manager only)
router.get('/employee/:employeeId/history', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'manager' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { employeeId } = req.params;
    const limit = req.query.limit || 30;

    const history = await db.all(
      `SELECT u.name, u.email, ws.status, ws.date 
       FROM work_status ws
       JOIN users u ON ws.user_id = u.id
       WHERE ws.user_id = ?
       ORDER BY ws.date DESC
       LIMIT ?`,
      [employeeId, limit]
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
