import React, { useState } from "react";
import "./RegisterForm.scss";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { RegisterFormProps } from "./RegisterForm.types";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
} from "../../../utils/validators/validators";
import { nullToUndefined } from "../../../utils/helpers/nullToUndefined";

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  }>({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    onSubmit({ username, email, password, confirmPassword });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1 className="form-title">ClickTalk</h1>
      <img src="/assets/images/logo.png" alt="Logo ClickTalk" className="form-logo" />
      
      <Input
        name="username"
        label="Nom d'utilisateur"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setErrors((prev) => ({ ...prev, username: null }));
        }}
        error={nullToUndefined(errors.username)}
      />
      <Input
        name="email"
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((prev) => ({ ...prev, email: null }));
        }}
        error={nullToUndefined(errors.email)}
      />
      <Input
        name="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((prev) => ({ ...prev, password: null }));
        }}
        error={nullToUndefined(errors.password)}
      />
      <Input
        name="confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setErrors((prev) => ({ ...prev, confirmPassword: null }));
        }}
        error={nullToUndefined(errors.confirmPassword)}
      />
      <Button type="submit">S'inscrire</Button>
    </form>
  );
};

export default RegisterForm;
