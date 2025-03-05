import React, { useState } from 'react';
import { RegisterFormProps } from './RegisterForm.types';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateUsername 
} from '../../../utils/validators/validators';
import './RegisterForm.scss';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC<RegisterFormProps> = ({ className = '', onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{
    username: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
  }>({
    username: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined
  });
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Effacer l'erreur du champ modifié
    setErrors({ ...errors, [name]: undefined });
    clearError();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validation des champs
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password, 
      formData.confirmPassword
    );
    
    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }
    
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };
  
  return (
    <form className={`register-form ${className}`} onSubmit={handleSubmit} data-testid="register-form">
      <h2 className="form-title">Inscription</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-field">
        <Input
          type="text"
          id="username"
          name="username"
          label="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Votre nom d'utilisateur"
          required
        />
      </div>
      
      <div className="form-field">
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
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
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Votre mot de passe (8 caractères min.)"
          required
        />
      </div>
      
      <div className="form-field">
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirmez votre mot de passe"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={isLoading}
      >
        {isLoading ? 'Inscription en cours...' : 'Créer un compte'}
      </Button>
      
      <div className="form-footer">
        <p>
          Déjà un compte ? 
          <button 
            type="button"
            className="link-button"
            onClick={onLoginClick}
          >
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
