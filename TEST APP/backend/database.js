const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'workstatus.db');
let db;

const Database = {
  init() {
    return new Promise((resolve, reject) => {
      db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async initializeDatabase() {
    try {
      await this.init();
      
      // Create users table
      await this.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'employee',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create work_status table
      await this.run(`
        CREATE TABLE IF NOT EXISTS work_status (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          date DATE NOT NULL,
          logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id),
          UNIQUE(user_id, date)
        )
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  },

  getDb() {
    return db;
  }
};

module.exports = Database;
