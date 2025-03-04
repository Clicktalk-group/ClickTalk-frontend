import React from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";

// Ce composant ne doit PAS créer un nouveau router, mais utiliser Outlet
const Routes = () => {
  return (
    <ErrorBoundary>
      {/* Utiliser Outlet au lieu de RouterProvider */}
      <Outlet />
    </ErrorBoundary>
  );
};

export default Routes;
