import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext"; // Assurez-vous que `AuthProvider` englobe bien toute l'application
import { createAppRouter } from "./routes/Routes";
import "./styles/global.scss";

// Composant principal contenant la logique du fournisseur et du routeur
const App: React.FC = () => {
  // Charge l'état d'authentification via le contexte
  const { isAuthenticated } = useAuth();

  // Crée dynamiquement le router en fonction de l'état
  const router = createAppRouter(isAuthenticated);

  return <RouterProvider router={router} />;
};

// Enveloppement de l'application avec AuthProvider
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
