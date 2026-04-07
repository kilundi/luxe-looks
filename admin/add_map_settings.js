const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/luxe_looks.db');

const defaults = [
  ['map_embed_contact', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.214801657642!2d37.6571884749646!3d-0.3202621996765874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1827b9216a3cab59%3A0x3c80e80a69b272d1!2sLuxe%20Looks%20Beauty%20and%20Cosmetics%2C%20Kenya!5e1!3m2!1sen!2ske!4v1775304808462!5m2!1sen!2ske'],
  ['contact_map_title', 'Find Us'],
  ['contact_map_subtitle', 'Based in Nairobi, we deliver across Kenya. Visit us virtually or come by for a pop-up event!'],
  ['map_embed_about', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5174.214801657642!2d37.6571884749646!3d-0.3202621996765874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1827b9216a3cab59%3A0x3c80e80a69b272d1!2sLuxe%20Looks%20Beauty%20and%20Cosmetics%2C%20Kenya!5e1!3m2!1sen!2ske!4v1775304808462!5m2!1sen!2ske'],
  ['delivery_map_title', 'Where to Find Us / Delivery Coverage'],
  ['delivery_map_subtitle', 'We deliver to all major towns across Kenya including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and more. Stay updated on our social media for occasional pop-up events!']
];

const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
defaults.forEach(d => stmt.run(d[0], d[1]));
stmt.finalize(() => {
  db.all("SELECT * FROM settings WHERE key LIKE '%map%' OR key LIKE '%delivery%' OR key LIKE '%contact_map%'", (err, rows) => {
    console.log(rows);
    db.close();
  });
});
