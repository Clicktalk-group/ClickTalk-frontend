import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

/**
 * Composant pour protéger les routes nécessitant une authentification
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/auth/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Si authentification en cours de vérification, afficher un loader
  if (isLoading) {
    return <div className="loading-spinner">Chargement...</div>;
  }
  
  // Si non authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Sinon, afficher le contenu protégé
  return <>{children}</>;
};

export default ProtectedRoute;
