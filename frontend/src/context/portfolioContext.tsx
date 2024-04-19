import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTotalPortfolioValue } from '../services/backendApi';

interface PortfolioContextType {
  totalBalance: number | null;
  updateTotalBalance: () => void;
}

const defaultContextValue: PortfolioContextType = {
  totalBalance: null,
  updateTotalBalance: () => {},
};

const PortfolioContext = createContext<PortfolioContextType>(defaultContextValue);

export const usePortfolioContext = () => useContext(PortfolioContext);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  
  useEffect(() => {
    getTotalBalance();
  }, []);

  async function getTotalBalance() {
    try {
      const response = await getTotalPortfolioValue();
      setTotalBalance(response.data);
    } catch (error) {
      console.debug('Error fetching total balance');
    }
  }
  const updateTotalBalance = () => {
    getTotalBalance();
  };
  

  return (
    <PortfolioContext.Provider value={{ totalBalance, updateTotalBalance }}>
      {children}
    </PortfolioContext.Provider>
  );
};
