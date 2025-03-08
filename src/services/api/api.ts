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
  timeout: 60000, // 60s timeout
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      // S'assurer que le token est correctement formaté (sans guillemets)
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
      
      // Log pour déboguer
      console.log("🔑 Token utilisé:", cleanToken.slice(0, 15) + "...");
    } else if (!token && config.url && !config.url.includes('/auth/')) {
      // Avertissement si token manquant pour requête authentifiée
      console.warn("⚠️ Requête authentifiée sans token:", config.url);
    }
    
    console.log("📤 Requête API envoyée:", { 
      url: config.url, 
      method: config.method,
      data: config.data || 'No data' 
    });
    return config;
  },
  (error) => {
    console.error("❌ Erreur lors de l'envoi de la requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse (ex: token expiré)
axiosInstance.interceptors.response.use(
  (response: any) => {
    console.log("📩 Réponse API reçue:", { 
      url: response.config.url, 
      status: response.status,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    });
    
    // Vérification simplifiée des données renvoyées
    if (response.data === undefined || response.data === null) {
      console.warn("⚠️ La réponse API ne contient pas de données");
    }
    
    return response.data; // Simplification: renvoyer directement response.data
  },
  (error) => {
    // Gérer le cas de token expiré (code 401)
    if (error.response?.status === 401) {
      console.error("🔒 Erreur d'authentification (401) - Session expirée");
      // Déconnecter l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de connexion
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    } 
    // Gérer le cas d'accès refusé (code 403)
    else if (error.response?.status === 403) {
      console.error("🚫 Erreur d'autorisation (403) - Accès refusé");
      // On pourrait rediriger vers une page d'erreur spécifique
    }
    else {
      console.error("❌ Erreur API:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.config?.headers,
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
    try {
      const response = await axiosInstance.get(url, { params, ...config });
      return response as T;
    } catch (error: any) {
      console.error(`❌ GET error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // POST request
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response as T;
    } catch (error: any) {
      console.error(`❌ POST error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // PUT request
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response as T;
    } catch (error: any) {
      console.error(`❌ PUT error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // DELETE request
  delete: async <T>(url: string, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response as T;
    } catch (error: any) {
      console.error(`❌ DELETE error for ${url}:`, error.message);
      throw error;
    }
  }
};

export default apiService;
