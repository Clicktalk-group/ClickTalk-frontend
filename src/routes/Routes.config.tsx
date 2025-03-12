import React, { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/route/ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout/MainLayout';

// Loader spinner component
const LoadingSpinner = () => (
  <div className="route-loading-spinner">
    <div className="spinner"></div>
    <span>Chargement...</span>
  </div>
);

// Lazy loaded components
const Home = lazy(() => import('../pages/Home/Home'));
const Auth = lazy(() => import('../pages/Auth/Auth'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const Chat = lazy(() => import('../pages/Chat/Chat'));
const Project = lazy(() => import('../pages/Project/Project'));
const Settings = lazy(() => import('../pages/Settings/Settings'));

// Helper to wrap components with Suspense
const withSuspense = (Component: React.ComponentType<any>) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Routes publiques (accessibles à tous)
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth" />
  },
  {
    path: '/auth',
    element: withSuspense(Auth),
    children: [
      {
        path: 'login',
        element: withSuspense(Auth)
      },
      {
        path: 'register',
        element: withSuspense(Auth)
      },
      {
        index: true,
        element: withSuspense(Auth)
      }
    ] 
  },
  {
    path: '*',
    element: withSuspense(NotFound)
  }
];

// Routes privées (nécessite authentification)
export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          {withSuspense(Home)}
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/chat/:conversationId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          {withSuspense(Chat)}
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/chat/new',
    element: (
      <ProtectedRoute>
        <MainLayout>
          {withSuspense(Chat)}
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/project/:projectId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          {withSuspense(Project)}
        </MainLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <MainLayout>
          {withSuspense(Settings)}
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
    element: withSuspense(NotFound)
  }
];
