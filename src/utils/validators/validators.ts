/**
 * Valide le format d'une adresse email.
 * @param email Adresse email en entrée.
 * @returns {string | undefined} Message d'erreur ou undefined si valide.
 */
export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return "L'email est requis.";
  }
  if (!emailRegex.test(email)) {
    return "L'email n'est pas valide.";
  }
  return undefined; // Pas d'erreur
};

/**
 * Valide un mot de passe selon des critères spécifiques.
 * @param password Mot de passe en entrée.
 * @returns {string | undefined} Message d'erreur ou undefined si valide.
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password.trim()) {
    return "Le mot de passe est requis.";
  }
  
  // Nouvelle regex pour les exigences de mot de passe
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{14,25}$/;
  
  if (!passwordRegex.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule, un chiffre, un caractère spécial et faire entre 14 et 25 caractères.";
  }
  
  return undefined; // Pas d'erreur
};

/**
 * Vérifie si deux mots de passe correspondent.
 * @param password Mot de passe principal.
 * @param confirmPassword Confirmation du mot de passe.
 * @returns {string | undefined} Message d'erreur ou undefined si valide.
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas.";
  }
  return undefined; // Pas d'erreur
};

/**
 * Valide un nom d'utilisateur.
 * @param username Nom d'utilisateur en entrée.
 * @returns {string | undefined} Message d'erreur ou undefined si valide.
 */
export const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) {
    return "Le nom d'utilisateur est requis.";
  }
  if (username.length < 3) {
    return "Le nom d'utilisateur doit comporter au moins 3 caractères.";
  }
  return undefined; // Pas d'erreur
};
