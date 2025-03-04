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
      // setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      // Stocker les informations dans le localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Mettre à jour l'état
      setToken(response.token);
      setUser(response.user);
    } catch (err: any) {
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
      
      const response = await authService.register(credentials);
      
      // Stocker les informations dans le localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Mettre à jour l'état
      setToken(response.token);
      setUser(response.user);
    } catch (err: any) {
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
        await authService.logout();
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
    isAuthenticated: !!user,
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
  return context;
};

export default AuthContext;
