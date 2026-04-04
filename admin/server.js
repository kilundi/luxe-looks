const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'luxe-looks-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin-client')));

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// Database setup
const db = new sqlite3.Database('./luxe_looks.db');

// Create tables
db.serialize(() => {
  // Users table for admin authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    image TEXT,
    rating REAL DEFAULT 4.0,
    reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Image upload configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register admin user (one-time setup)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Admin user created successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== PRODUCT ROUTES ====================

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Create product
app.post('/api/products', authenticateToken, upload.single('image'), (req, res) => {
  const { name, category, price, description, rating, reviews } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    `INSERT INTO products (name, category, price, description, image, rating, reviews)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, category, price, description, image, rating || 4.0, reviews || 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        name,
        category,
        price,
        description,
        image,
        rating: rating || 4.0,
        reviews: reviews || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  );
});

// Update product
app.put('/api/products/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { name, category, price, description, rating, reviews } = req.body;
  const productId = req.params.id;

  // First get current product to check for existing image
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    db.run(
      `UPDATE products
       SET name = ?, category = ?, price = ?, description = ?,
           image = ?, rating = ?, reviews = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, category, price, description, image, rating, reviews, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          id: productId,
          name,
          category,
          price,
          description,
          image,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          created_at: product.created_at,
          updated_at: new Date().toISOString()
        });
      }
    );
  });
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const productId = req.params.id;

  // Get product to delete image file
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    db.run('DELETE FROM products WHERE id = ?', [productId], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  });
});

// Serve admin client
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-client', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/products`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
