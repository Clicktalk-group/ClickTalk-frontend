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

// Types pour la réponse API avec botResponse
interface ApiResponse {
  [key: string]: any; // Index signature pour permettre l'accès dynamique
  botResponse?: {
    content: string;
    [key: string]: any;
  };
  content?: string; // Ajout de content au niveau racine pour supporter différents formats
  message?: string; // Ajout pour les API qui retournent "message"
  response?: string; // Ajout pour les API qui retournent "response"
  text?: string; // Ajout pour les API qui retournent "text"
  data?: any; // Pour les API qui encapsulent dans "data"
  convId?: number;
  conversationId?: number;
  id?: number;
  userId?: number;
}

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
    // CORRECTION ICI - Gestion spécifique des erreurs 500
    else if (error.response?.status === 500) {
      console.error("⛔ Erreur serveur (500):", {
        url: error.config?.url,
        responseData: error.response?.data,
        message: error.response?.data?.message || error.message,
        stack: error.stack
      });
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
 * Fonction utilitaire pour trouver le contenu du message dans différentes structures de réponse API
 */
const extractMessageContent = (response: ApiResponse): string => {
  // Afficher toute la structure de la réponse pour le débogage
  console.log('API Response Structure:', JSON.stringify(response, null, 2));
  
  // Vérifier chaque possibilité de structure dans l'ordre
  
  // 1. Structure .botResponse.content
  if (response.botResponse && typeof response.botResponse.content === 'string') {
    return response.botResponse.content;
  }
  
  // 2. Structure .content directe
  if (response.content && typeof response.content === 'string') {
    return response.content;
  }
  
  // 3. Structure .message directe
  if (response.message && typeof response.message === 'string') {
    return response.message;
  }
  
  // 4. Structure .response directe
  if (response.response && typeof response.response === 'string') {
    return response.response;
  }
  
  // 5. Structure .text directe
  if (response.text && typeof response.text === 'string') {
    return response.text;
  }
  
  // 6. Si le message est encapsulé dans .data
  if (response.data) {
    // Vérifier .data.botResponse.content
    if (response.data.botResponse && typeof response.data.botResponse.content === 'string') {
      return response.data.botResponse.content;
    }
    
    // Vérifier .data.content
    if (response.data.content && typeof response.data.content === 'string') {
      return response.data.content;
    }
    
    // Vérifier .data.message
    if (response.data.message && typeof response.data.message === 'string') {
      return response.data.message;
    }
    
    // Vérifier .data.response
    if (response.data.response && typeof response.data.response === 'string') {
      return response.data.response;
    }
    
    // Vérifier si .data est directement une chaîne
    if (typeof response.data === 'string') {
      return response.data;
    }
  }
  
  // 7. Solution extrême: Si la réponse entière est une chaîne de caractères
  if (typeof response === 'string') {
    return response;
  }
  
  // Recherche récursive dans l'objet pour trouver une propriété qui pourrait contenir le message
  const findTextContent = (obj: any, depth = 0): string | null => {
    // Limiter la profondeur de recherche
    if (depth > 3) return null;
    
    for (const key in obj) {
      const value = obj[key];
      
      // Si c'est une chaîne de caractères assez longue, c'est probablement notre contenu
      if (typeof value === 'string' && value.length > 20) {
        return value;
      }
      
      // Si c'est un objet, chercher récursivement
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const result = findTextContent(value, depth + 1);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // Essayer la recherche récursive
  const recursiveResult = findTextContent(response);
  if (recursiveResult) {
    return recursiveResult;
  }
  
  // Si tout échoue, renvoyer une chaîne vide
  console.error('No message content found in API response');
  return '';
};

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
  
  // DELETE request - CORRECTION ICI
  delete: async <T>(url: string, config?: any): Promise<T> => {
    try {
      console.log(`🗑️ Sending DELETE request to: ${url}`);
      const response = await axiosInstance.delete(url, config);
      console.log(`✅ DELETE success for ${url}:`, response);
      return response as T;
    } catch (error: any) {
      console.error(`❌ DELETE error for ${url}:`, error.message);
      
      // Gestion spécifique des erreurs 500
      if (error.response?.status === 500) {
        console.error('Détails de l\'erreur 500:', {
          responseData: error.response?.data,
          message: error.response?.data?.message || error.message,
          stack: error.stack
        });
      }
      
      throw error;
    }
  },
  
  // AMÉLIORÉ: Streaming request avec meilleure extraction de contenu
  stream: async <T>(url: string, data?: any, onChunk?: (chunk: string) => void, config?: any): Promise<T> => {
    try {
      console.log(`🔄 Streaming request to ${url} initiated with:`, data);
      
      // Envoi de la requête normale d'abord
      const response = await axiosInstance.post(url, data, config) as unknown as ApiResponse;
      console.log("Stream response structure:", Object.keys(response));
      
      // Utiliser la fonction utilitaire pour extraire le contenu
      const messageContent = extractMessageContent(response);
      
      // Si du contenu a été trouvé, simuler le streaming
      if (messageContent && messageContent.length > 0) {
        const totalLength = messageContent.length;
        console.log(`✅ Simulating stream for message with ${totalLength} characters`);
        
        // Simuler le streaming en divisant le message en plusieurs parties
        const chunkSize = Math.max(5, Math.floor(totalLength / 20)); // Diviser en ~20 parties
        
        // Si une fonction de callback est fournie pour traiter les morceaux
        if (onChunk && typeof onChunk === 'function') {
          let currentPosition = 0;
          
          // Envoyer un premier morceau immédiatement
          const initialChunk = messageContent.substring(0, chunkSize);
          onChunk(initialChunk);
          currentPosition = chunkSize;
          
          // Puis continuer avec le reste
          while (currentPosition < totalLength) {
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50)); // Délai aléatoire
            
            const endPosition = Math.min(currentPosition + chunkSize, totalLength);
            const chunk = messageContent.substring(currentPosition, endPosition);
            
            console.log(`Sending chunk: "${chunk.substring(0, 15)}${chunk.length > 15 ? '...' : ''}"`);
            onChunk(chunk);
            
            currentPosition = endPosition;
          }
        }
      } else {
        console.warn("⚠️ Stream simulation not applicable - No valid message content found");
        
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
