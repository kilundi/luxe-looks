import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductForm } from '@/components/products/ProductForm';
import { useProductStore } from '@/store/useProductStore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

// Import page components
import { CategoriesPage } from '@/components/pages/CategoriesPage';
import { MediaPage } from '@/components/pages/MediaPage';
import { SettingsPage } from '@/components/pages/SettingsPage';

// Login Page Component
const LoginPage = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state, default to /admin
  const from = location.state?.from?.pathname || '/admin';

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-500/20">
            <span className="text-3xl font-serif font-bold text-white">LL</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Luxe Looks</h1>
          <p className="text-dark-400">Admin Panel</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Products Page Component
const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Product | null>(null);

  const { products, fetchProducts, deleteProduct, addProduct, updateProduct } = useProductStore();

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteProduct(deleteConfirm.id);
        toast.success('Product deleted successfully');
        setDeleteConfirm(null);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete product');
      }
    }
  };

  const handleFormSuccess = () => {
    fetchProducts();
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Products</h1>
          <p className="text-dark-400 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          <span>+</span> Add Product
        </button>
      </div>

      <ProductTable onEdit={handleEdit} onDelete={handleDelete} />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-2">Delete Product</h3>
            <p className="text-dark-400 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
export default App;
