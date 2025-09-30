import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import TransactionForm from './TransactionForm';

interface TransactionTabsProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({ onAddTransaction }) => {
    const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.Expense);

    const getTabStyle = (isActive: boolean) => {
        return isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'bg-transparent text-neutral-400 hover:text-indigo-300 hover:bg-neutral-700/50 hover:shadow-md hover:shadow-indigo-500/20';
    };

    return (
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl">
            <div className="p-2 bg-neutral-900/50 rounded-t-2xl flex gap-2">
                <button
                    onClick={() => setActiveTab(TransactionType.Expense)}
                    className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${getTabStyle(activeTab === TransactionType.Expense)}`}
                    aria-pressed={activeTab === TransactionType.Expense}
                >
                    Add Expense
                </button>
                <button
                    onClick={() => setActiveTab(TransactionType.Income)}
                    className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${getTabStyle(activeTab === TransactionType.Income)}`}
                    aria-pressed={activeTab === TransactionType.Income}
                >
                    Add Income
                </button>
            </div>
            <div className="p-6">
                <TransactionForm
                    onAddTransaction={onAddTransaction}
                    transactionType={activeTab}
                />
            </div>
        </div>
    );
};

export default TransactionTabs;