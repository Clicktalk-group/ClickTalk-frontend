import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login, logout } from "../../services/auth/auth";

interface AuthProviderProps {
  children: ReactNode;
}

// Type pour le contexte
interface AuthContextState {
  isAuthenticated: boolean;
  user: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      setUser("Authenticated User"); // Option : passer par une API pour obtenir les données utilisateur
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const token = await login(email, password);
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      setUser(email);
    } catch (error) {
      console.error("Erreur pendant la connexion :", error);
      alert("Échec de la connexion. Vérifiez vos identifiants.");
    }
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

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
