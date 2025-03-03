// src/config/environment.ts

// Fonction centrale pour sécuriser l'accès aux variables d'environnement
function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.error(`❌ ERREUR : La variable ${key} n'est pas définie !`);
    return "";
  }
  if (key !== "REACT_APP_API_KEY") {
    console.log(`✅ La variable ${key} est correctement définie.`);
  }
  return value;
}

// Export des variables d'environnement
export const environment = {
  apiUrl: getEnvVariable("REACT_APP_API_URL"),
  apiKey: getEnvVariable("REACT_APP_API_KEY"),
};
