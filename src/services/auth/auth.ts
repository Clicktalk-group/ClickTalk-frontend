import { apiService } from '../api/api';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '../../types/auth.types';

// Points de terminaison pour les routes d'authentification
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  DELETE_ACCOUNT: '/auth/delete-account',
  UPDATE_PASSWORD: '/auth/update-password',
};

/**
 * Service gérant les requêtes liées à l'authentification
 */
export const authService = {
  // Connexion utilisateur
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  },
  
  // Inscription utilisateur
  register: (userData: RegisterCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);
  },
  
  // Déconnexion
  logout: (): Promise<void> => {
    return apiService.post<void>(AUTH_ENDPOINTS.LOGOUT);
  },
  
  // Suppression de compte
  deleteAccount: (): Promise<void> => {
    return apiService.delete<void>(AUTH_ENDPOINTS.DELETE_ACCOUNT);
  },
  
  // Mise à jour du mot de passe
  updatePassword: (oldPassword: string, newPassword: string): Promise<void> => {
    return apiService.put<void>(AUTH_ENDPOINTS.UPDATE_PASSWORD, {
      oldPassword,
      newPassword
    });
  }
};

export default authService;
