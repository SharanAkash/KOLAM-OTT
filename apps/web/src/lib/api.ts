// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
  movies: {
    search: (query: string, limit: number = 5) =>
      `${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    getAll: () => `${API_BASE_URL}/movies`,
    getById: (id: string) => `${API_BASE_URL}/movies/${id}`,
  },
  auth: {
    login: () => `${API_BASE_URL}/auth/login`,
    register: () => `${API_BASE_URL}/auth/register`,
  },
};
