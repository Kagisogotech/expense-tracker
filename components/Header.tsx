import React from 'react';
import CurrencySelector from './CurrencySelector';
import DownloadPDFButton from './DownloadPDFButton';
import { Transaction } from '../types';
import SearchBar from './SearchBar';

interface HeaderProps {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
  initialBalance: number;
  budget: number;
  monthlyExpense: number;
  searchTerm: string;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  transactions,
  balance,
  totalIncome,
  totalExpense,
  initialBalance,
  budget,
  monthlyExpense,
  searchTerm,
  onSearch,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-neutral-100">
            Expense Tracker
          </h1>
          <p className="text-sm text-neutral-400">Track Smarter. Spend Better.</p>
        </div>
        <div className="flex-1 flex justify-center px-8">
           <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
        </div>
        <div className="flex items-center gap-4">
          <DownloadPDFButton
            transactions={transactions}
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            initialBalance={initialBalance}
            budget={budget}
            monthlyExpense={monthlyExpense}
          />
          <CurrencySelector />
        </div>
      </div>
    </header>
  );
};

export default Header;