// src/routes/Routes.config.tsx
import { RouteObject } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Auth from '../pages/Auth';

export const publicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
  },
];
