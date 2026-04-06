/**
 * Migration: Create sessions table
 * Tracks active login sessions for session management and security
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./luxe_looks.db');

console.log('Creating sessions table...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_id TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err.message);
    } else {
      console.log('Created sessions table');
    }

    db.close();
  });
});
