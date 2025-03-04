import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import './Auth.scss';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Si l'utilisateur est déjà authentifié, le rediriger vers la page principale
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
  
  // Déterminer quel formulaire afficher en fonction de l'URL
  const isRegister = location.pathname === '/auth/register';

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isRegister ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default Auth;
