import axios from "axios";
import { environment } from "../../config/environment"; // Import des variables d'environnement

// Instance d'Axios avec configuration globale
const apiClient = axios.create({
  baseURL: environment.apiUrl, // Utilisation de l'URL API définie dans le fichier .env
  headers: {
    Authorization: `Bearer ${environment.apiKey}`, // Authorization avec clé API
    "Content-Type": "application/json", // Format JSON global
  },
  timeout: 10000, // Timeout des requêtes (en ms)
});

// Exemple d'appel GET
export const fetchData = async (endpoint: string, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data; // Retourne les données
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

// Exemple d'appel POST
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data; // Retourne les données
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error);
    throw error;
  }
};

export default apiClient;
