import React, { useState, useEffect } from 'react';
import { EditIcon, CheckIcon } from './Icons';
import { useCurrency } from '../contexts/CurrencyContext';

interface BudgetProps {
  budget: number;
  onSetBudget: (amount: number) => void;
  monthlyExpense: number;
}

const Budget: React.FC<BudgetProps> = ({ budget, onSetBudget, monthlyExpense }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(budget.toString());
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        if (!isEditing) {
            setAmount(budget.toString());
        }
    }, [budget, isEditing]);
    
    const handleSave = () => {
        const parsedAmount = parseFloat(amount);
        if(!isNaN(parsedAmount) && parsedAmount >= 0) {
            onSetBudget(parsedAmount);
            setIsEditing(false);
        } else {
            alert('Please enter a valid non-negative number');
        }
    };

    const spentPercentage = budget > 0 ? Math.min((monthlyExpense / budget) * 100, 100) : 0;
    const isOverBudget = monthlyExpense > budget;

    const getProgressBarColor = () => {
        if (isOverBudget) return 'bg-red-500';
        if (spentPercentage > 80) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider">Monthly Budget</h2>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className="w-40 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                autoFocus
                                placeholder="Set monthly budget"
                            />
                            <button onClick={handleSave} className="p-1 text-emerald-500 hover:text-emerald-300 transition-all duration-300 hover:drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" aria-label="Save monthly budget">
                                <CheckIcon />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <p className="text-3xl font-bold text-neutral-100">{formatCurrency(budget)}</p>
                            <button onClick={() => setIsEditing(true)} className="p-1 text-neutral-400 hover:text-indigo-300 transition-all duration-300 hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" aria-label="Edit monthly budget">
                                <EditIcon />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <div className="w-full bg-neutral-700 rounded-full h-2.5 mb-2">
                    <div className={`${getProgressBarColor()} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${spentPercentage}%` }}></div>
                </div>
                <div className="text-sm text-right">
                    <span className={isOverBudget ? 'text-red-500 font-bold' : 'text-neutral-400'}>
                        {formatCurrency(monthlyExpense)}
                    </span>
                    <span className="text-neutral-500"> / {formatCurrency(budget)}</span>
                </div>
                {isOverBudget && <p className="text-xs text-red-500 text-right mt-1">You are over budget!</p>}
            </div>
        </div>
    );
};

export default Budget;