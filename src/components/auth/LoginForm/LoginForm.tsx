import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginFormProps } from './LoginForm.types';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { validateEmail, validatePassword } from '../../../utils/validators/validators';
import './LoginForm.scss';

export const LoginForm: React.FC<LoginFormProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email: string | undefined;
    password: string | undefined;
  }>({ email: undefined, password: undefined });
  
  const { login, isLoading, error, clearError } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validation des champs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }
    
    try {
      await login({ email, password });
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };
  
  return (
    <form className={`login-form ${className}`} onSubmit={handleSubmit} data-testid="login-form">
      <h2 className="form-title">Connexion</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-field">
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="Votre adresse email"
          required
        />
      </div>
      
      <div className="form-field">
        <Input
          type="password"
          id="password"
          name="password"
          label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Votre mot de passe"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={isLoading}
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
      
      <div className="form-footer">
        <p>
          Pas encore de compte ? <Link to="/auth/register">Créer un compte</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
