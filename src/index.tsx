import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext/AuthContext";
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
          <Suspense fallback={<LoadingFallback />}>
            <AppWithRouter />
          </Suspense>
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

// Interface pour les métriques de Web Vitals
interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  isFinal?: boolean;
  entries?: any[];
}

// Version améliorée de reportWebVitals avec chargement différé et métriques personnalisées
const reportWebVitals = async () => {
  // Ne pas charger en dev sauf si explicitement défini
  if (process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_MEASURE_PERFORMANCE) return;
  
  try {
    // Import dynamique de web-vitals - seulement chargé en production
    const { onCLS, onFID, onLCP, onFCP, onTTFB } = await import('web-vitals');
    
    // Fonction d'envoi de métriques - pourrait être remplacée par un envoi à un service d'analytics
    const sendMetric = (metric: WebVitalMetric) => {
      // Log local pour debug
      console.log(metric);
      
      // Pour envoyer à un service d'analyse externe (Google Analytics, etc.)
      // window.gtag && window.gtag('event', name, metric);
      
      // Vous pourriez aussi utiliser une fonction personnalisée pour le stockage local
      // Exemple: utilisation d'un service custom d'analytics
      // Si votre mesurement ID est défini, envoyez les données
      if (process.env.REACT_APP_MEASUREMENT_ID) {
        // Simulation d'envoi d'analytics
        console.log(`[Analytics] Sending metric ${metric.name}: ${metric.value}`);
      }
    };
    
    // Capture de toutes les métriques web vitals essentielles
    onCLS(sendMetric);
    onFID(sendMetric);
    onLCP(sendMetric);
    onFCP(sendMetric);
    onTTFB(sendMetric);
    
    // Charger dynamiquement notre module personnalisé de métriques
    import('./utils/performance/metrics').then(({ trackCustomMetrics }) => {
      trackCustomMetrics();
    }).catch(err => {
      console.warn('Custom metrics module not loaded:', err);
    });
    
  } catch (error) {
    console.warn('Error loading web-vitals:', error);
  }
};

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
    console.error("Root element not found!");
    return;
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Rapporter les métriques après le rendu
  reportWebVitals();
  
  // Enregistrer le Service Worker
  serviceWorkerRegistration.register();
}
