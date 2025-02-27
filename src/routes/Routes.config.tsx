import { RouteObject } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth";

export const publicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Auth />,
      },
      {
        path: "register",
        element: <Auth />,
      },
    ],
  },
];

export const privateRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
];
