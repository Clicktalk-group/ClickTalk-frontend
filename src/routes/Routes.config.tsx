import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/route/ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Auth from '../pages/Auth/Auth';
import Chat from '../pages/Chat';
import NotFound from '../pages/NotFound/NotFound';

// Routes publiques (accessibles à tous)
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth',
    element: <Auth />,
    children: [
      {
        path: 'login',
        element: <Auth />
      },
      {
        path: 'register',
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
    path: '/chat',
    element: <ProtectedRoute><Chat /></ProtectedRoute>
  },
  // Ajouter d'autres routes protégées ici
];
