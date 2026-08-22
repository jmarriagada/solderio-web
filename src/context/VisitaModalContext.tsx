"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TipoVisita = "gratuita" | "ingenieria";

interface VisitaModalContextType {
  isOpen: boolean;
  selectedType: TipoVisita;
  openModal: (type?: TipoVisita) => void;
  closeModal: () => void;
  setSelectedType: (type: TipoVisita) => void;
}

const VisitaModalContext = createContext<VisitaModalContextType | undefined>(undefined);

export function VisitaModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TipoVisita>("gratuita");

  const openModal = (type: TipoVisita = "gratuita") => {
    setSelectedType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <VisitaModalContext.Provider
      value={{
        isOpen,
        selectedType,
        openModal,
        closeModal,
        setSelectedType,
      }}
    >
      {children}
    </VisitaModalContext.Provider>
  );
}

export function useVisitaModal() {
  const context = useContext(VisitaModalContext);
  if (!context) {
    throw new Error("useVisitaModal debe ser utilizado dentro de un VisitaModalProvider");
  }
  return context;
}
