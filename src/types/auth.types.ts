// Utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

// Informations de connexion
export interface LoginCredentials {
  email: string;
  password: string;
}

// Informations d'inscription
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Réponse d'authentification
export interface AuthResponse {
  token: string;
  user: User;
}

// Interface du contexte d'authentification
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
