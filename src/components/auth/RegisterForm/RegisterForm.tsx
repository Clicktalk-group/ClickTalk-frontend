import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterCredentials } from '../../../types/auth.types';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from '../../../utils/validators/validators';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import './RegisterForm.scss';

const RegisterForm: React.FC = () => {
  const { register, error, clearError, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    email: null,
    password: null,
    confirmPassword: null
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
      // Valider à nouveau confirmPassword si modifié
      if (credentials.confirmPassword) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, credentials.confirmPassword)
        }));
      }
    } else if (name === 'confirmPassword') {
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(credentials.password, value)
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les champs avant soumission
    const emailError = validateEmail(credentials.email);
    const passwordError = validatePassword(credentials.password);
    const confirmPasswordError = validateConfirmPassword(
      credentials.password, 
      credentials.confirmPassword
    );
    
    setFieldErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    // Si pas d'erreurs, soumettre le formulaire
    if (!emailError && !passwordError && !confirmPasswordError) {
      try {
        await register(credentials);
        // La redirection sera gérée par le routeur après mise à jour du contexte
      } catch (error) {
        // Les erreurs sont déjà gérées dans le contexte
      }
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <img className="form-logo" src="public/assets/images/logo.png" alt="ClickTalk Logo" />
      <h2 className="form-title">Inscription</h2>
      
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        error={fieldErrors.email || undefined}
        aria-label="Adresse email"
      />
      
      <Input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={credentials.password}
        onChange={handleChange}
        error={fieldErrors.password || undefined}
        aria-label="Mot de passe"
      />
      
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirmer le mot de passe"
        value={credentials.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword || undefined}
        aria-label="Confirmation du mot de passe"
      />
      
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
        {isLoading ? 'Inscription...' : 'S\'inscrire'}
      </Button>
      
      <div className="auth-footer">
        Déjà un compte ? <Link to="/auth/login">Se connecter</Link>
      </div>
    </form>
  );
};

export default RegisterForm;
