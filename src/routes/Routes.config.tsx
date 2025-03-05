import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';
import NotFound from '../pages/NotFound/NotFound';
import { ProtectedRoute } from '../components/route/ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout/MainLayout';

// Routes publiques (accessibles à tous)
export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <Auth />
      },
      {
        path: 'register',
        element: <Auth />
      },
      {
        index: true,
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
  }
  // Ajouter d'autres routes protégées ici
];
