import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { CalendarIcon } from './Icons';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactionType: TransactionType;
}

const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Other"];
const expenseCategories = ["Food", "Transport", "Housing", "Bills", "Entertainment", "Health", "Shopping", "Education", "Other"];

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, transactionType }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { getCurrencySymbol } = useCurrency();

  // Reset category when switching between income and expense
  useEffect(() => {
    setCategory('');
  }, [transactionType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
        alert('Please fill all fields');
        return;
    }
    const parsedAmount = parseFloat(amount);
    if(isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Please enter a valid positive amount');
        return;
    }

    onAddTransaction({
      description,
      amount: parsedAmount,
      type: transactionType,
      category,
      date
    });

    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const isIncome = transactionType === TransactionType.Income;
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-400">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isIncome ? "e.g., Salary" : "e.g., Coffee"}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-neutral-400">Amount</label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-neutral-400 sm:text-sm">{getCurrencySymbol()}</span>
            </div>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="block w-full rounded-md border border-neutral-600 bg-neutral-700 py-2 pl-7 pr-3 shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-neutral-200"
            />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-400">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>Select a category</option>
            {(isIncome ? incomeCategories : expenseCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-400">Date</label>
          <div className="relative mt-1">
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClasses + " pr-10"}
            />
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CalendarIcon className="h-5 w-5 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
            isIncome 
            ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 hover:shadow-lg hover:shadow-emerald-500/40' 
            : 'bg-red-500 hover:bg-red-600 focus:ring-red-500 hover:shadow-lg hover:shadow-red-500/40'
        }`}
      >
        {isIncome ? 'Add Income' : 'Add Expense'}
      </button>
    </form>
  );
};

export default TransactionForm;