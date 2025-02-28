import React, { useState } from "react";
import "./LoginForm.scss";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { LoginFormProps } from "./LoginForm.types";
import { validateEmail, validatePassword } from "../../../utils/validators/validators";
import { nullToUndefined } from "../../../utils/helpers/nullToUndefined";
import { useAuth } from "../../../hooks/useAuth/useAuth"; // Utilise le hook Auth

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { signIn } = useAuth(); // Hook Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email: string | null; password: string | null }>({
    email: null,
    password: null,
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      setAuthError(null);
      await signIn(email, password); // Appel via AuthContext
      onSubmit({ email, password });
    } catch (err) {
      setAuthError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="form-title">ClickTalk</h1>
      <img src="/assets/images/logo.png" alt="Logo ClickTalk" className="form-logo" />

      {authError && <div className="auth-error">{authError}</div>}

      <div className="login-form__field">
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
        <button type="button" className="login-form__link-centered" onClick={() => console.log("Email oublié")}>
          Email oublié ?
        </button>
      </div>

      <div className="login-form__field">
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
        <button type="button" className="login-form__link-centered" onClick={() => console.log("Mot de passe oublié")}>
          Mot de passe oublié ?
        </button>
      </div>

      <Button type="submit">Se connecter</Button>
    </form>
  );
};

export default LoginForm;
