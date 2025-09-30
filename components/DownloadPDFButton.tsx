import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, TransactionType } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { DownloadIcon } from './Icons';

interface DownloadPDFButtonProps {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
  initialBalance: number;
  budget: number;
  monthlyExpense: number;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  transactions,
  balance,
  totalIncome,
  totalExpense,
  initialBalance,
  budget,
  monthlyExpense,
}) => {
  const { formatCurrency } = useCurrency();

  const generatePdf = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.text('Financial Summary', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary Section
    autoTable(doc, {
      startY: 40,
      body: [
        ['Starting Balance', formatCurrency(initialBalance)],
        ['Total Income', formatCurrency(totalIncome)],
        ['Total Expense', formatCurrency(totalExpense)],
        ['Final Balance', formatCurrency(balance)],
        ['Monthly Budget', formatCurrency(budget)],
        ['Spent This Month', formatCurrency(monthlyExpense)],
      ],
      theme: 'striped',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185] },
      bodyStyles: {
        cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      },
      didParseCell: function (data) {
        if (data.row.index === 1 && data.section === 'body') data.cell.styles.textColor = [46, 204, 113]; // Income green
        if (data.row.index === 2 && data.section === 'body') data.cell.styles.textColor = [231, 76, 60]; // Expense red
        if (data.row.index === 3 && data.section === 'body') data.cell.styles.textColor = balance < 0 ? [231, 76, 60] : [0, 0, 0]; // Balance
        if (data.row.index === 5 && data.section === 'body') data.cell.styles.textColor = monthlyExpense > budget ? [231, 76, 60] : [0, 0, 0]; // Monthly expense
      },
    });

    // Transactions Table
    const tableHead = [['Date', 'Description', 'Category', 'Type', 'Amount']];
    const tableBody = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      `${t.type === TransactionType.Income ? '+' : '-'}${formatCurrency(t.amount)}`,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41] }, // Dark grey for header
      didParseCell: function (data) {
        if (data.column.index === 4 && data.section === 'body') {
          // Amount column
          if (data.cell.raw && (data.cell.raw as string).startsWith('+')) {
            data.cell.styles.textColor = [46, 204, 113]; // Green
          } else {
            data.cell.styles.textColor = [231, 76, 60]; // Red
          }
        }
      },
    });

    doc.save(`financial_summary_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button
      onClick={generatePdf}
      className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-500"
      aria-label="Download financial summary as PDF"
    >
      <DownloadIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Download PDF</span>
    </button>
  );
};

export default DownloadPDFButton;