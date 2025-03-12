// src/components/auth/LoginForm/LoginForm.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { LoginFormProps } from './LoginForm.types';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { validateEmail, validatePassword } from '../../../utils/validators/validators';
import './LoginForm.scss';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC<LoginFormProps> = React.memo(({ className = '', onRegisterClick }) => {
  // Regrouper les états liés dans un seul objet pour réduire les re-rendus
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  // État d'erreurs distinct car sa fréquence de mise à jour est différente
  const [errors, setErrors] = useState<{
    email: string | undefined;
    password: string | undefined;
  }>({ email: undefined, password: undefined });
  
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Optimisation des gestionnaires d'événements avec useCallback
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormState(prev => ({ ...prev, email: newEmail }));
    
    // Effacer les erreurs d'email lors de la modification
    setErrors(prev => ({ ...prev, email: undefined }));
    clearError();
  }, [clearError]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormState(prev => ({ ...prev, password: newPassword }));
    
    // Effacer les erreurs de mot de passe lors de la modification
    setErrors(prev => ({ ...prev, password: undefined }));
    clearError();
  }, [clearError]);

  // Validation de formulaire optimisée
  const validateForm = useCallback(() => {
    const { email, password } = formState;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return false;
    }
    return true;
  }, [formState]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      console.log('Tentative de connexion avec:', formState.email);
      await login(formState.email, formState.password);
      // Si login réussit (pas d'erreur lancée), on navigue vers la page d'accueil
      navigate('/');
    } catch (err) {
      console.error("Erreur de connexion:", err);
      // L'erreur est déjà gérée dans le hook useAuth
    }
  }, [clearError, login, formState, navigate, validateForm]);
  
  // Mémoisation du texte du bouton
  const buttonText = useMemo(() => 
    isLoading ? 'Connexion en cours...' : 'Se connecter', 
    [isLoading]
  );
  
  // Mémoisation de la classe CSS
  const formClassName = useMemo(() => 
    `login-form ${className}`, 
    [className]
  );

  return (
    <form className={formClassName} onSubmit={handleSubmit} data-testid="login-form">
      <h2 className="form-title">Connexion</h2>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <div className="form-field">
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          value={formState.email}
          onChange={handleEmailChange}
          error={errors.email}
          placeholder="Votre adresse email"
          required
          autoComplete="username"
          aria-invalid={!!errors.email}
        />
      </div>
      
      <div className="form-field">
        <Input
          type="password"
          id="password"
          name="password"
          label="Mot de passe"
          value={formState.password}
          onChange={handlePasswordChange}
          error={errors.password}
          placeholder="Votre mot de passe"
          required
          autoComplete="current-password"
          aria-invalid={!!errors.password}
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {buttonText}
      </Button>
      
      <div className="form-footer">
        <p>
          Pas encore de compte ? 
          <button 
            type="button"
            className="link-button"
            onClick={onRegisterClick}
          >
            Créer un compte
          </button>
        </p>
      </div>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
