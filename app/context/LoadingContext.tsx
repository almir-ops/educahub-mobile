import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (state: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoadingState] = useState<boolean>(false);

  const setLoading = useCallback((state: boolean) => {
    setLoadingState(state);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};