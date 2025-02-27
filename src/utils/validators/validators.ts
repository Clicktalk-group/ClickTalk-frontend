// src/utils/validators/validators.ts

/**
 * Valide le format d'une adresse email.
 * @param email Adresse email en entrée.
 * @returns {string | null} Message d'erreur ou null si valide.
 */
export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "L'email est requis.";
    }
    if (!emailRegex.test(email)) {
      return "L'email n'est pas valide.";
    }
    return null; // Pas d'erreur
  };
  
  /**
   * Valide un mot de passe selon des critères spécifiques.
   * @param password Mot de passe en entrée.
   * @returns {string | null} Message d'erreur ou null si valide.
   */
  export const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return "Le mot de passe est requis.";
    }
    if (password.length < 8) {
      return "Le mot de passe doit comporter au moins 8 caractères.";
    }
    return null; // Pas d'erreur
  };
  
  /**
   * Vérifie si deux mots de passe correspondent.
   * @param password Mot de passe principal.
   * @param confirmPassword Confirmation du mot de passe.
   * @returns {string | null} Message d'erreur ou null si valide.
   */
  export const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null; // Pas d'erreur
  };
  
  /**
   * Valide un nom d'utilisateur.
   * @param username Nom d'utilisateur en entrée.
   * @returns {string | null} Message d'erreur ou null si valide.
   */
  export const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "Le nom d'utilisateur est requis.";
    }
    if (username.length < 3) {
      return "Le nom d'utilisateur doit comporter au moins 3 caractères.";
    }
    return null; // Pas d'erreur
  };
  