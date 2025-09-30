import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (value: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatCurrency = useMemo(() => (value: number) => {
    try {
      const formatted = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
      }).format(value);

      if (currency === 'ZAR') {
        // Ensure 'R' is used for Rand instead of 'ZAR' which can appear in some locales
        return formatted.replace('ZAR', 'R');
      }
      return formatted;
    } catch (e) {
      console.error("Invalid currency code:", currency);
      // Fallback to USD if the code is invalid
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
  }, [currency]);

  const getCurrencySymbol = useMemo(() => () => {
    if (currency === 'ZAR') {
      return 'R';
    }
    try {
        const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).formatToParts(1);
        return parts.find(part => part.type === 'currency')?.value || '$';
    } catch (e) {
        return '$'; // Fallback symbol
    }
  }, [currency]);


  const value = {
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};