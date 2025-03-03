import apiClient from "../api/api";

// Type pour la réponse d'authentification
interface AuthResponse {
  token: string;
}

// Login utilisateur
export async function login(email: string, password: string): Promise<string> {
  const response = await apiClient.post<AuthResponse>(process.env.REACT_APP_API_URL +"auth/login", {
    email,
    password,
  });
  const data = response.data;
  localStorage.setItem("authToken", JSON.stringify(data)); // Stocke le token
  return data.token;
}

// Inscription utilisateur
export async function register(userData: { email: string; username: string; password: string }): Promise<void> {
  const response = await apiClient.post(process.env.REACT_APP_API_URL +"auth/register", userData); // Correction pour utiliser apiClient
}

// Logout (supprime le token du client)
export function logout(): void {
  localStorage.removeItem("authToken"); // Supprime le token du stockage local
}
