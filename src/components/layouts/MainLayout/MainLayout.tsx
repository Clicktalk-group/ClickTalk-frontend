import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../../../routes/Routes.config";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";

const Routes = () => {
  const { isAuthenticated } = useAuth(); // Context pour l'authentification

  const routes = isAuthenticated
    ? [...publicRoutes, ...privateRoutes]
    : publicRoutes;

  const router = createBrowserRouter(routes);

  return (
    <ErrorBoundary>
      {/* Rendu des routes */}
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default Routes;
