# Luxe Looks - Quick Start Guide

## 🎉 Everything is ready! Here's how to use your new website with admin panel.

## 📁 Project Structure

```
luxe-looks/
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCategories.jsx
│   │   ├── ProductShowcase.jsx  ← Dynamic products from admin
│   │   ├── About.jsx
│   │   ├── Reviews.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── FloatingWhatsApp.jsx
│   │   ├── BackToTop.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── PageLoader.jsx
│   │   └── SkipToContent.jsx
│   ├── assets/
│   │   └── logo.png       ← Your company logo
│   ├── App.jsx
│   └── index.css
├── admin/                  # Backend admin panel
│   ├── server.js          # Express API server
│   ├── admin-client/      # Admin dashboard UI
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── setup-db.js        # Database initialization
│   ├── init-admin.js      # Create admin user
│   ├── uploads/           ← Product images stored here
│   └── README.md
├── ADMIN_SETUP.md         ← Detailed admin panel guide
├── QUICKSTART.md          ← This file
└── package.json
```

## 🚀 Running the Website

### Frontend (React App)

```bash
# Development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
npm preview
```

### Backend (Admin API)

```bash
# Navigate to admin folder
cd admin

# Install dependencies (one time)
npm install

# Start admin server
npm start
# → http://localhost:3001
# → Admin panel: http://localhost:3001/admin
# → API: http://localhost:3001/api/products
```

**Important:** Keep the admin server running to see product updates on the frontend!

## 🔐 Admin Panel Access

### First Time Setup

1. **Initialize database** (creates admin user):
   ```bash
   cd admin
   node setup-db.js
   ```

2. **Start the admin server**:
   ```bash
   npm start
   ```

3. **Login to admin panel**:
   - URL: http://localhost:3001/admin
   - Username: `admin`
   - Password: `Admin@2024`
   - ⚠️ **Change password after first login!**

### Managing Products

1. Login to admin panel (http://localhost:3001/admin)
2. Click "+ Add Product"
3. Fill in:
   - Product Name
   - Category (Fragrances, Beauty, Hair, Bags, Watches, Jewelry)
   - Price (e.g., "KSh 4,500")
   - Description
   - Rating (0-5)
   - Reviews count
   - Product image (optional)
4. Click "Save Product"
5. Refresh frontend to see your product!

## 🔗 How It Works

1. **Admin Panel** manages products in SQLite database
2. **Admin API** serves products via REST endpoints
3. **Frontend** automatically fetches products from API
4. When you add/edit/delete in admin panel → frontend updates on refresh

### Product Data Flow

```
Admin Panel (http://localhost:3001/admin)
         ↓
  SQLite Database (admin/luxe_looks.db)
         ↓
  REST API (http://localhost:3001/api/products)
         ↓
  Frontend React App (ProductShowcase.jsx)
```

## 📱 Website Features

### Professional Enhancements Included:
- ✅ Floating WhatsApp chat button (bottom-right)
- ✅ Scroll progress indicator (top of page)
- ✅ Page loading animation with logo
- ✅ Featured products showcase with ratings
- ✅ "Why Choose Us" trust signals
- ✅ FAQ accordion section
- ✅ Newsletter signup form (10% discount offer)
- ✅ Business hours display
- ✅ Clickable phone & email
- ✅ Back-to-top button
- ✅ Google Maps embed with exact location
- ✅ Social media links (Instagram, TikTok, WhatsApp)
- ✅ Payment methods display in footer
- ✅ Skip to content (accessibility)
- ✅ Responsive design (mobile-first)

### Contact Info (already configured):
- **Phone:** 0701974458
- **Email:** luxe.looksbeautyandcosmeticske@gmail.com
- **WhatsApp:** https://chat.whatsapp.com/Gb8xGhuAacOJzY7cuMO5tK
- **Instagram:** https://www.instagram.com/luxe_looks15
- **TikTok:** https://www.tiktok.com/@luxe.looks.beautyke26

## 🛠️ Customization

### Change Colors

In `src/index.css`:
```css
colors: {
  primary: '#D4AF37',      /* Gold */
  secondary: '#1A1A1A',   /* Charcoal */
  accent: '#FDFDFD',      /* Off-white */
}
```

### Update Business Hours

In `src/components/Contact.jsx` → Business Hours section (around line 127)

### Change WhatsApp Number

- Admin panel floating button: `src/components/FloatingWhatsApp.jsx` (line 12)
- All other WhatsApp links: Search for `chat.whatsapp.com`

## 🔒 Security Checklist

- [ ] Change JWT secret in `admin/server.js`
- [ ] Change default admin password
- [ ] Consider using PostgreSQL/MySQL for production
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Add rate limiting
- [ ] Configure firewall

## 📦 Deployment

### Option 1: Vercel/Netlify (Frontend Only)

1. Build frontend: `npm run build`
2. Deploy `dist/` folder
3. Set environment variable: `VITE_API_URL=https://your-api.com`
4. Deploy admin API separately (see option 2)

### Option 2: Full Stack on Railway/Render

1. Push code to GitHub
2. Create two services on Railway/Render:
   - **Frontend:** Static site from `/dist`
   - **Backend:** Node.js from `/admin`
3. Connect services via environment variables
4. Admin panel accessible at `/admin` route on backend

### Option 3: All-in-One on VPS

```bash
# On your server
git clone <repo>
cd luxe-looks

# Install and start admin server as systemd service
cd admin
npm install --production
npm start

# Build and serve frontend with nginx
npm run build
# Copy dist/ to nginx html directory
```

## 🆘 Troubleshooting

### Products not showing up?
- Check admin server is running on port 3001
- Open browser console (F12) → Network tab
- Look for failed requests to `/api/products`
- Ensure CORS is not blocking (admin server has CORS enabled)

### Admin panel styles broken?
- Make sure admin server is running
- Check `admin/admin-client/` files exist
- Clear browser cache

### Cannot upload images?
- Check `admin/uploads/` directory exists
- Verify permissions: folder should be writable
- Max file size: 5MB

### Database errors?
- Delete `admin/luxe_looks.db` and run `node setup-db.js` again
- Ensure `admin/uploads/` directory exists

## 📚 Documentation

- **Admin Panel:** See `ADMIN_SETUP.md`
- **Admin README:** See `admin/README.md`
- **API Reference:** See `admin/README.md`

## 🎯 Next Steps

1. ✅ Start admin server and login to panel
2. ✅ Add your first 6 products (one for each category)
3. ✅ Upload product images
4. ✅ Test on frontend at http://localhost:5173
5. ✅ Customize content as needed
6. ✅ Deploy to production when ready

Need help? Check `ADMIN_SETUP.md` for detailed admin panel documentation.
