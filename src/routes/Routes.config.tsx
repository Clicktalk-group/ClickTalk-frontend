import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';
import NotFound from '../pages/NotFound/NotFound';
import { ProtectedRoute } from '../components/route/ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
import Chat from '../pages/Chat/Chat';

// Routes publiques (accessibles à tous)
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth" /> // Rediriger vers /auth au lieu de /auth/login
  },
  {
    path: '/auth',
    element: <Auth />, // Élément principal pour la route /auth
    children: [
      {
        path: 'login', // Cela devient /auth/login
        element: <Auth /> 
      },
      {
        path: 'register', // Cela devient /auth/register
        element: <Auth />
      },
      {
        index: true, // Cela est pour /auth directement
        element: <Auth />
      }
    ] 
  },
  {
    path: '*',
    element: <NotFound />
  }
];

// Routes privées (nécessite authentification)
export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Home />
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/chat/:conversationId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Chat />
        </MainLayout>
      </ProtectedRoute>
    )
  },
  // Ajouter aussi une route pour la création d'une nouvelle conversation
  {
    path: '/chat/new',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Chat />
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/auth', // Ajout de cette route pour éviter l'erreur si l'utilisateur tente d'accéder à /auth en étant connecté
    element: <Navigate to="/" />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
