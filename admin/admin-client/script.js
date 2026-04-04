const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('admin_token');
let currentUser = JSON.parse(localStorage.getItem('admin_user')) || null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const productForm = document.getElementById('product-form');
const productsGrid = document.getElementById('products-grid');
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const imagePreview = document.getElementById('image-preview');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Initialize app
function init() {
  checkAuth();
  setupEventListeners();
}

// Check if user is authenticated
function checkAuth() {
  if (authToken && currentUser) {
    showScreen('dashboard');
    loadProducts();
  } else {
    showScreen('login');
  }
}

// Show specific screen
function showScreen(screen) {
  loginScreen.classList.remove('active');
  registerScreen.classList.remove('active');
  dashboardScreen.classList.remove('active');

  if (screen === 'login') loginScreen.classList.add('active');
  else if (screen === 'register') registerScreen.classList.add('active');
  else if (screen === 'dashboard') dashboardScreen.classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
  // Login/Register toggle
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('register');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('login');
  });

  // Forms
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  productForm.addEventListener('submit', handleProductSubmit);

  // Modal
  addProductBtn.addEventListener('click', () => openProductModal());
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeProductModal);
  });
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });

  // Image preview
  document.getElementById('product-image').addEventListener('change', handleImagePreview);

  // Logout
  logoutBtn.addEventListener('click', handleLogout);
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('admin_token', authToken);
      localStorage.setItem('admin_user', JSON.stringify(currentUser));
      document.getElementById('user-display').textContent = currentUser.username;
      loginForm.reset();
      loadProducts();
      showScreen('dashboard');
    } else {
      errorEl.textContent = data.error || 'Login failed';
    }
  } catch (error) {
    errorEl.textContent = 'Connection error. Please try again.';
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const errorEl = document.getElementById('register-error');

  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      errorEl.style.color = '#38a169';
      errorEl.textContent = 'Account created! Please login.';
      setTimeout(() => showScreen('login'), 1500);
      registerForm.reset();
    } else {
      errorEl.style.color = '#e53e3e';
      errorEl.textContent = data.error || 'Registration failed';
    }
  } catch (error) {
    errorEl.textContent = 'Connection error. Please try again.';
  }
}

// Handle logout
function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  showScreen('login');
}

// Load products
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    productsGrid.innerHTML = `
      <div class="no-products">
        <h3>Error Loading Products</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Render products grid
function renderProducts(products) {
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <h3>No Products Yet</h3>
        <p>Click "Add Product" to create your first product.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.image ?
        `<img src="${API_URL}${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect fill=%22%23f0f0f0%22 width=%22300%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22>No image</text></svg>'">` :
        `<div class="product-image" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f5f5f5 0%,#e0e0e0 100%);">No Image</div>`
      }
      <div class="product-info">
        <h3>${escapeHtml(product.name)}</h3>
        <div class="product-meta">
          <span class="product-category">${escapeHtml(product.category)}</span>
          <span class="product-rating">
            ⭐ ${product.rating} (${product.reviews})
          </span>
        </div>
        <div class="product-price">${escapeHtml(product.price)}</div>
        <p class="product-description">${escapeHtml(product.description || 'No description')}</p>
        <div class="product-actions">
          <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Open product modal
function openProductModal(product = null) {
  productForm.reset();
  imagePreview.style.display = 'none';
  imagePreview.innerHTML = '';

  if (product) {
    modalTitle.textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-rating').value = product.rating || 4.0;
    document.getElementById('product-reviews').value = product.reviews || 0;

    if (product.image) {
      imagePreview.innerHTML = `<img src="${API_URL}${product.image}" alt="Preview">`;
      imagePreview.style.display = 'block';
    }
  } else {
    modalTitle.textContent = 'Add Product';
    document.getElementById('product-id').value = '';
  }

  productModal.classList.add('active');
}

// Close product modal
function closeProductModal() {
  productModal.classList.remove('active');
}

// Handle image preview
function handleImagePreview(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Handle product form submit
async function handleProductSubmit(e) {
  e.preventDefault();

  const formData = new FormData(productForm);
  const productId = formData.get('id');

  try {
    const url = productId ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
    const method = productId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      closeProductModal();
      loadProducts();
      alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
    } else {
      alert(`Error: ${data.error || 'Failed to save product'}`);
    }
  } catch (error) {
    alert('Connection error. Please try again.');
  }
}

// Edit product
async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load product');
    }

    const product = await response.json();
    openProductModal(product);
  } catch (error) {
    alert('Error loading product: ' + error.message);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      loadProducts();
      alert('Product deleted successfully!');
    } else {
      alert(`Error: ${data.error || 'Failed to delete product'}`);
    }
  } catch (error) {
    alert('Connection error. Please try again.');
  }
}

// Initialize
init();
