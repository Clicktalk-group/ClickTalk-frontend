import { createBrowserRouter } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./Routes.config";

// Fonction de création de routeur prenant en compte l'authentification
export const createAppRouter = (isAuthenticated: boolean) => {
  // Combinez les routes publiques et privées selon l'état utilisateur
  const routes = isAuthenticated
    ? [...privateRoutes] //
    : [...publicRoutes]; //
    

  // Configurer les drapeaux de fonctionnalités futures pour supprimer les avertissements
  return createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });
};
