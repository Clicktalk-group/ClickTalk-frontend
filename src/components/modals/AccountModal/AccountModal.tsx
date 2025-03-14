// src/components/modals/AccountModal.tsx
import React, { useState, useCallback, memo } from 'react';
import { FaSave } from 'react-icons/fa';
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
  onSave,
  placeholder
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  placeholder?: string;
}) => {
  // Fonction pour déterminer la valeur appropriée pour autoComplete
  const getAutoCompleteValue = () => {
    if (type === 'password') {
      return name === 'currentPassword' ? 'current-password' : 'new-password';
    }
    
    if (name === 'username') return 'username';
    if (name === 'email') return 'email';
    
    // Au lieu de 'off', retournez une valeur valide pour autoComplete
    // ou n'incluez pas l'attribut du tout
    return undefined;
  };
  
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="input-with-icon">
        <input 
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          title={label}
          placeholder={placeholder || label}
          {...(getAutoCompleteValue() ? { autoComplete: getAutoCompleteValue() } : {})}
        />
        <button 
          type="button" 
          className="edit-button"
          onClick={onSave}
          title={`Sauvegarder ${label.toLowerCase()}`}
          aria-label={`Sauvegarder ${label.toLowerCase()}`}
        >
          <FaSave />
        </button>
      </div>
    </div>
  );
});

EditableField.displayName = 'EditableField';

const AccountModalContent: React.FC<AccountModalContentProps> = memo(({ onClose }) => {
  const { user, refreshUserData } = useAuth();
  
  // Utilisation d'un état unique pour le formulaire
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // État pour les messages de statut
  const [statusMessages, setStatusMessages] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Gestionnaire d'événements mémorisé pour les changements de champ
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Fonction pour mettre à jour les données utilisateur localement
  const updateLocalUserData = useCallback((updatedData: Partial<typeof user>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Rafraîchir les données utilisateur dans le contexte
    refreshUserData();
  }, [user, refreshUserData]);
  
  // Fonction pour sauvegarder le nom d'utilisateur
  const saveUsername = useCallback(async () => {
    if (!formData.username) {
      setStatusMessages(prev => ({ ...prev, username: 'Le nom d\'utilisateur ne peut pas être vide' }));
      return;
    }
    
    try {
      // Appel API pour mettre à jour le nom d'utilisateur
      // Exemple: await api.post('/auth/update-username', { username: formData.username });
      console.log('Sauvegarde du nom d\'utilisateur:', formData.username);
      
      // Mise à jour du contexte utilisateur
      updateLocalUserData({ username: formData.username });
      
      setStatusMessages(prev => ({ ...prev, username: 'Nom d\'utilisateur sauvegardé!' }));
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setStatusMessages(prev => ({ ...prev, username: '' }));
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nom d\'utilisateur:', error);
      setStatusMessages(prev => ({ ...prev, username: 'Erreur lors de la sauvegarde' }));
    }
  }, [formData.username, updateLocalUserData]);
  
  // Fonction pour sauvegarder l'email
  const saveEmail = useCallback(async () => {
    if (!formData.email) {
      setStatusMessages(prev => ({ ...prev, email: 'L\'email ne peut pas être vide' }));
      return;
    }
    
    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessages(prev => ({ ...prev, email: 'Format d\'email invalide' }));
      return;
    }
    
    try {
      // Appel API pour mettre à jour l'email
      // Exemple: await api.post('/auth/update-email', { email: formData.email });
      console.log('Sauvegarde de l\'email:', formData.email);
      
      // Mise à jour du contexte utilisateur
      updateLocalUserData({ email: formData.email });
      
      setStatusMessages(prev => ({ ...prev, email: 'Email sauvegardé!' }));
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setStatusMessages(prev => ({ ...prev, email: '' }));
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'email:', error);
      setStatusMessages(prev => ({ ...prev, email: 'Erreur lors de la sauvegarde' }));
    }
  }, [formData.email, updateLocalUserData]);
  
  // Fonction pour sauvegarder le mot de passe
  const savePassword = useCallback(async () => {
    // Validation des champs
    if (!formData.currentPassword) {
      setStatusMessages(prev => ({ ...prev, password: 'Le mot de passe actuel est requis' }));
      return;
    }
    
    if (!formData.newPassword) {
      setStatusMessages(prev => ({ ...prev, password: 'Le nouveau mot de passe est requis' }));
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatusMessages(prev => ({ ...prev, password: 'Les mots de passe ne correspondent pas' }));
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setStatusMessages(prev => ({ ...prev, password: 'Le mot de passe doit contenir au moins 8 caractères' }));
      return;
    }
    
    try {
      // Appel API pour mettre à jour le mot de passe
      // Utilisation de l'endpoint /auth/update-password
      // await api.post('/auth/update-password', { 
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword
      // });
      console.log('Sauvegarde du mot de passe');
      
      setStatusMessages(prev => ({ ...prev, password: 'Mot de passe mis à jour!' }));
      
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setStatusMessages(prev => ({ ...prev, password: '' }));
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      setStatusMessages(prev => ({ ...prev, password: 'Erreur lors de la mise à jour' }));
    }
  }, [formData]);
  
  return (
    <div className="account-modal-content">
      <form>
        <div className="field-container">
          <EditableField
            label="Nom d'utilisateur"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onSave={saveUsername}
          />
          {statusMessages.username && (
            <div className="status-message">{statusMessages.username}</div>
          )}
        </div>
        
        <div className="field-container">
          <EditableField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onSave={saveEmail}
          />
          {statusMessages.email && (
            <div className="status-message">{statusMessages.email}</div>
          )}
        </div>
        
        <div className="password-section">
          <EditableField
            label="Mot de passe actuel"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            onSave={savePassword}
            placeholder="Mot de passe actuel"
          />
          
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <div className="input-with-icon">
              <input 
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                title="Nouveau mot de passe"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="input-with-icon">
              <input 
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                title="Confirmer le nouveau mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby="passwordHint"
              />
            </div>
            <small id="passwordHint" className="form-hint">
              Le mot de passe doit contenir au moins 8 caractères
            </small>
          </div>
          
          <div className="password-actions">
            <button 
              type="button" 
              className="save-password-button"
              onClick={savePassword}
              disabled={!formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
              aria-label="Sauvegarder le mot de passe"
            >
              Sauvegarder le mot de passe
            </button>
          </div>
          
          {statusMessages.password && (
            <div className="status-message password-status">{statusMessages.password}</div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onClose}
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
      </form>
    </div>
  );
});

AccountModalContent.displayName = 'AccountModalContent';

export default AccountModalContent;
