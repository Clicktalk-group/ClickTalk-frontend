import React, { useState } from 'react';
import './RegisterForm.scss';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { RegisterFormProps } from './RegisterForm.types';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, email, password, confirmPassword });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <Input 
        name="username" 
        label="Nom d'utilisateur" 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <Input 
        name="email" 
        label="Adresse email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input 
        name="password" 
        label="Mot de passe" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Input 
        name="confirmPassword" 
        label="Confirmer le mot de passe" 
        type="password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
      />
      <Button type="submit">S'inscrire</Button>
    </form>
  );
};

export default RegisterForm;
