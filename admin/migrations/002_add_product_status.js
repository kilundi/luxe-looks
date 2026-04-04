/**
 * Migration: Add status field to products table
 * Products will have status: 'draft' | 'published' | 'archived'
 * Default value: 'published'
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./luxe_looks.db');

console.log('Adding status column to products table...');

db.serialize(() => {
  // Add status column if it doesn't exist
  db.run(`ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'published'`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column')) {
        console.log('✓ Status column already exists');
      } else {
        console.error('Error adding status column:', err.message);
      }
    } else {
      console.log('✓ Added status column to products table');

      // Update existing products to 'published' status
      db.run(`UPDATE products SET status = 'published' WHERE status IS NULL`, (err) => {
        if (err) {
          console.error('Error updating existing products:', err.message);
        } else {
          console.log('✓ Set default status for existing products');
        }

        // Show final schema
        db.all(`PRAGMA table_info(products)`, (err, rows) => {
          if (err) {
            console.error('Error fetching schema:', err.message);
          } else {
            console.log('\nCurrent products table schema:');
            console.log(rows.map(r => `${r.name} ${r.type}${r.notnull ? ' NOT NULL' : ''}${r.dflt_value ? ' DEFAULT ' + JSON.stringify(r.dflt_value) : ''}`).join('\n'));
          }
          db.close();
        });
      });
    }
  });
});
