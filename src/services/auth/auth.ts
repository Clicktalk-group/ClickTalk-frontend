import { apiService } from '../api/api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types/auth.types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  DELETE_ACCOUNT: '/auth/delete-account',
  UPDATE_PASSWORD: '/auth/update-password'
};

export const authService = {
  // Login - Retourne le token et les infos utilisateur
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  },

  // Register - Crée un nouvel utilisateur
  register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, credentials);
  },

  // Logout - Pour se déconnecter côté serveur
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
