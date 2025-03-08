// src/components/modals/AccountModal.tsx
import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import './AccountModal.scss';

interface AccountModalContentProps {
  onClose: () => void;
}

const AccountModalContent: React.FC<AccountModalContentProps> = ({ onClose }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    password: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour sauvegarder les changements via API
    console.log('Données à sauvegarder :', formData);
    onClose();
  };
  
  return (
    <div className="account-modal-content">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <div className="input-with-icon">
            <input 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing.username}
              title="Nom d'utilisateur"
              placeholder="Nom d'utilisateur"
            />
            <button 
              type="button" 
              className="edit-button"
              onClick={() => toggleEdit('username')}
              title="Modifier le nom d'utilisateur"
            >
              <FaPen />
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <div className="input-with-icon">
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing.email}
            />
            <button 
              type="button" 
              className="edit-button"
              onClick={() => toggleEdit('email')}
            >
              <FaPen />
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Mot de passe</label>
          <div className="input-with-icon">
            <input 
              type="password"
              name="currentPassword"
              placeholder="Mot de passe actuel"
              title="Mot de passe actuel"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={!isEditing.password}
            />
            <button 
              type="button" 
              className="edit-button"
              onClick={() => toggleEdit('password')}
            >
              <FaPen />
            </button>
          </div>
        </div>
        
        {isEditing.password && (
          <>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input 
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                title="Nouveau mot de passe"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input 
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="save-button">
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountModalContent;