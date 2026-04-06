# User Authentication Improvements Plan

## Overview
Enhance the authentication system with better security practices, session management, and user experience.

---

## 1. Move JWT Secret to Environment Variables

**Current State:** JWT secret is hardcoded in `server.js:13` as `'luxe-looks-secret-key-change-in-production'`

**Changes Needed:**
- Update `.env.example` to include `JWT_SECRET=your-secret-key-here`
- Modify `server.js` to use `process.env.JWT_SECRET`
- Add validation to ensure JWT_SECRET is set (exit with error if not in production)
- Update `init-admin.js` to handle environment variables properly

**Implementation:**
```javascript
// In server.js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL ERROR: JWT_SECRET is not set in production');
  process.exit(1);
}
```

---

## 2. Add Password Strength Validation

**Current State:** No password validation during registration/login

**Changes Needed:**
- Add password strength requirements (min 8 chars, uppercase, lowercase, number, special char)
- Show password strength indicator in registration form
- Return clear error messages when password doesn't meet requirements

**Implementation Steps:**
1. Create password validation utility function in `admin/server.js`:
   ```javascript
   function validatePasswordStrength(password) {
     const checks = {
       length: password.length >= 8,
       uppercase: /[A-Z]/.test(password),
       lowercase: /[a-z]/.test(password),
       number: /\d/.test(password),
       special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
     };
     return {
       valid: Object.values(checks).every(Boolean),
       checks
     };
   }
   ```

2. Update `/api/register` endpoint to validate password before creating user
3. Return detailed error response showing which requirements are missing
4. Optionally update login to check password history (future enhancement)

**Frontend Updates:**
- Add real-time password strength indicator in admin-client registration/login UI
- Show requirements with checkmarks as user types

---

## 3. Session Management System

**Current State:** No visibility into active sessions; tokens are valid for 24h but can't be managed

**Changes Needed:**

### 3a. Create Sessions Table
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Migration:** `admin/migrations/005_create_sessions_table.js`

### 3b. Track Sessions on Login
- When user logs in, generate a unique token ID (jti claim in JWT)
- Store session record in database with token_id, user_id, IP, user-agent, expiry
- Return token to client as before

### 3c. Create Sessions API Endpoints
- `GET /api/sessions` (authenticated) - List all active sessions for current user
- `DELETE /api/sessions/:id` - Revoke a specific session (logout from device)
- `DELETE /api/sessions` - Revoke all sessions except current (logout from all other devices)

### 3d. Add Session Validation Middleware
- Enhance `authenticateToken` middleware to:
  1. Verify JWT
  2. Check if token_id exists in sessions table and is not expired/revoked
  3. Optional: Update last_accessed timestamp

### 3e. Create Sessions Page in Admin
**File:** `admin/admin-client/src/components/pages/SessionsPage.tsx`

Features:
- Table showing all active sessions:
  - Current session highlighted
  - IP address, user agent, location (if possible), login time, expiry
- "Logout from device" button per session
- "Logout from all other devices" button

---

## 4. Implement "Logout from All Devices"

**Current State:** User can only logout from current browser

**Implementation:**
- Add "Logout All Sessions" button in admin profile/settings
- When clicked, delete all session records for user except current token
- Clear local storage and redirect to login
- Show confirmation modal before proceeding

**Also:**
- Add session count badge in sidebar/user menu
- Show warning if there are unusual active sessions (different locations/IPs)

---

## 5. Optional Security Enhancements (Stretch Goals)

### 5a. Rate Limiting on Auth Endpoints
- Use express-rate-limit or similar
- Limit login attempts: 5 attempts per 15 minutes per IP
- Limit registration attempts: 3 per hour per IP

### 5b. Password Reset Flow
- "Forgot Password" link on login page
- Email reset token (requires email service setup)
- Time-limited reset tokens stored in database
- Force password change on first login after reset

### 5c. Two-Factor Authentication (2FA)
- TOTP (Time-based One-Time Password) using speakeasy
- Show QR code for authenticator app setup
- Backup recovery codes
- Remember trusted devices for 30 days

### 5d. Session Expiry Configuration
- Add session duration to settings (default 24h)
- Refresh tokens for extended sessions
- Option to "Remember me" on login (longer expiry)

### 5e. Security Audit Log
- Table: `audit_logs` with user_id, action, IP, user_agent, timestamp
- Log important events: login, logout, password change, settings change, CRUD operations
- Viewable in admin panel

---

## Implementation Order

**Phase 1 (Essential):**
1. Move JWT secret to .env
2. Password strength validation
3. Session tracking in database
4. Sessions API (GET, DELETE single, DELETE all)
5. Sessions page UI

**Phase 2 (Important):**
6. Rate limiting on auth endpoints
7. Password reset flow (requires email setup)
8. Enhanced session validation middleware

**Phase 3 (Nice-to-have):**
9. 2FA support
10. Security audit log
11. Session expiry configurable via settings

---

## Files to Create/Modify

### Backend (server.js)
- Add `validatePasswordStrength()` function
- Modify `/api/register` validation
- Add sessions table creation on startup
- Create sessions middleware
- Add sessions API endpoints
- Add rate limiting middleware (optional)

### Database Migrations
- `005_create_sessions_table.js`
- Optional: `006_alter_users_add_fields.js` (for password reset tokens, 2FA secret)

### Frontend (admin-client)
- `src/components/pages/SessionsPage.tsx`
- Update `src/components/pages/LoginPage.tsx` with password strength (if UI exists)
- Update `src/components/pages/RegisterPage.tsx` with password strength
- Add logout all sessions button in UserMenu or Settings
- Update `src/services/api.ts` with sessionsService

### Configuration
- Update `.env.example` with `JWT_SECRET`
- Add `.env` to `.gitignore` (verify it's there)

---

## Testing Checklist

- [ ] Registration rejects weak passwords with clear messages
- [ ] Sessions are recorded in database on login
- [ ] Sessions page shows active sessions with details
- [ ] Revoking single session logs out that device
- [ ] "Logout all other sessions" works correctly
- [ ] Expired/invalid tokens are rejected
- [ ] JWT secret must be set in production (app won't start without it)
- [ ] Rate limiting blocks after specified attempts
- [ ] Password reset emails (if implemented)

---

## Security Considerations

1. **JWT Secret:** Use strong random secret (min 256 bits). Rotate periodically (requires re-login for all users)
2. **Token Expiry:** Keep JWT expiry reasonable (24h default). Use refresh tokens for longer sessions if needed.
3. **Session Storage:** Sessions table should have index on `token_id` and `expires_at` for cleanup
4. **Cleanup Job:** Add daily cron job to delete expired sessions
5. **IP/User-Agent:** Log for security audit but don't use for access control (IPs can change)
6. **Password Hashing:** Current implementation uses bcrypt - keep this (already in place)
7. **HTTPS:** Ensure admin panel only runs over HTTPS in production

---

## Migration Strategy

1. Deploy code changes without downtime
2. Run migrations to create sessions table
3. Existing users will not have active sessions - they'll need to log in again (acceptable)
4. New sessions will be tracked automatically
5. Monitor logs for any auth issues
