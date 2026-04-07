# Phase 3 Breakdown: Categories & Media Management

## 📋 Overview

Phase 3 added two major features to the Luxe Looks admin panel:
1. **Categories Management** - Full CRUD + drag-to-reorder
2. **Media Library** - Upload, view, search, delete images

**Status:** ✅ Complete and working

---

## 🗄️ Database Schema

### 1. Categories Table (already exists)

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#D4AF37',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `name` - Display name (e.g., "Fragrances")
- `slug` - URL-friendly version (e.g., "fragrances")
- `description` - Optional description
- `icon` - Optional icon name (Lucide icon)
- `color` - Hex color for UI (#D4AF37 default = gold)
- `sort_order` - Integer for manual ordering (0, 1, 2...)
- `is_active` - Boolean to enable/disable category

---

## 🔧 Backend API Endpoints

### Categories Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/categories` | No | List all categories (ordered by `sort_order ASC, name ASC`) |
| GET | `/api/categories/:id` | No | Get single category |
| POST | `/api/categories` | Yes | Create new category |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category (checks if products use it first) |
| POST | `/api/categories/reorder` | Yes | Batch update `sort_order` for multiple categories |

**Implementation notes:**
- DELETE checks product count before deleting (prevents orphaned products)
- Reorder endpoint accepts: `{ categoryOrders: [{id, sort_order}, ...] }`

### Media Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/media` | Yes | List all images in `/uploads` folder with metadata |
| POST | `/api/media/upload` | Yes | Upload one or multiple images |
| DELETE | `/api/media/:filename` | Yes | Delete image file (checks if used by products first) |

**Implementation notes:**
- Scans filesystem `uploads/` directory
- Filters for image extensions: `.jpg, .jpeg, .png, .gif, .webp`
- Returns `size_formatted` (human-readable bytes)
- Counts products using each image via `product_count` query

---

## 🎨 Frontend Architecture

### TypeScript Types (`src/types/index.ts`)

```typescript
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  filename: string;
  path: string;
  size: number;
  size_formatted: string;
  uploaded_at: string;
  product_count: number;
}
```

### Service Layer (`src/services/api.ts`)

**Category Service:**
```typescript
export const categoryService = {
  getAll: async () => { GET '/categories' },
  getById: async (id: number) => { GET `/categories/${id}` },
  create: async (categoryData) => { POST '/categories' },
  update: async (id, updates) => { PUT `/categories/${id}` },
  delete: async (id) => { DELETE `/categories/${id}` },
  reorder: async (orders) => { POST '/categories/reorder' },
};
```

**Media Service:**
```typescript
export const mediaService = {
  getAll: async () => { GET '/media' },
  upload: async (files: File[]) => { POST '/media/upload' with FormData },
  delete: async (filename) => { DELETE `/media/${filename}` },
};
```

**Pattern:** All services use shared `axios` instance with auth interceptor (adds `Authorization: Bearer <token>` from localStorage).

### Store Layer (Zustand)

**Category Store (`useCategoryStore.ts`):**
```typescript
interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (data) => Promise<Category>;
  updateCategory: (id, updates) => Promise<Category>;
  deleteCategory: (id) => Promise<void>;
  reorderCategories: (orders) => Promise<void>;
}
```

**Features:**
- Auto-updates state after mutations
- Sorts by `sort_order` then name
- Provides optimistic updates (assumes success, rolls back on error)

**Media Store (`useMediaStore.ts`):**
```typescript
interface MediaState {
  media: MediaItem[];
  isLoading: boolean;
  selectedMedia: Set<string>;  // For bulk operations
  fetchMedia: () => Promise<void>;
  deleteMedia: (filename) => Promise<void>;
  selectMedia: (filename, selected) => void;
  clearSelection: () => void;
}
```

**Features:**
- Uses Set for efficient selection tracking
- Provides bulk selection state

### UI Components

#### CategoriesPage (`src/components/pages/CategoriesPage.tsx`)

**Structure:**
1. Header with "Add Category" button
2. Grid of category cards (if categories exist) OR empty state
3. Create/Edit modal (form)
4. Drag-and-drop reordering

**Category Card Features:**
- Displays: name, icon (colored circle), product count, slug
- Status badge (Active/Inactive)
- Hover actions: drag handle, edit, delete
- Draggable via `draggable` attribute

**Form Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Name | text (required) | Display name |
| Slug | text (required) | URL-friendly, auto-generated from name |
| Description | textarea | Optional |
| Color | color picker + hex input | Default '#D4AF37' |
| Sort Order | number | Default 0 |
| Active | checkbox | Default checked |

**Drag-and-Drop Logic:**
1. `onDragStart(index)` - sets `dragIndex`
2. `onDragOver(e, index)` - reorders array visually
3. `onDragEnd()` - sends new order to API, shows toast
4. If reorder fails, `fetchCategories()` to reset

#### MediaPage (`src/components/pages/MediaPage.tsx`)

**Structure:**
1. Header with "Upload Images" button + bulk delete (if selected)
2. Search bar + grid/list view toggle
3. Upload dropzone (with drag & drop)
4. Grid or table layout of images
5. Detail modal (click image)

**Features:**
- **Grid view:** Thumbnail cards with hover overlay (view/delete buttons)
- **List view:** Table with columns: Preview, Filename, Size, Used In, Uploaded, Actions
- **Search:** Filters by filename (case-insensitive)
- **Selection mode:** Click to select, bulk delete appears
- **Upload progress:** Simulated 0-100% progress bar
- **Detail modal:** Shows full image + metadata + copy path button

**Upload Flow:**
1. User drops files or clicks upload
2. Shows progress (increments 0→90% in 200ms steps)
3. Uploads via `mediaService.upload()` (multipart/form-data)
4. On success: show toast, refetch list
5. On error: show error toast

**Image Path Display:**
- Full URL: `http://localhost:3001${path}` (e.g., `/uploads/image-xxx.jpg`)
- Served by Express static middleware: `app.use('/uploads', express.static(...))`

---

## 🔄 Integration Points

### 1. ProductForm Component
Products need to reference categories. `ProductForm.tsx` likely fetches categories for dropdown:

```javascript
const { categories } = useCategoryStore();
// Populate <select> with categories.map(c => <option value={c.name}>)
```

### 2. ProductTable/ProductShowcase
Products display their category name (string from products table). Category details come from separate query if needed.

---

## 📦 Build Order (If Replicating from Scratch)

### Part A: Categories Feature

**Day 1 - Backend:**
1. ✅ Create `categories` table migration
2. ✅ Add `/api/categories` GET endpoint (ordered by sort_order)
3. ✅ Add `/api/categories` POST endpoint (validate slug uniqueness)
4. ✅ Add `/api/categories/:id` PUT endpoint
5. ✅ Add `/api/categories/:id` DELETE endpoint (with product count check)
6. ✅ Add `/api/categories/reorder` endpoint (batch UPDATE)

**Day 2 - Frontend Setup:**
1. ✅ Create Category type in `types/index.ts`
2. ✅ Create `categoryService` in `services/api.ts`
3. ✅ Create `useCategoryStore` with Zustand
4. ✅ Create `components/pages/CategoriesPage.tsx`
5. ✅ Add route in `App.tsx`: `/admin/categories`

**Day 3 - UI Polish:**
1. ✅ Build CategoryForm modal with validation
2. ✅ Implement drag-and-drop reordering
3. ✅ Add toasts for all actions
4. ✅ Empty state design
5. ✅ Error handling

### Part B: Media Feature

**Day 4 - Backend:**
1. ✅ Add `/api/media` GET endpoint (scan filesystem, count product usage)
2. ✅ Add `/api/media/upload` POST endpoint (multer, multiple files)
3. ✅ Add `/api/media/:filename` DELETE endpoint (with product usage check)
4. ⚠️ Ensure `/uploads` folder exists and is served statically

**Day 5 - Frontend:**
1. ✅ Create MediaItem type
2. ✅ Create `mediaService` in `services/api.ts`
3. ✅ Create `useMediaStore` with selection Set
4. ✅ Build `MediaPage.tsx` with grid/list views
5. ✅ Implement upload dropzone
6. ✅ Add detail modal

**Day 6 - Polish:**
1. ✅ Progress indicators
2. ✅ Search filtering
3. ✅ Bulk selection/delete
4. ✅ Copy path button
5. ✅ Responsive layout

---

## 🔨 Key Components Summary

| Component | Type | Purpose |
|-----------|------|---------|
| `categories` table | Database | Store category metadata |
| `/api/categories*` | Backend routes | CRUD + reorder |
| `/api/media*` | Backend routes | List/upload/delete images |
| `services/api.ts` | Frontend service | API calls with auth |
| `useCategoryStore` | Frontend state | Categories + mutations |
| `useMediaStore` | Frontend state | Media + selection |
| `CategoriesPage` | Frontend page | Full UI for categories |
| `MediaPage` | Frontend page | Full UI for media library |

---

## 🎯 Key Decisions & Patterns

### 1. Store Pattern (Zustand)
- **Why:** Lightweight, no boilerplate, persists across route changes
- **Pattern:** Each domain (products, categories, media) gets its own store
- **Revalidation:** Stores update optimistically; API calls in services; error handling in components

### 2. Service Layer
- **Why:** Centralize all API calls, reusable across components
- **Pattern:** Group related endpoints (categoryService, mediaService) in one file
- **Auth:** Axios interceptor auto-adds token from localStorage

### 3. Drag-and-Drop Reordering
- **Approach:** Local array reorder on `onDragOver`, send final order on `onDragEnd`
- **Fallback:** If API fails, refetch from server to reset
- **UX:** Visual opacity change during drag

### 4. Media Storage
- **Strategy:** Store on filesystem, metadata in DB (products reference path)
- **Serve:** Express static middleware (`/uploads`)
- **Cleanup:** Check `product_count` before deleting to prevent broken images

### 5. Form Modal
- **Approach:** Inline modal within page (not separate route)
- **State:** Local component state (formData) + editingID (null = create)
- **Reset:** On close, reset to INITIAL_FORM_DATA

---

## 🐛 Known Issues & Edge Cases

### Categories
- **Slug generation:** Auto-generated from name on keystroke, but user can override
- **Deletion guard:** Prevents deletion if products use category (returns error from backend)
- **Duplicate names:** DB enforces UNIQUE on `name` and `slug`

### Media
- **FILENAME collisions:** Overwrites? (multer default behavior)
- **Large files:** Multer limit? (not set in current code)
- **Permissions:** All endpoints require auth via JWT
- **Race conditions:** Two admins deleting same file - second gets 404 (OK)

### General
- **Auth bypass:** Some endpoints (`/api/categories` GET) are public - is this intended?
- **Pagination:** Media list loads all files (could be 1000s) - consider pagination
- **Image preview:** Grid shows fixed aspect ratio (square), may distort some images

---

## 📚 Code References

### Backend
- Categories endpoints: `server.js:991-1118`
- Media endpoints: `server.js:1154-1290`
- DB schema: `server.js:73-84`

### Frontend
- Categories page: `admin-client/src/components/pages/CategoriesPage.tsx`
- Media page: `admin-client/src/components/pages/MediaPage.tsx`
- Category store: `admin-client/src/store/useCategoryStore.ts`
- Media store: `admin-client/src/store/useMediaStore.ts`
- API services: `admin-client/src/services/api.ts`
- Types: `admin-client/src/types/index.ts`

---

## 🚀 What You'd Need to Build Similar Feature

### Prerequisites Knowledge:
1. Express.js routing & SQLite queries
2. File system operations (fs, path modules)
3. Multer for file uploads
4. React + TypeScript basics
5. State management (Zustand or similar)
6. Drag-and-drop in React
7. Form handling & validation

### Required Packages (backend):
- Already have: express, sqlite3, multer, bcryptjs, jsonwebtoken, cors

### Required Packages (frontend):
- Already have: react, framer-motion, zustand, axios, react-hot-toast, lucide-react

### Time Estimate:
- **Categories only:** 2-3 days
- **Media only:** 2-3 days
- **Both together with polish:** 5-7 days (as implemented)

---

## ✅ Success Criteria

- [x] Categories CRUD complete
- [x] Categories reorder via drag-and-drop
- [x] Categories used in ProductForm dropdown
- [x] Media upload (multiple files)
- [x] Media grid + list views
- [x] Media search by filename
- [x] Media bulk delete
- [x] Media detail view with copy path
- [x] Image deletion checks product usage
- [x] All actions authenticated
- [x] Responsive design
- [x] Toast notifications

---

## 🔄 How It All Fits Together

```
Admin Panel Routes:
  /admin/dashboard        - Stats overview
  /admin/products         - Product CRUD (Phase 2)
  /admin/categories       - Category CRUD + reorder (Phase 3)
  /admin/media            - Image library (Phase 3)
  /admin/settings         - App settings (Phase 4)
```

**Data Flow Example - Creating a Category:**

```
User clicks "Add Category"
  → Opens modal
  → Fills form, clicks "Create"
  → `createCategory(formData)` from store
  → `categoryService.create(data)`
  → POST `/api/categories`
  → DB INSERT
  → Store adds to `categories` array (sorted)
  → Toast success
  → Modal closes
```

**Data Flow Example - Uploading Image:**

```
User drags file to dropzone
  → `handleFileSelect(files)`
  → `mediaService.upload(files)`
  → POST `/api/media/upload` with multipart/form-data
  → Multer saves to `/uploads`
  → Store: `setMedia([...media, ...newFiles])`
  → Toast success
```

---

## 💡 Lessons Learned

1. **Drag-and-drop reordering** works best with local preview + API sync on drop
2. **Media scanning** filesystem is fine for <1000 files; use DB for large scale
3. **Selection state** with Set is efficient for bulk operations
4. **Optimistic updates** (immediate UI update before API response) improve UX
5. **Form modals** should reset state cleanly on close

---

## 🔮 Potential Enhancements

### Categories:
- [ ] Image upload for category icons (currently just color)
- [ ] Parent/child hierarchy (nested categories)
- [ ] Bulk activate/deactivate
- [ ] Import/export categories

### Media:
- [ ] Pagination or infinite scroll
- [ ] Bulk upload with progress per file
- [ ] Image cropping/resizing before upload
- [ ] Cloud storage (S3, Cloudinary) instead of local filesystem
- [ ] Thumbnail generation
- [ ] Image alt text management

### General:
- [ ] Real-time updates via WebSockets/SSE for multi-admin collaboration
- [ ] Undo/redo for all actions (not just archive)
- [ ] Audit log of changes

---

**End of Phase 3 Breakdown**
