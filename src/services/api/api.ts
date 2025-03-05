import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Création de l'instance axios avec configuration de base
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log("Requête API envoyée:", { url: config.url, method: config.method });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse (ex: token expiré)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Réponse API reçue:", { 
      url: response.config.url, 
      status: response.status 
    });
    return response;
  },
  (error) => {
    // Gérer le cas de token expiré (code 401)
    if (error.response?.status === 401) {
      console.error("Erreur d'authentification (401) - Session expirée");
      // Déconnecter l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de connexion
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    } else {
      console.error("Erreur API:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * Service pour effectuer des requêtes API
 */
export const apiService = {
  // GET request
  get: async <T>(url: string, params?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.get(url, { params, ...config });
    return response.data as T;
  },
  
  // POST request
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.post(url, data, config);
    return response.data as T;
  },
  
  // PUT request
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.put(url, data, config);
    return response.data as T;
  },
  
  // DELETE request
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosInstance.delete(url, config);
    return response.data as T;
  }
};

export default apiService;
