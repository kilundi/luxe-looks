# Admin Panel Setup Guide

Complete guide to setting up and using the Luxe Looks Admin Panel.

## 📋 Prerequisites

- Node.js (v14 or higher) installed
- MongoDB or SQLite (SQLite is used by default, no separate installation needed)

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd admin
npm install
```

### Step 2: Start the Admin Server

```bash
npm start
```

The server will start on **http://localhost:3001**

### Step 3: Create Admin Account

You have two options:

**Option A: Use the init script** (recommended)
```bash
node init-admin.js
```
Follow the prompts to create your admin account.

**Option B: Register via the UI**
1. Go to http://localhost:3001/admin
2. Click "Create admin account"
3. Fill in username and password (min 6 characters)

### Step 4: Access the Admin Panel

1. Open http://localhost:3001/admin in your browser
2. Login with your credentials
3. Start managing products!

## 📊 Admin Panel Features

### Product Management

**Add Product:**
1. Click "+ Add Product" button
2. Fill in product details:
   - Name (required)
   - Category (required): Fragrances, Beauty, Hair, Bags, Watches, Jewelry
   - Price (required): e.g., "KSh 4,500"
   - Description (optional)
   - Rating (0-5, default: 4.0)
   - Reviews count (default: 0)
   - Product image (optional, max 5MB)
3. Click "Save Product"

**Edit Product:**
- Click the "Edit" button on any product card
- Modify the fields
- Click "Save Product"

**Delete Product:**
- Click the "Delete" button on any product card
- Confirm deletion (this also removes the image file)

### Image Guidelines

- **Format:** JPEG, PNG, GIF, WebP
- **Max Size:** 5MB
- **Recommended Dimensions:** 800x600px or larger
- Images are stored in `/admin/uploads/`

### Categories

Products are organized into these categories:
- **Fragrances** - Oil-based perfumes
- **Beauty** - Cosmetics & Skincare
- **Hair** - Human hair products
- **Bags** - Luxury handbags
- **Watches** - Luxury timepieces
- **Jewelry** - Fine accessories

## 🔗 API Integration

### Frontend Connection

The React frontend automatically fetches products from:
```
GET http://localhost:3001/api/products
```

No authentication required for reading products (public API).

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Get all products |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |
| POST | `/api/login` | ❌ | Admin login |
| POST | `/api/register` | ❌ | Create admin |

### Authentication

For write operations (POST/PUT/DELETE), include the JWT token:
```
Authorization: Bearer <your-token>
```

## 🔒 Security

### Change JWT Secret

**IMPORTANT:** Change the default JWT secret in `admin/server.js`:

```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-random-string-here';
```

Or use environment variables:
```bash
JWT_SECRET=your-random-secret-key node server.js
```

### Production Considerations

- Use a proper database (PostgreSQL/MySQL) instead of SQLite
- Enable HTTPS
- Implement rate limiting
- Add request logging
- Set up regular backups
- Use environment variables for all secrets

## 🗄️ Database Schema

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### products table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  image TEXT,  -- file path
  rating REAL DEFAULT 4.0,
  reviews INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Troubleshooting

### "Cannot POST /api/register"
- Make sure the server is running: `node server.js`
- Check that port 3001 is not in use

### Images not uploading
- Check `admin/uploads/` directory exists and is writable
- Verify image size is under 5MB
- Ensure file format is supported (jpeg, jpg, png, gif, webp)

### Products not showing on frontend
- Confirm admin server is running on port 3001
- Check browser console for CORS errors
- Verify products exist in database

### Database locked
- Another process might be using the database
- Stop all Node processes and try again
- As last resort, delete `admin/luxe_looks.db` and restart server

### Port already in use
Change the port in `admin/server.js`:
```javascript
const PORT = process.env.PORT || 3002; // Change 3001 to 3002
```

## 🔄 Restart the Admin Server

If you make changes to `server.js` or add new tables:
```bash
# Stop the server (Ctrl + C)
# Then restart
npm start
```

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error messages in browser console and terminal
3. Verify all prerequisites are installed

## 🎯 Workflow

### Daily Operations:

1. **Start admin server** (keep running in background):
   ```bash
   cd admin
   npm start
   ```

2. **Open admin panel**:
   - Visit http://localhost:3001/admin
   - Login with your credentials

3. **Manage products**:
   - Add new products with images
   - Update prices and descriptions
   - Remove out-of-stock items

4. **View on frontend**:
   - Visit http://localhost:5173
   - Products will auto-update from the API

### Before Launch:

- [ ] Change JWT_SECRET to a secure random string
- [ ] Consider upgrading to PostgreSQL/MySQL
- [ ] Set up automatic backups
- [ ] Test with multiple admin users (optional)
- [ ] Configure production environment variables
