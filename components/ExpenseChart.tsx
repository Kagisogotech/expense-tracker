import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    const { formatCurrency } = useCurrency();
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-lg shadow-sm text-neutral-200">
                <p className="font-semibold">{`${payload[0].name} : ${formatCurrency(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expenseData = new Map<string, number>();

    transactions
      .filter((t) => t.type === TransactionType.Expense)
      .forEach((t) => {
        const currentAmount = expenseData.get(t.category) || 0;
        expenseData.set(t.category, currentAmount + t.amount);
      });

    return Array.from(expenseData.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (chartData.length === 0) {
    return <p className="text-neutral-400 text-center py-10">No expense data to display.</p>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-neutral-300">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;