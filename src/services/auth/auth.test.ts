import axios from "axios";
import { login, register, logout } from "./auth";

// Mock d'Axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Fonction pour générer des réponses conformes au typage Axios avec `config` et `url`
const createMockResponse = <T>(data: T) => {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { url: "/mock-url" }, // Ajoute une valeur fictive à `config.url`
  };
};

describe("Auth Service", () => {
  const BASE_URL = "http://localhost:8080/api";
  const mockToken = "mocked-jwt-token";

  afterEach(() => jest.resetAllMocks());

  describe("login", () => {
    it("should successfully log in and return a JWT token", async () => {
      mockedAxios.post.mockResolvedValueOnce(
        createMockResponse({ token: mockToken })
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

      await expect(
        login("bad-user@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/auth/login`, {
        email: "bad-user@example.com",
        password: "wrongpassword",
      });
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      mockedAxios.post.mockResolvedValueOnce(createMockResponse({}));

      await expect(
        register({
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        })
      ).resolves.not.toThrow();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/auth/register`,
        {
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        }
      );
    });

    it("should throw an error if registration fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Registration error"));

      await expect(
        register({
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        })
      ).rejects.toThrow("Registration error");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${BASE_URL}/auth/register`,
        {
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        }
      );
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
