# Luxe Looks Admin Panel

Admin dashboard for managing products on the Luxe Looks Beauty & Cosmetics website.

## Features

- 🔐 Secure authentication with JWT tokens
- 📦 Full CRUD operations (Create, Read, Update, Delete)
- 🖼️ Image upload with preview
- ⭐ Product ratings and review counts
- 📱 Responsive design
- 🎨 Matches Luxe Looks branding

## Quick Start

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Start the Server

```bash
npm start
# or for development with auto-restart
npm run dev
```

The admin server will start on `http://localhost:3001`

### 3. Create Admin Account

On first login, you need to create an admin account. Open your browser console (F12) on the admin page and run:

```javascript
fetch('http://localhost:3001/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'your-password-here'
  })
})
```

Or use the "Create admin account" link on the login page.

### 4. Access Admin Panel

- Admin Panel: http://localhost:3001/admin
- API Endpoint: http://localhost:3001/api/products

## API Endpoints (for reference)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Create admin user | No |
| POST | `/api/login` | Admin login | No |
| GET | `/api/products` | Get all products | Yes |
| GET | `/api/products/:id` | Get single product | Yes |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

## File Structure

```
admin/
├── server.js              # Backend Express server
├── package.json           # Dependencies
├── uploads/              # Uploaded product images (created automatically)
├── luxe_looks.db         # SQLite database (created automatically)
└── admin-client/        # Frontend admin panel
    ├── index.html
    ├── styles.css
    └── script.js
```

## Security Notes

⚠️ **IMPORTANT**: Change the JWT_SECRET in `server.js` for production!

```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-here';
```

Use environment variables:
```bash
JWT_SECRET=your-random-secret-key node server.js
```

## Connecting to Frontend

The frontend React app automatically fetches products from `http://localhost:3001/api/products`.

To ensure CORS works, keep the admin server running separately from the Vite dev server:

- **Frontend:** http://localhost:5173
- **Admin API:** http://localhost:3001
- **Admin Panel:** http://localhost:3001/admin

## Database Schema

### users
- id (INTEGER, PRIMARY KEY)
- username (TEXT, UNIQUE)
- password (TEXT, hashed)
- created_at (DATETIME)

### products
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- category (TEXT)
- price (TEXT)
- description (TEXT)
- image (TEXT, file path)
- rating (REAL)
- reviews (INTEGER)
- created_at (DATETIME)
- updated_at (DATETIME)

## Troubleshooting

**Images not uploading?**
- Check that `./uploads` directory exists and is writable
- Max file size: 5MB
- Supported formats: jpeg, jpg, png, gif, webp

**CORS errors?**
- Ensure the admin server is running on port 3001
- Check browser console for network errors

**Database locked?**
- Close any other processes using `luxe_looks.db`
- Delete the file and restart the server (data will be lost)

## Production Deployment

For production, consider:
- Using PostgreSQL/MySQL instead of SQLite
- Setting up HTTPS
- Using environment variables for secrets
- Adding request logging
- Implementing rate limiting
- Regular database backups
