import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/auth/auth';
import { LoginCredentials, RegisterCredentials, User } from '../../types/auth.types';

// Définition du type pour la réponse d'authentification
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: User; // Optionnel car l'API ne renvoie peut-être pas directement l'utilisateur
}

// Type pour le contexte d'authentification
export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

// Propriétés du provider d'authentification
type AuthProviderProps = {
  children: ReactNode;
};

// Provider d'authentification qui encapsule la logique d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
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
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Tentative de connexion avec:", credentials);
      
      const response = await authService.login(credentials);
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
      setAccessToken(null);
      setUser(null);
      setError(null);
      
      console.log("Déconnexion réussie");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setError("Échec de la déconnexion");
    }
  };

  // Fonction pour effacer les messages d'erreur
  const clearError = () => {
    setError(null);
  };

  // Valeur du contexte à fournir aux composants
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!accessToken && !!user, // Changer la condition pour considérer aussi le token
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte d'authentification
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
