import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';
import NotFound from '../pages/NotFound/NotFound';
import { ProtectedRoute } from '../components/route/ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
import Chat from '../pages/Chat/Chat';
import Project from '../pages/Project/Project';

// Routes publiques (accessibles à tous)
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth" />
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
    path: '/project/:projectId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Project />
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/auth',
    element: <Navigate to="/" />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
