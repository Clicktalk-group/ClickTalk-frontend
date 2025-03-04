import { RouteObject } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth/Auth";

export const publicRoutes: RouteObject[] = [
  {
    // Route principale avec le layout principal
    element: <MainLayout />,
    children: [
      {
        path: "/", // Page d'accueil publique
        element: <Home />,
      },
      {
        path: "auth", // Parent pour les pages d'authentification
        children: [
          {
            path: "login", // Page de connexion
            element: <Auth />,
          },
          {
            path: "register", // Page d'enregistrement
            element: <Auth />,
          },
        ],
      },
    ],
  },
];

export const privateRoutes: RouteObject[] = [
  {
    // Layout principal pour les routes privées
    element: <MainLayout />,
    children: [
      {
        path: "chat", // Chat protégé (accessible uniquement après connexion)
        element: <Chat />,
      },
    ],
  },
];
