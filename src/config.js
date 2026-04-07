const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ASSETS_BASE = import.meta.env.VITE_ASSETS_URL || 'http://localhost:3001';

export const apiUrl = (path = '') => `${API_BASE}${path}`;
export const assetsUrl = (path = '') => `${ASSETS_BASE}${path}`;

export default { apiUrl, assetsUrl };
