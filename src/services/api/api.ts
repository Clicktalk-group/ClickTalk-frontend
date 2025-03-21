import axios from 'axios';
// Utilisation de type 'any' pour éviter les problèmes de compatibilité
type AxiosRequestConfig = any;

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Création de l'instance axios avec configuration de base
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // timeout: 60000, // 60s timeout
});

// Types pour la réponse API avec botResponse
interface ApiResponse {
  [key: string]: any; // Index signature pour permettre l'accès dynamique
  botResponse?: {
    content: string;
    message?: {
      content: string;
    };
    [key: string]: any;
  };
  content?: string;
  message?: string;
  response?: string;
  text?: string;
  data?: any;
  convId?: number;
  conversationId?: number;
  id?: number;
  userId?: number;
}

// Cache pour les requêtes GET - optimisation via mise en cache
const requestCache = new Map<string, {data: any, timestamp: number}>();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour vérifier si une requête est mise en cache
const getCachedResponse = (url: string, params?: any) => {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;
  const cachedItem = requestCache.get(cacheKey);
  
  if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_EXPIRATION) {
    return cachedItem.data;
  }
  
  return null;
};

// Fonction pour mettre en cache une réponse
const cacheResponse = (url: string, params: any, data: any) => {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      // S'assurer que le token est correctement formaté (sans guillemets)
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
      
      // Log pour déboguer (uniquement en développement)
      if (process.env.NODE_ENV === 'development') {
        console.log("🔑 Token utilisé:", cleanToken.slice(0, 15) + "...");
      }
    } else if (!token && config.url && !config.url.includes('/auth/') && process.env.NODE_ENV === 'development') {
      // Avertissement si token manquant pour requête authentifiée (uniquement en développement)
      console.warn("⚠️ Requête authentifiée sans token:", config.url);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("📤 Requête API envoyée:", { 
        url: config.url, 
        method: config.method
      });
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.log("📩 Réponse API reçue:", { 
        url: response.config.url, 
        status: response.status
      });
    }
    
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
    }
    // Gestion spécifique des erreurs 500
    else if (error.response?.status === 500) {
      console.error("⛔ Erreur serveur (500):", {
        url: error.config?.url,
        message: error.response?.data?.message || error.message
      });
    }
    else {
      console.error("❌ Erreur API:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * Fonction utilitaire optimisée pour trouver le contenu du message dans différentes structures
 */
const extractMessageContent = (response: ApiResponse): string => {
  // Éviter le log en production
  if (process.env.NODE_ENV === 'development') {
    console.log('API Response Structure:', Object.keys(response));
  }
  
  // Fonction optimisée pour trouver le contenu plus efficacement
  if (response) {
    // Vérifications les plus courantes en premier pour une performance optimale
    if (typeof response === 'string') {
      return response;
    }
    
    if (response.content && typeof response.content === 'string') {
      return response.content;
    }
    
    if (response.message && typeof response.message === 'string') {
      return response.message;
    }
    
    if (response.botResponse?.message?.content && typeof response.botResponse.message.content === 'string') {
      return response.botResponse.message.content;
    }
    
    if (response.botResponse?.content && typeof response.botResponse.content === 'string') {
      return response.botResponse.content;
    }
    
    if (response.response && typeof response.response === 'string') {
      return response.response;
    }
    
    if (response.text && typeof response.text === 'string') {
      return response.text;
    }
    
    if (response.data) {
      if (typeof response.data === 'string') {
        return response.data;
      }
      
      if (response.data.content && typeof response.data.content === 'string') {
        return response.data.content;
      }
      
      if (response.data.message && typeof response.data.message === 'string') {
        return response.data.message;
      }
      
      if (response.data.response && typeof response.data.response === 'string') {
        return response.data.response;
      }
    }
  }
  
  // Recherche récursive dans l'objet pour les cas complexes
  const findTextContent = (obj: any, depth = 0): string | null => {
    if (!obj || depth > 3) return null;
    
    for (const key in obj) {
      const value = obj[key];
      
      if (typeof value === 'string' && value.length > 20) {
        return value;
      }
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const result = findTextContent(value, depth + 1);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  const recursiveResult = findTextContent(response);
  if (recursiveResult) {
    return recursiveResult;
  }
  
  return '';
};

/**
 * Service optimisé pour effectuer des requêtes API
 */
export const apiService = {
  // GET request avec mise en cache
  get: async <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
     // Vérifier si la réponse est en cache
      // const cachedResponse = getCachedResponse(url, params);
      // if (cachedResponse) {
      //   return cachedResponse as T;
      // }
      
      const response = await axiosInstance.get(url, { params, ...config });
      
      // Mettre en cache la réponse
      // cacheResponse(url, params, response);
      
      return response as T;
    } catch (error: any) {
      console.error(`❌ GET error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response as T;
    } catch (error: any) {
      console.error(`❌ POST error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response as T;
    } catch (error: any) {
      console.error(`❌ PUT error for ${url}:`, error.message);
      throw error;
    }
  },
  
  // DELETE request - amélioré
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🗑️ Sending DELETE request to: ${url}`);
      }
      
      const response = await axiosInstance.delete(url, config);
      
      // Invalider tout cache lié à cette URL
      const cacheKeysToDelete: string[] = [];
      requestCache.forEach((_, key) => {
        if (key.startsWith(url)) {
          cacheKeysToDelete.push(key);
        }
      });
      
      cacheKeysToDelete.forEach(key => requestCache.delete(key));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ DELETE success for ${url}`);
      }
      
      return response as T;
    } catch (error: any) {
      console.error(`❌ DELETE error for ${url}:`, error.message);
      
      // Gestion spécifique des erreurs 500
      if (error.response?.status === 500) {
        console.error('Détails de l\'erreur 500:', {
          responseData: error.response?.data,
          message: error.response?.data?.message || error.message
        });
      }
      
      throw error;
    }
  },
  
  // AMÉLIORÉ: Streaming request avec meilleure extraction de contenu
  stream: async <T>(url: string, data?: any, onChunk?: (chunk: string) => void, config?: AxiosRequestConfig): Promise<T> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Streaming request to ${url} initiated`);
      }
      
      // Envoi de la requête normale d'abord
      const response = await axiosInstance.post(url, data, config) as unknown as ApiResponse;
      
      // Utiliser la fonction utilitaire pour extraire le contenu
      const messageContent = extractMessageContent(response);
      
      // Si du contenu a été trouvé, simuler le streaming
      if (messageContent && messageContent.length > 0) {
        const totalLength = messageContent.length;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Simulating stream for message with ${totalLength} characters`);
        }
        
        // Simuler le streaming en divisant le message en plusieurs parties
        // Calcul dynamique de la taille des morceaux basé sur la longueur du message
        const chunkSize = Math.max(5, Math.floor(totalLength / 20)); // Diviser en ~20 parties
        
        // Si une fonction de callback est fournie pour traiter les morceaux
        if (onChunk && typeof onChunk === 'function') {
          let currentPosition = 0;
          
          // Envoyer un premier morceau immédiatement
          const initialChunk = messageContent.substring(0, chunkSize);
          onChunk(initialChunk);
          currentPosition = chunkSize;
          
          // Puis continuer avec le reste avec une vitesse variable plus naturelle
          const sendNextChunk = async () => {
            if (currentPosition >= totalLength) return;
            
            // Délai adaptatif: plus lent pour les messages courts, plus rapide pour les longs
            const baseDelay = totalLength > 1000 ? 20 : 50;
            await new Promise(resolve => setTimeout(resolve, baseDelay + Math.random() * 20));
            
            // Taille de morceau variable pour une apparence plus naturelle
            const variableChunkSize = Math.max(3, Math.min(chunkSize, 
              chunkSize + Math.floor(Math.random() * 5) - 2));
              
            const endPosition = Math.min(currentPosition + variableChunkSize, totalLength);
            const chunk = messageContent.substring(currentPosition, endPosition);
            
            onChunk(chunk);
            currentPosition = endPosition;
            
            // Continuer si nécessaire
            if (currentPosition < totalLength) {
              await sendNextChunk();
            }
          };
          
          await sendNextChunk();
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("⚠️ Stream simulation not applicable - No valid message content found");
        }
        
        // Même sans contenu identifié, essayer d'envoyer quelque chose
        if (onChunk && typeof onChunk === 'function') {
          onChunk("Désolé, une erreur est survenue lors de la génération de la réponse.");
        }
      }
      
      // Retourner la réponse complète à la fin
      return response as unknown as T;
      
    } catch (error: any) {
      console.error(`❌ STREAM error for ${url}:`, error.message);
      
      // Même en cas d'erreur, envoyer un message à l'utilisateur
      if (onChunk && typeof onChunk === 'function') {
        onChunk("Désolé, une erreur est survenue lors de la communication avec le serveur.");
      }
      
      throw error;
    }
  }
};

export default apiService;
