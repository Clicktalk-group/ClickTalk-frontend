// src/pages/Auth/Auth.tsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { Card } from '../../components/common/Card/Card';
import './Auth.scss';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    location.pathname.includes('register') ? 'register' : 'login'
  );
  
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mettre à jour l'URL lorsque l'onglet actif change
  useEffect(() => {
    if (activeTab === 'login') {
      navigate('/auth/login', { replace: true });
    } else {
      navigate('/auth/register', { replace: true });
    }
  }, [activeTab, navigate]);
  
  console.log("État Auth.tsx:", { isAuthenticated, isLoading });

  // Rediriger si déjà authentifié
  if (!isLoading && isAuthenticated) {
    console.log("Utilisateur authentifié, redirection vers la page d'accueil");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="app-branding">
          <h1 className="app-title">ClickTalk</h1>
          <img src="/assets/images/logo.png" alt="ClickTalk Logo" className="app-logo" />
        </div>
        
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Connexion
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Inscription
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <LoginForm onRegisterClick={() => setActiveTab('register')} />
        ) : (
          <RegisterForm onLoginClick={() => setActiveTab('login')} />
        )}
      </Card>
    </div>
  );
};

export default Auth;
