import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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

export const AuthContext = createContext<AuthContextState | undefined>(undefined); // Export explicite ajouté

// Provider pour gérer l'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // Vérifie les informations de connexion lors du montage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      setUser("Authenticated User"); // Si possible, récupérez les infos utilisateur.
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

// Hook pour consommer le contexte (aucun changement ici)
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
