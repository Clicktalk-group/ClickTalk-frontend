import React, { useState } from 'react';
import './LoginForm.scss';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { LoginFormProps } from './LoginForm.types';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <Button type="submit">Se connecter</Button>
    </form>
  );
};

export default LoginForm;
