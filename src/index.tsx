import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext";
import ConversationsContextProvider from "./context/ConversationsContext/ConversationsContext";
import ProjectContextProvider from "./context/ProjectsContext/ProjectsContext"
import { ThemeProvider } from "./context/ThemeContext/ThemeContext";
import { createAppRouter } from "./routes/Routes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./styles/global.scss";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Loading fallback optimisé avec animation plus fluide
const LoadingFallback = () => (
  <div className="global-loader">
    <div className="loader-spinner" aria-label="Chargement en cours"></div>
    <p>Chargement de l'application...</p>
  </div>
);

// Composant qui enveloppe la logique du routeur
const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ConversationsContextProvider>
            <ProjectContextProvider>
            <Suspense fallback={<LoadingFallback />}>
              <AppWithRouter />
            </Suspense>
            </ProjectContextProvider>
          </ConversationsContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// Composant qui utilise le routeur - mémorisé pour éviter les re-rendus inutiles
const AppWithRouter = React.memo(() => {
  // Charge l'état d'authentification via le contexte
  const { isAuthenticated } = useAuth();

  // Crée dynamiquement le router en fonction de l'état - mémorisé pour éviter les recreations inutiles
  const router = React.useMemo(() => createAppRouter(isAuthenticated), [isAuthenticated]);

  return <RouterProvider router={router} />;
});

// Démarrer le rendu uniquement lorsque le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Fonction d'initialisation de l'app
function initApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Enregistrer le Service Worker
  serviceWorkerRegistration.register();
}
