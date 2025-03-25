import React, { PropsWithChildren } from 'react';
import { AuthProvider } from './context/AuthContext/AuthContext';

// App.scss n'existe pas, donc on retire l'import

const App: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default App;