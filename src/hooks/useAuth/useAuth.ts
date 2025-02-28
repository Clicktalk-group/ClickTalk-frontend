import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext"; // AuthContext maintenant exporté

// Hook personnalisé pour consommer le contexte
export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }

  return auth;
};