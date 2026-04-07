/**
 * Migration: Add subtitle to categories table
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./luxe_looks.db');

console.log('Adding subtitle column to categories...');

db.serialize(() => {
  db.run(`ALTER TABLE categories ADD COLUMN subtitle TEXT`, (err) => {
    if (err) {
      console.error('Error adding column:', err.message);
    } else {
      console.log('✓ Added subtitle column to categories');
    }
    db.close();
  });
});
