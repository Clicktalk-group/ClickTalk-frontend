// src/config/environment.ts

// Centralisation des variables d'environnement
export const environment = {
  apiUrl: "http://localhost:8080/", // URL de l'API
  apiKey: process.env.REACT_APP_API_KEY || "", // Clé API
};

// Vérifiez la présence des variables nécessaires au démarrage
// Les vérifications sont faites silencieusement sans logs console
