import { publicRoutes, privateRoutes } from "./Routes.config";

describe("Routes", () => {
  it("should have correct route configuration for publicRoutes", () => {
    expect(publicRoutes).toBeDefined();
    expect(Array.isArray(publicRoutes)).toBe(true);
    expect(publicRoutes.some((route) => route.path === "/auth")).toBe(true);
  });

  it("should have correct route configuration for privateRoutes", () => {
    expect(privateRoutes).toBeDefined();
    expect(Array.isArray(privateRoutes)).toBe(true);
    expect(privateRoutes.some((route) => route.path === "/chat")).toBe(true);
  });
});
