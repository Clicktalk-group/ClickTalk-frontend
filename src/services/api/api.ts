import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Créer une instance Axios avec la config de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête si disponible
api.interceptors.request.use((config) => {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  
  // Si un token existe, l'ajouter aux headers
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs de réponse (ex: 401, 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si erreur 401 (non autorisé), déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Si besoin de rediriger, faire ici ou exposer une méthode
    }
    
    return Promise.reject(error);
  }
);

// Fonctions génériques pour les requêtes HTTP sans utiliser Promise<T> directement
export const apiService = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const res = await api.get(url, config);
    return res.data as T;
  },
  
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await api.post(url, data, config);
    return res.data as T;
  },
  
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await api.put(url, data, config);
    return res.data as T;
  },
  
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const res = await api.delete(url, config);
    return res.data as T;
  }
};

export default api;
