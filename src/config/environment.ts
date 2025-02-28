// src/config/environment.ts

// Centralisation des variables d'environnement
export const environment = {
  apiUrl: process.env.REACT_APP_API_URL || "", // URL de l'API
  apiKey: process.env.REACT_APP_API_KEY || "", // Clé API
};

// Vérifiez la présence des variables nécessaires au démarrage
if (!environment.apiUrl || environment.apiUrl === "") {
  console.error("❌ ERREUR : `REACT_APP_API_URL` n'est pas défini dans le fichier .env !");
} else {
  console.log(`✅ URL de l'API : ${environment.apiUrl}`); // Simple log pour confirmer la valeur
}

if (!environment.apiKey || environment.apiKey === "") {
  console.error("❌ ERREUR : `REACT_APP_API_KEY` n'est pas défini dans le fichier .env !");
} else {
  console.log(`✅ Clé API : [Masquée]`); // Il est déconseillé d'afficher entièrement la clé dans la console
}
