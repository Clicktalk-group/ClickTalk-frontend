import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

describe('MainLayout Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <MainLayout>
          <div data-testid="test-children">Test children content</div>
        </MainLayout>
      </BrowserRouter>
    );
    
    // Vérifier que le contenu est bien rendu
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  test('toggle button is present', () => {
    render(
      <BrowserRouter>
        <MainLayout>
          <div>Test content</div>
        </MainLayout>
      </BrowserRouter>
    );
    
    // Vérifier que le bouton de toggle est présent
    const toggleButton = screen.getByRole('button', { name: /☰|×/ });
    expect(toggleButton).toBeInTheDocument();
  });
});
