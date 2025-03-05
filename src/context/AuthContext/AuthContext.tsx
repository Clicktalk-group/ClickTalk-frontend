import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../../services/auth/auth';
import { 
  AuthContextType, 
  LoginCredentials, 
  RegisterCredentials, 
  User 
} from '../../types/auth.types';

// Création du contexte avec valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pour le AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider qui encapsule la logique d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si un utilisateur est déjà connecté (localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur lors de la récupération des données utilisateur:", e);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec:", credentials);
      
      const response = await authService.login(credentials);
      console.log("Réponse de connexion:", response);
      
      // Gérer différents formats de réponse
      let tokenValue: string;
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        // Si la réponse est juste le token
        tokenValue = response;
        // Créer un user basique basé sur l'email
        userData = {
          id: 1, // ID temporaire
          username: credentials.email.split('@')[0], // Username basé sur email
          email: credentials.email,
          createdAt: new Date().toISOString()
        };
      } else if (response && typeof response === 'object') {
        // Si la réponse est un objet
        tokenValue = response.token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'authentification non valide");
      }
      
      // Stocker les données
      localStorage.setItem('token', tokenValue);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Mettre à jour l'état
      setToken(tokenValue);
      setUser(userData);
      
      console.log("Connexion réussie, mise à jour de l'état:", { token: tokenValue, user: userData });
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.response?.data?.message || 'Échec de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  
  // Fonction d'inscription
  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Tentative d'inscription avec:", credentials);
      
      const response = await authService.register(credentials);
      console.log("Réponse d'inscription:", response);
      
      // Gérer différents formats de réponse
      let tokenValue: string;
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        // Si la réponse est juste le token
        tokenValue = response;
        // Créer un user basé sur les données d'inscription
        userData = {
          id: 1, // ID temporaire
          username: credentials.username,
          email: credentials.email,
          createdAt: new Date().toISOString()
        };
      } else if (response && typeof response === 'object') {
        // Si la réponse est un objet
        tokenValue = response.token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'inscription non valide");
      }
      
      // Stocker les données
      localStorage.setItem('token', tokenValue);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Mettre à jour l'état
      setToken(tokenValue);
      setUser(userData);
      
      console.log("Inscription réussie, mise à jour de l'état:", { token: tokenValue, user: userData });
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.response?.data?.message || 'Échec de l\'inscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Appeler le service de déconnexion (optionnel, selon votre backend)
      if (token) {
        try {
          await authService.logout();
        } catch (e) {
          console.warn("Erreur lors de la déconnexion côté serveur:", e);
          // Continue quand même avec la déconnexion locale
        }
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Supprimer les informations d'authentification du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Réinitialiser l'état
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Effacer les erreurs
  const clearError = () => setError(null);

  // Construire la valeur du contexte
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user, // Changer la condition pour considérer aussi le token
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  console.log("État d'authentification actuel:", { 
    isAuth: context.isAuthenticated, 
    token: context.token ? "Présent" : "Absent",
    user: context.user 
  });
  return context;
};

export default AuthContext;
