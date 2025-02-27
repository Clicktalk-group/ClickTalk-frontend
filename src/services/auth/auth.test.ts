import axios from "axios";
import type { AxiosResponse } from "axios"; // Correction de l'import pour AxiosResponse
import { login, register, logout } from "./auth";

// Mock d'Axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>; // Typage de mock Axios

// Fonction pour générer des réponses mockées conformes
const createMockAxiosResponse = <T>(data: T): AxiosResponse<T> => {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { url: "/mock-url", method: "POST" }, // Champs nécessaires pour l'interface AxiosResponse
  };
};

describe("Auth Service", () => {
  const BASE_URL = "http://localhost:8080/api";
  const mockToken = "mocked-jwt-token";

  afterEach(() => {
    jest.resetAllMocks(); // Réinitialiser les mocks après chaque test
  });

  describe("login", () => {
    it("should successfully log in and return a JWT token", async () => {
      // Mock de la réponse Axios avec token
      mockedAxios.post.mockResolvedValueOnce(
        createMockAxiosResponse({ token: mockToken }) // Utilise createMockAxiosResponse pour conformer le typage
      );

      const token = await login("test@example.com", "password123");

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/auth/login`, {
        email: "test@example.com",
        password: "password123",
      });
      expect(token).toBe(mockToken);
    });

    it("should throw an error for invalid credentials", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Invalid credentials"));

      await expect(login("bad-user@example.com", "wrongpassword")).rejects.toThrow(
        "Invalid credentials"
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/auth/login`, {
        email: "bad-user@example.com",
        password: "wrongpassword",
      });
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      // Mock de la réponse d'inscription (vide)
      mockedAxios.post.mockResolvedValueOnce(createMockAxiosResponse({}));

      await expect(
        register({ email: "test@example.com", username: "testuser", password: "password123" })
      ).resolves.not.toThrow();

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/auth/register`, {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      });
    });

    it("should throw an error if registration fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Registration error"));

      await expect(
        register({ email: "test@example.com", username: "testuser", password: "password123" })
      ).rejects.toThrow("Registration error");

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/auth/register`, {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      });
    });
  });

  describe("logout", () => {
    it("should remove token from localStorage", () => {
      localStorage.setItem("authToken", mockToken);
      logout();
      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });
});
