import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../../services/auth/auth';
import { RegisterCredentials, User, AuthContextType } from '../../types/auth.types';

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

// Interface pour token décodé
interface TokenPayload {
  exp: number;
  sub: string;
  [key: string]: any;
}

// Fonction utilitaire pour décoder le token sans dépendance externe
function parseJwt(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erreur lors du décodage du token', e);
    return null;
  }
}

// Provider d'authentification qui encapsule la logique d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialisation des valeurs d'état à partir du localStorage
  const initialToken = localStorage.getItem("token") || "";
  const initialUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [accessToken, setAccessToken] = useState<string>(initialToken);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour vérifier la validité du token
  const isTokenValid = useCallback((token: string) => {
    if (!token) return false;
    
    try {
      const decoded = parseJwt(token);
      if (!decoded) return false;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Erreur de validation du token:", error);
      return false;
    }
  }, []);

  // Fonction de déconnexion définie en amont pour éviter les erreurs de référence circulaire
  const logout = useCallback(async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Déconnexion de l'utilisateur");
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setAccessToken('');
      setUser(null);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Déconnexion réussie");
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setError("Échec de la déconnexion");
    }
  }, []);

  // Effet pour vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          // Vérifier si le token est toujours valide
          if (isTokenValid(storedToken)) {
            // Utiliser le token stocké
            setAccessToken(storedToken);
            
            // Récupérer les informations utilisateur du localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Token expiré, déconnexion
            await logout();
          }
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
        setAccessToken('');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [isTokenValid, logout]);

  // Vérification périodique de l'expiration du token
  useEffect(() => {
    if (!accessToken) return;
    
    const checkTokenExpiration = () => {
      if (!isTokenValid(accessToken)) {
        // Token expiré, déconnexion
        logout();
      }
    };
    
    // Vérifier immédiatement
    checkTokenExpiration();
    
    // Puis vérifier périodiquement
    const intervalId = setInterval(checkTokenExpiration, 60000); // Vérifier chaque minute
    
    return () => clearInterval(intervalId);
  }, [accessToken, isTokenValid, logout]);

  // Optimisé avec useCallback pour éviter les recréations de fonctions
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Tentative de connexion avec:", { email, password: '********' });
      }
      
      const response = await authService.login({ email, password });
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Réponse de connexion reçue");
      }
      
      let tokenValue = '';
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        tokenValue = response;
      } else if (response && typeof response === 'object') {
        tokenValue = response.access_token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'authentification non valide");
      }
      
      if (!tokenValue) {
        throw new Error("Aucun token reçu du serveur");
      }
      
      localStorage.setItem('token', tokenValue);
      
      if (!userData && email) {
        userData = {
          id: 1,
          email: email,
          username: 'defaultUsername',
          createdAt: new Date().toISOString(),
        };
      }
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setAccessToken(tokenValue);
      setUser(userData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Connexion réussie");
      }
      
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.response?.data?.message || "Échec de la connexion");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimisé avec useCallback
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Tentative d'inscription");
      }
      
      const response = await authService.register(credentials);
      
      let tokenValue = '';
      let userData: User | null = null;
      
      if (typeof response === 'string') {
        tokenValue = response;
      } else if (response && typeof response === 'object') {
        tokenValue = response.access_token || '';
        userData = response.user || null;
      } else {
        throw new Error("Format de réponse d'inscription non valide");
      }
      
      if (!tokenValue) {
        throw new Error("Aucun token reçu du serveur");
      }
      
      localStorage.setItem('token', tokenValue);
      
      if (!userData && credentials.email) {
        userData = {
          id: 1,
          email: credentials.email,
          username: 'defaultUsername', 
          createdAt: new Date().toISOString(),
        };
      }
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setAccessToken(tokenValue);
      setUser(userData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Inscription réussie");
      }
      
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.response?.data?.message || "Échec de l'inscription");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimisé avec useCallback
  const refreshUserData = useCallback(async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Rafraîchissement des données utilisateur");
      }
      // Implémentation du rafraîchissement des données utilisateur
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des données utilisateur:", err);
    }
  }, []);

  // Optimisé avec useCallback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = {
    user,
    access_token: accessToken,
    isAuthenticated: !!accessToken && !!user,
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
  
  if (process.env.NODE_ENV === 'development') {
    console.log("État d'authentification actuel:", { 
      isAuth: context.isAuthenticated, 
      user: context.user ? 'présent' : 'absent' 
    });
  }
  return context;
};

export default AuthContext;
