// src/routes/Routes.test.tsx
import { render } from '@testing-library/react';
import { publicRoutes } from './Routes.config';

describe('Routes', () => {
  it('should have correct route configuration', () => {
    expect(publicRoutes).toBeDefined();
    expect(Array.isArray(publicRoutes)).toBe(true);
  });
});
