import { useContext } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';
import { AuthContextType } from '../../types/auth.types';

/**
 * Hook permettant d'accéder au contexte d'authentification
 * @returns {AuthContextType} Le contexte d'authentification
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
};

export default useAuth;
