// src/context/ModalContext/ModalContext.tsx
import React, { createContext, useState, useContext, useCallback, useMemo, ReactNode } from 'react';

// Type pour les données du modal
type ModalData = Record<string, any> | null;

interface ModalContextProps {
  isOpen: boolean;
  modalType: string | null;
  modalData: ModalData;
  openModal: (type: string, data?: ModalData) => void;
  closeModal: () => void;
}

const defaultModalContext: ModalContextProps = {
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: () => {},
  closeModal: () => {},
};

// Création du contexte avec un type défini
const ModalContext = createContext<ModalContextProps>(defaultModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // Regrouper les états liés dans un objet unique pour réduire les rendus
  const [modalState, setModalState] = useState({
    isOpen: false,
    modalType: null as string | null,
    modalData: null as ModalData,
  });

  // Optimisation des fonctions avec useCallback
  const openModal = useCallback((type: string, data?: ModalData) => {
    if (!type) {
      console.error('Modal type is required');
      return;
    }

    console.log(`Opening modal: ${type}`, data);
    
    // Utiliser une fonction pour garantir un état à jour
    setModalState({
      isOpen: true,
      modalType: type,
      modalData: data || null,
    });
    
    // Empêcher le défilement du body quand le modal est ouvert
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    console.log('Closing modal');
    
    setModalState({
      isOpen: false,
      modalType: null,
      modalData: null,
    });
    
    // Rétablir le défilement du body
    document.body.style.overflow = '';
    
    // Force focus back to document for accessibility
    document.body.focus();
  }, []);

  // Mémoïser la valeur du contexte pour éviter les rendus inutiles
  const contextValue = useMemo(() => ({
    ...modalState,
    openModal,
    closeModal,
  }), [modalState, openModal, closeModal]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook optimisé pour utiliser le contexte
export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};
