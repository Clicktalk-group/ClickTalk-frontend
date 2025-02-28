import axios from "axios";
import { environment } from "../../config/environment"; // Utiliser les variables centralisées

// Type pour la réponse d'authentification
interface AuthResponse {
  token: string;
}

// Login utilisateur
export async function login(email: string, password: string): Promise<string> {
  const response = await axios.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
    email,
    password,
  });
  return response.data.token; // Renvoie le token JWT reçu
}

// Inscription utilisateur
export async function register(userData: { email: string; username: string; password: string }): Promise<void> {
  await axios.post(`${environment.apiUrl}/auth/register`, userData);
}

// Logout (supprime le token du client)
export function logout(): void {
  localStorage.removeItem("authToken"); // Supprime le token du stockage local
}
