import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType } from './types';
import Balance from './components/Balance';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import Header from './components/Header';
import InitialBalance from './components/InitialBalance';
import { CurrencyProvider } from './contexts/CurrencyContext';
import TransactionTabs from './components/TransactionTabs';
import Budget from './components/Budget';
import BudgetAdvice from './components/BudgetAdvice';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return [];
  });

  const [initialBalance, setInitialBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('initialBalance');
    return savedBalance ? JSON.parse(savedBalance) : 0;
  });

  const [budget, setBudget] = useState<number>(() => {
    const savedBudget = localStorage.getItem('budget');
    return savedBudget ? JSON.parse(savedBudget) : 1000;
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('initialBalance', JSON.stringify(initialBalance));
  }, [initialBalance]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  const { totalIncome, totalExpense, balance, monthlyExpense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthExpense = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return t.type === TransactionType.Expense &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: initialBalance + income - expense,
      monthlyExpense: currentMonthExpense,
    };
  }, [transactions, initialBalance]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...transaction,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) {
      return transactions;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return transactions.filter(t =>
      t.description.toLowerCase().includes(lowercasedTerm) ||
      t.category.toLowerCase().includes(lowercasedTerm)
    );
  }, [transactions, searchTerm]);

  const showAdvice = (monthlyExpense > budget && budget > 0) || balance < 0;

  return (
    <CurrencyProvider>
      <div className="min-h-screen font-sans text-neutral-300 flex flex-col">
        <Header
          transactions={transactions}
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          initialBalance={initialBalance}
          budget={budget}
          monthlyExpense={monthlyExpense}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
        <main className="container mx-auto p-4 md:p-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InitialBalance initialBalance={initialBalance} onSetInitialBalance={setInitialBalance} />
                <Budget budget={budget} onSetBudget={setBudget} monthlyExpense={monthlyExpense} />
              </div>
              <Balance totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
              {showAdvice && <BudgetAdvice budget={budget} monthlyExpense={monthlyExpense} balance={balance} />}
              <TransactionTabs onAddTransaction={addTransaction} />
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold text-neutral-100 mb-4">History</h2>
                  {transactions.length === 0 ? (
                     <p className="text-neutral-400 text-center py-4">No transactions yet.</p>
                  ) : filteredTransactions.length === 0 ? (
                     <p className="text-neutral-400 text-center py-4">No transactions match your search.</p>
                  ) : (
                    <TransactionList transactions={filteredTransactions} onDeleteTransaction={deleteTransaction} />
                  )}
              </div>
            </div>
            
            <div className="lg:col-span-1 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl h-fit">
              <h2 className="text-2xl font-bold text-neutral-100 mb-4 text-center">Expense Breakdown</h2>
              <ExpenseChart transactions={transactions} />
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
};

export default App;
