import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext";
import { createAppRouter } from "./routes/Routes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./styles/global.scss";

// Composant qui enveloppe la logique du routeur
const App = () => {
  return (
    <AuthProvider>
      <AppWithRouter />
    </AuthProvider>
  );
};

// Composant qui utilise le routeur
const AppWithRouter = () => {
  // Charge l'état d'authentification via le contexte
  const { isAuthenticated } = useAuth();

  // Crée dynamiquement le router en fonction de l'état
  const router = createAppRouter(isAuthenticated);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

// Rendu de l'application
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
