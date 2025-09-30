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
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-y-4 gap-x-2">
        <div className="flex-grow md:flex-grow-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Expense Tracker
          </h1>
          <p className="text-sm text-neutral-400 hidden sm:block">Track Smarter. Spend Better.</p>
        </div>

        <div className="w-full md:flex-1 md:px-8 order-3 md:order-2">
           <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 order-2 md:order-3">
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
