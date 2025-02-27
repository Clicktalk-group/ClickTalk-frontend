// src/components/auth/LoginForm/LoginForm.tsx

import React, { useState } from "react";
import "./LoginForm.scss";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { LoginFormProps } from "./LoginForm.types";
import { validateEmail, validatePassword } from "../../../utils/validators/validators";
import { nullToUndefined } from "../../../utils/helpers/nullToUndefined";

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email: string | null; password: string | null }>({
    email: null,
    password: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return; // Bloquer la soumission si erreurs
    }

    onSubmit({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((prev) => ({ ...prev, email: null })); // Reset l'erreur sur modification
        }}
        error={nullToUndefined(errors.email)} // Transformation du `null` en `undefined`
      />
      <Input
        name="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((prev) => ({ ...prev, password: null })); // Reset l'erreur sur modification
        }}
        error={nullToUndefined(errors.password)} // Transformation du `null` en `undefined`
      />
      <Button type="submit">Se connecter</Button>
    </form>
  );
};

export default LoginForm;
