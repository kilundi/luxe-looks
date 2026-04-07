/**
 * Migration: Create activity_logs table
 * Tracks all CRUD operations for audit trail
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./luxe_looks.db');

console.log('Creating activity_logs table...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating activity_logs table:', err.message);
    } else {
      console.log('✓ Created activity_logs table');

      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)`, (err) => {
        if (err) console.error('Error creating user_id index:', err.message);
        else console.log('✓ Created index on user_id');
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at)`, (err) => {
        if (err) console.error('Error creating created_at index:', err.message);
        else console.log('✓ Created index on created_at');
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action)`, (err) => {
        if (err) console.error('Error creating action index:', err.message);
        else console.log('✓ Created index on action');
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id)`, (err) => {
        if (err) console.error('Error creating entity index:', err.message);
        else console.log('✓ Created index on entity_type, entity_id');
      });
    }

    db.close();
    console.log('\nMigration complete.');
  });
});
