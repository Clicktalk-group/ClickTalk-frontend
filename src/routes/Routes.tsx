import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./Routes.config";
import { useAuth } from "../context/AuthContext"; // Utilisation du contexte Auth

// Composant qui détermine l'utilisation des routes
const Routes = () => {
  const { isAuthenticated } = useAuth();

  // Sélectionne les routes selon l'état d'authentification
  const routes = isAuthenticated ? [...publicRoutes, ...privateRoutes] : publicRoutes;

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;