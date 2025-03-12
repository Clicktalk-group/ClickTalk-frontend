// src/components/modals/AccountModal.tsx
import React, { useState, useCallback, useMemo, memo } from 'react';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import './AccountModal.scss';

interface AccountModalContentProps {
  onClose: () => void;
}

// Composant de champ d'entrée réutilisable
const EditableField = memo(({
  label,
  name,
  type,
  value,
  onChange,
  isDisabled,
  onToggleEdit,
  placeholder
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  onToggleEdit: () => void;
  placeholder?: string;
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <div className="input-with-icon">
      <input 
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        title={label}
        placeholder={placeholder || label}
      />
      <button 
        type="button" 
        className="edit-button"
        onClick={onToggleEdit}
        title={`Modifier ${label.toLowerCase()}`}
        aria-label={`Modifier ${label.toLowerCase()}`}
      >
        <FaPen />
      </button>
    </div>
  </div>
));

EditableField.displayName = 'EditableField';

const AccountModalContent: React.FC<AccountModalContentProps> = memo(({ onClose }) => {
  const { user } = useAuth();
  
  // Utilisation d'un état unique pour le formulaire
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // État pour le mode édition
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    password: false
  });
  
  // Gestionnaire d'événements mémorisé pour les changements de champ
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Fonction pour basculer l'état d'édition d'un champ
  const toggleEditFactory = useCallback((field: keyof typeof isEditing) => {
    return () => {
      setIsEditing(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    };
  }, []);
  
  // Gestionnaire d'événements mémorisé pour la soumission du formulaire
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Validation des données avant sauvegarde
    if (isEditing.password) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      if (formData.newPassword && formData.newPassword.length < 8) {
        alert("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
    }
    
    // Logique pour sauvegarder les changements via API
    console.log('Données à sauvegarder :', formData);
    onClose();
  }, [formData, isEditing.password, onClose]);

  // Vérification de la validité du formulaire
  const isFormValid = useMemo(() => {
    if (isEditing.username && !formData.username) return false;
    if (isEditing.email && !formData.email) return false;
    if (isEditing.password) {
      if (!formData.currentPassword) return false;
      if (formData.newPassword !== formData.confirmPassword) return false;
    }
    return true;
  }, [formData, isEditing]);
  
  return (
    <div className="account-modal-content">
      <form onSubmit={handleSubmit}>
        <EditableField
          label="Nom d'utilisateur"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          isDisabled={!isEditing.username}
          onToggleEdit={toggleEditFactory('username')}
        />
        
        <EditableField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          isDisabled={!isEditing.email}
          onToggleEdit={toggleEditFactory('email')}
        />
        
        <EditableField
          label="Mot de passe"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          isDisabled={!isEditing.password}
          onToggleEdit={toggleEditFactory('password')}
          placeholder="Mot de passe actuel"
        />
        
        {isEditing.password && (
          <>
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input 
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                title="Nouveau mot de passe"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input 
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                title="Confirmer le nouveau mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-describedby="passwordHint"
              />
              <small id="passwordHint" className="form-hint">
                Le mot de passe doit contenir au moins 8 caractères
              </small>
            </div>
          </>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onClose}
            aria-label="Annuler les modifications"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={!isFormValid}
            aria-label="Sauvegarder les modifications"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
});

AccountModalContent.displayName = 'AccountModalContent';

export default AccountModalContent;
