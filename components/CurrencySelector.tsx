import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CURRENCIES = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  JPY: 'Japanese Yen',
  GBP: 'British Pound Sterling',
  INR: 'Indian Rupee',
  ZAR: 'South African Rand',
};

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <div>
      <label htmlFor="currency-select" className="sr-only">Select Currency</label>
      <select
        id="currency-select"
        value={currency}
        onChange={handleCurrencyChange}
        className="block w-full rounded-md border-neutral-700 bg-neutral-900 py-2 pl-3 pr-10 text-neutral-200 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {Object.entries(CURRENCIES).map(([code, name]) => (
          <option key={code} value={code} className="bg-neutral-800">
            {code} - {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;