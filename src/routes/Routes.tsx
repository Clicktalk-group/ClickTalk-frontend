import { createBrowserRouter } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./Routes.config"; // Importez vos configurations de routes

// Nouvelle fonction de création de routeur prenant en compte l'authentification
export function createAppRouter(isAuthenticated: boolean) {
  // Combinez les routes publiques et privées selon l'état utilisateur
  const routes = isAuthenticated
    ? [...publicRoutes, ...privateRoutes] // Si connecté
    : publicRoutes; // Si non connecté

  // Retourne une instance créée pour le Router
  return createBrowserRouter(routes);
}
