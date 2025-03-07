// src/context/ModalContext/ModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextProps {
  isOpen: boolean;
  modalType: string | null;
  modalData: any | null;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps>({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: () => {},
  closeModal: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any | null>(null);

  const openModal = (type: string, data?: any) => {
    setModalType(type);
    setModalData(data || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        modalData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
