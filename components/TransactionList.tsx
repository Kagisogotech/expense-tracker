import React from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon } from './Icons';
import { useCurrency } from '../contexts/CurrencyContext';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: () => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.Income;
  const { formatCurrency } = useCurrency();

  const sign = isIncome ? '+' : '-';
  const amountColor = isIncome ? 'text-emerald-400' : 'text-red-500';
  const borderColor = isIncome ? 'border-emerald-500' : 'border-red-500';
  const glowColor = isIncome ? 'hover:shadow-emerald-500/20' : 'hover:shadow-red-500/20';

  // A simple hashing function to generate a consistent color for a given category string.
  // This ensures that the same category always has the same color.
  const categoryColorPalette = [
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#f97316', // orange-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#db2777', // pink-600
    '#f59e0b', // amber-500
    '#14b8a6', // teal-500
  ];
  const getColorForCategory = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Ensure 32bit integer
    }
    const index = Math.abs(hash % categoryColorPalette.length);
    return categoryColorPalette[index];
  };

  const categoryColor = getColorForCategory(transaction.category);

  return (
    <li className={`flex items-center justify-between p-3 bg-neutral-800 rounded-lg border-l-4 ${borderColor} my-2 transition-all duration-300 hover:bg-neutral-700/50 hover:-translate-y-1 hover:shadow-lg ${glowColor} group`}>
      <div className="flex flex-col flex-1">
        <span className="font-semibold text-neutral-100">{transaction.description}</span>
        <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
          <span style={{ backgroundColor: categoryColor }} className="w-2.5 h-2.5 rounded-full inline-block" aria-hidden="true"></span>
          <span>{transaction.category}</span>
          <span className="text-neutral-500" aria-hidden="true">·</span>
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`font-bold ${amountColor}`}>{sign}{formatCurrency(transaction.amount)}</span>
        <button
          onClick={onDelete}
          className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:drop-shadow-[0_0_4px_rgba(239,68,68,0.7)]"
          aria-label="Delete transaction"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  return (
    <ul className="max-h-96 overflow-y-auto pr-2">
      {transactions.map((transaction) => (
        <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            onDelete={() => onDeleteTransaction(transaction.id)}
        />
      ))}
    </ul>
  );
};

export default TransactionList;