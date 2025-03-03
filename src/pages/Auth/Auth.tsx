import React from 'react';
import './Auth.scss';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { useLocation } from 'react-router-dom';
import { register } from '../../services/auth/auth';
import { login } from '../../services/auth/auth';

const Auth: React.FC = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname.includes('/register');

  const handleLogin = (data: { email: string; password: string }) => {
    login(data.email, data.password);
  };

  const handleRegister = (data: { username: string; email: string; password: string; confirmPassword: string }) => {
    register(data);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isRegisterPage ? (
          <>
            <h1 className="auth-title">Inscription</h1>
            <RegisterForm onSubmit={handleRegister} />
            <p className="auth-footer">
              Vous avez déjà un compte ? <a href="/auth/login">Connectez-vous.</a>
            </p>
          </>
        ) : (
          <>
            <h1 className="auth-title">Connexion</h1>
            <LoginForm onSubmit={handleLogin} />
            <p className="auth-footer">
              Vous n'avez pas de compte ? <a href="/auth/register">Inscrivez-vous.</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
