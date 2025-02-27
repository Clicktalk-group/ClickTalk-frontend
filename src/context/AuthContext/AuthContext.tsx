import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login, logout } from "../../services/auth/auth";

interface AuthProviderProps {
  children: ReactNode; // Ajoute le typage correct de children
}

// Typer l'état du contexte
interface AuthContextState {
  isAuthenticated: boolean;
  user: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

// Provider Auth
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Vérifie si un token est présent au chargement
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      setUser("Authenticated User"); // Ajustez en fonction de votre backend
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const token = await login(email, password);
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(email);
  };

  const signOut = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour consommer le AuthContext
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
