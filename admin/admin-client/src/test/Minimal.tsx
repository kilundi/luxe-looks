import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const SimpleApp = () => {
  const { isAuthenticated, login } = useAuthStore();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl text-white p-8">Welcome to Admin Panel!</h1>
      <pre className="text-white p-8">{JSON.stringify(useAuthStore.getState(), null, 2)}</pre>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SimpleApp />} />
    </Routes>
  </BrowserRouter>
);
