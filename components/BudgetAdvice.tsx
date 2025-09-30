import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useCurrency } from '../contexts/CurrencyContext';
import { LightbulbIcon, RefreshIcon } from './Icons';

interface BudgetAdviceProps {
  budget: number;
  monthlyExpense: number;
  balance: number;
}

const BudgetAdvice: React.FC<BudgetAdviceProps> = ({ budget, monthlyExpense, balance }) => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { formatCurrency } = useCurrency();

  const getAdvice = useCallback(async () => {
    setLoading(true);
    setError('');
    setAdvice('');
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set up your API key to receive financial advice.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `My current financial situation is as follows:
- Monthly Budget: ${formatCurrency(budget)}
- Spent This Month: ${formatCurrency(monthlyExpense)}
- Current Account Balance: ${formatCurrency(balance)}

${balance < 0 ? "My account balance is negative." : ""}
${monthlyExpense > budget ? "I have overspent my budget this month." : ""}

Please provide some friendly, practical, and actionable advice on how to stick to my budget and improve my financial situation. Provide a few short, concise tips in a bulleted list format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAdvice(response.text);
    } catch (err: any) {
      console.error('Error fetching advice:', err);
      setError(err.message || 'Sorry, I couldn\'t fetch financial advice right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [budget, monthlyExpense, balance, formatCurrency]);
  
  useEffect(() => {
    getAdvice();
  }, [getAdvice]);

  const renderAdvice = () => {
    if (!advice) return null;
    return (
      <ul className="space-y-2 list-disc list-inside text-neutral-300">
        {advice.split('\n').map((line, index) => {
          const cleanedLine = line.trim().replace(/^[\*\-]\s*/, '');
          if (!cleanedLine) return null;
          return <li key={index}>{cleanedLine}</li>;
        })}
      </ul>
    );
  };
  
  return (
    <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-700/50 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <LightbulbIcon className="h-6 w-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-yellow-300">Financial Tip</h2>
        </div>
        <button onClick={getAdvice} disabled={loading} className="p-1 text-yellow-400 hover:text-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" aria-label="Get new advice">
            <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {loading && <p className="text-yellow-400">Thinking of some advice for you...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && advice && renderAdvice()}
    </div>
  );
};

export default BudgetAdvice;