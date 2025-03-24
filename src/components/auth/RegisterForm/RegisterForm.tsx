// src/components/auth/RegisterForm/RegisterForm.tsx
import React, { useState, useCallback, useMemo } from 'react';
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

export const RegisterForm: React.FC<RegisterFormProps> = React.memo(({ className = '', onLoginClick }) => {
  // État unifié pour les données du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // État séparé pour les erreurs
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
  
  // État pour suivre les champs touchés (améliore l'UX)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Gestionnaire d'événement optimisé pour les changements de champs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Marquer le champ comme touché
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Réinitialiser l'erreur pour ce champ
    setErrors(prev => ({ ...prev, [name]: undefined }));
    
    // Valider à la volée pour donner un feedback immédiat
    if (touched[name as keyof typeof touched]) {
      let fieldError: string | undefined;
      
      switch (name) {
        case 'username':
          fieldError = validateUsername(value);
          break;
        case 'email':
          fieldError = validateEmail(value);
          break;
        case 'password':
          fieldError = validatePassword(value);
          // Si le mot de passe change, revalider la confirmation
          if (formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
        case 'confirmPassword':
          fieldError = validateConfirmPassword(formData.password, value);
          break;
      }
      
      if (fieldError) {
        setErrors(prev => ({ ...prev, [name]: fieldError }));
      }
    }
    
    clearError();
  }, [formData, touched, clearError]);
  
  // Fonction de validation complète du formulaire
  const validateForm = useCallback(() => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password, 
      formData.confirmPassword
    );
    
    const newErrors = {
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    };
    
    setErrors(newErrors);
    
    // Marquer tous les champs comme touchés
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    // Le formulaire est valide si aucune erreur n'est présente
    return !usernameError && !emailError && !passwordError && !confirmPasswordError;
  }, [formData]);
  
  // Gestionnaire de soumission optimisé
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Valider tous les champs avant de soumettre
    if (!validateForm()) return;
    
    try {
      await register(formData);
      // Si register réussit (pas d'erreur lancée), on navigue vers la page d'accueil
      navigate('/');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  }, [clearError, register, formData, navigate, validateForm]);
  
  // Mémoisation des valeurs calculées
  const buttonText = useMemo(() => 
    isLoading ? 'Inscription en cours...' : 'Créer un compte', 
    [isLoading]
  );
  
  const formClassName = useMemo(() => 
    `register-form ${className}`, 
    [className]
  );

  // Composant de champ réutilisable pour réduire la duplication
  const renderField = useCallback((
    id: string,
    label: string,
    type: 'text' | 'email' | 'password' | 'number' | 'search',
    placeholder: string = '',
    autoComplete: string = ''
  ) => (
    <div className="form-field">
      <Input
        type={type}
        id={id}
        name={id}
        label={label}
        value={formData[id as keyof typeof formData] as string}
        onChange={handleChange}
        error={errors[id as keyof typeof errors]}
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
        aria-invalid={!!errors[id as keyof typeof errors]}
      />
    </div>
  ), [formData, errors, handleChange]);
  
  return (
    <form className={formClassName} onSubmit={handleSubmit} data-testid="register-form">
      <h2 className="form-title">Inscription</h2>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      {renderField(
        'username', 
        "Nom d'utilisateur", 
        'text', 
        "Votre nom d'utilisateur", 
        'username'
      )}
      
      {renderField(
        'email', 
        'Email', 
        'email', 
        'Votre adresse email', 
        'email'
      )}
      
      {renderField(
        'password', 
        'Mot de passe', 
        'password', 
        'Votre mot de passe (8 caractères min.)', 
        'new-password'
      )}
      
      {renderField(
        'confirmPassword', 
        'Confirmer le mot de passe', 
        'password', 
        'Confirmez votre mot de passe', 
        'new-password'
      )}
      
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
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
