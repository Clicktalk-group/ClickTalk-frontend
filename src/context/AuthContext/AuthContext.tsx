import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/auth/auth';
import { LoginCredentials, RegisterCredentials, User, AuthContextType, AuthResponse } from '../../types/auth.types';

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  access_token: '',
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
  clearError: () => {},
});

// Propriétés du provider d'authentification
type AuthProviderProps = {
  children: ReactNode;
};

// Provider d'authentification qui encapsule la logique d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          // Utiliser le token stocké
          setAccessToken(storedToken);
          
          // Récupérer les informations utilisateur du localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
        setAccessToken('');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec:", { email, password });
      
      const response = await authService.login({ email, password });
      console.log("Réponse de connexion:", response);
      
      let tokenValue = '';
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        // Si la réponse est une chaîne, on considère que c'est le token
        tokenValue = response;
      } else if (response && typeof response === 'object') {
        // Si la réponse est un objet
        tokenValue = response.access_token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'authentification non valide");
      }
      
      if (!tokenValue) {
        throw new Error("Aucun token reçu du serveur");
      }
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', tokenValue);
      
      // Si nous n'avons pas reçu de données utilisateur, créons un utilisateur de base
      if (!userData && email) {
        userData = {
          id: 1, // ID par défaut
          email: email,
          username: 'defaultUsername', // Valeur par défaut
          createdAt: new Date().toISOString(), // Valeur par défaut
        };
      }
      
      if (userData) {
        // Stocker les informations utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Mettre à jour l'état
      setAccessToken(tokenValue);
      setUser(userData);
      
      console.log("Connexion réussie, mise à jour de l'état:", { 
        accessToken: tokenValue ? "Présent" : "Absent", 
        user: userData 
      });
      
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.response?.data?.message || "Échec de la connexion");
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
      
      let tokenValue = '';
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        // Si la réponse est une chaîne, on considère que c'est le token
        tokenValue = response;
      } else if (response && typeof response === 'object') {
        // Si la réponse est un objet
        tokenValue = response.access_token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'inscription non valide");
      }
      
      if (!tokenValue) {
        throw new Error("Aucun token reçu du serveur");
      }
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', tokenValue);
      
      // Si nous n'avons pas reçu de données utilisateur, créons un utilisateur de base
      if (!userData && credentials.email) {
        userData = {
          id: 1, // ID par défaut
          email: credentials.email,
          username: 'defaultUsername', // Valeur par défaut
          createdAt: new Date().toISOString(), // Valeur par défaut
        };
      }
      
      if (userData) {
        // Stocker les informations utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Mettre à jour l'état
      setAccessToken(tokenValue);
      setUser(userData);
      
      console.log("Inscription réussie, mise à jour de l'état:", { 
        accessToken: tokenValue ? "Présent" : "Absent", 
        user: userData 
      });
      
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.response?.data?.message || "Échec de l'inscription");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      console.log("Déconnexion de l'utilisateur");
      
      // Suppression des données d'authentification du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Réinitialisation de l'état
      setAccessToken('');
      setUser(null);
      setError(null);
      
      console.log("Déconnexion réussie");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setError("Échec de la déconnexion");
    }
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    try {
      // Implémentation du rafraîchissement des données utilisateur
      // À compléter avec l'appel API approprié
      console.log("Rafraîchissement des données utilisateur");
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des données utilisateur:", err);
    }
  };

  // Fonction pour effacer les messages d'erreur
  const clearError = () => {
    setError(null);
  };

  // Valeur du contexte à fournir aux composants
  const contextValue: AuthContextType = {
    user,
    access_token: accessToken,
    isAuthenticated: !!accessToken && !!user, // Changer la condition pour considérer aussi le token
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  console.log("État d'authentification actuel:", { 
    isAuth: context.isAuthenticated, 
    user: context.user 
  });
  return context;
};

export default AuthContext;
