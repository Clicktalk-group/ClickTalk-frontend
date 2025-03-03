import axios from "axios";

// Instance d'Axios avec configuration globale
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL issue de .env
  headers: {
    "Content-Type": "application/json", // Format JSON global
  },
  timeout: 10000, // Timeout des requêtes (en ms)
});

// Ajouter un intercepteur pour inclure automatiquement le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    // Sécurité : Vérifier que config.headers n'est pas undefined
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` };
    }
  }
  return config;
});

export default apiClient;
