import React, { useState, useEffect } from 'react';
import { EditIcon, CheckIcon } from './Icons';
import { useCurrency } from '../contexts/CurrencyContext';

interface InitialBalanceProps {
  initialBalance: number;
  onSetInitialBalance: (amount: number) => void;
}

const InitialBalance: React.FC<InitialBalanceProps> = ({ initialBalance, onSetInitialBalance }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(initialBalance.toString());
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        if (!isEditing) {
            setAmount(initialBalance.toString());
        }
    }, [initialBalance, isEditing]);
    
    const handleSave = () => {
        const parsedAmount = parseFloat(amount);
        if(!isNaN(parsedAmount)) {
            onSetInitialBalance(parsedAmount);
            setIsEditing(false);
        } else {
            alert('Please enter a valid number');
        }
    };

    return (
        <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider">Starting Balance</h2>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="w-40 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            autoFocus
                            placeholder="Set starting balance"
                        />
                        <button onClick={handleSave} className="p-1 text-emerald-500 hover:text-emerald-300 transition-all duration-300 hover:drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" aria-label="Save starting balance">
                            <CheckIcon />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-neutral-100">{formatCurrency(initialBalance)}</p>
                        <button onClick={() => setIsEditing(true)} className="p-1 text-neutral-400 hover:text-indigo-300 transition-all duration-300 hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" aria-label="Edit starting balance">
                            <EditIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InitialBalance;