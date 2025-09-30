import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface BalanceProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const Balance: React.FC<BalanceProps> = ({ balance, totalIncome, totalExpense }) => {
  const { currency, formatCurrency } = useCurrency();
  
  return (
    <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider">Your Balance</h2>
        <p className={`text-4xl font-bold ${balance >= 0 ? 'text-neutral-100' : 'text-red-500'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
      <div className="flex justify-around bg-neutral-900/50 p-4 rounded-xl">
        <div className="text-center">
          <h3 className="text-md font-semibold text-neutral-400 uppercase tracking-wider">Income</h3>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="w-px bg-neutral-700"></div>
        <div className="text-center">
          <h3 className="text-md font-semibold text-neutral-400 uppercase tracking-wider">Expense</h3>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;