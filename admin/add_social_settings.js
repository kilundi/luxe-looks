const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/luxe_looks.db');

const defaults = [
  ['tiktok', ''],
  ['footer_description', 'Timeless beauty, modern elegance. Your destination for premium beauty and luxury products in Kenya.']
];

const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
defaults.forEach(d => stmt.run(d[0], d[1]));
stmt.finalize(() => {
  db.all('SELECT * FROM settings WHERE key IN ("tiktok", "footer_description")', (err, rows) => {
    console.log(rows);
    db.close();
  });
});
