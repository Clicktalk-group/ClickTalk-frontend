import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext"; // Fournisseur d'authentication
import { createAppRouter } from "./routes/Routes";
import "./styles/global.scss";

// Composant principal (dynamique grâce à Auth)
const AppWithRouter: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Charge l'état Auth
  const router = createAppRouter(isAuthenticated); // Création conditionnelle du routeur
  return <RouterProvider router={router} />;
};

// Enveloppement global dans AuthProvider
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithRouter />
    </AuthProvider>
  </React.StrictMode>
);
