import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginCredentials } from '../../../types/auth.types';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { validateEmail, validatePassword } from '../../../utils/validators/validators';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
  const { login, error, clearError, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    email: null,
    password: null
  });

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mettre à jour les credentials
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Réinitialiser l'erreur au niveau du contexte
    if (error) clearError();
    
    // Valider le champ en temps réel
    if (name === 'email') {
      setFieldErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    } else if (name === 'password') {
      setFieldErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les champs avant soumission
    const emailError = validateEmail(credentials.email);
    const passwordError = validatePassword(credentials.password);
    
    setFieldErrors({
      email: emailError,
      password: passwordError
    });
    
    // Si pas d'erreurs, soumettre le formulaire
    if (!emailError && !passwordError) {
      try {
        await login(credentials);
        // La redirection sera gérée par le routeur après mise à jour du contexte
      } catch (error) {
        // Les erreurs sont déjà gérées dans le contexte
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <img className="form-logo" src="public/assets/images/logo.png" alt="ClickTalk Logo" />
      <h2 className="form-title">Connexion</h2>
      
      <div className="login-form__field">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          error={fieldErrors.email || undefined}
          aria-label="Adresse email"
        />
      </div>
      
      <div className="login-form__field">
        <Input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          error={fieldErrors.password || undefined}
          aria-label="Mot de passe"
        />
      </div>
      
      {/* Message d'erreur global */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        variant="primary"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>
      
      <div className="auth-footer">
        Pas encore de compte ? <Link to="/auth/register">S'inscrire</Link>
      </div>
    </form>
  );
};

export default LoginForm;
