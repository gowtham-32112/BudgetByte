import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const exportToCSV = (expenses, activeCurrencyCode) => {
    if (!expenses || expenses.length === 0) return;

    const headers = ['Date', 'Category', 'Description', `Amount (${activeCurrencyCode})`];
    const rows = expenses.map(exp => [
        format(new Date(exp.date), 'yyyy-MM-dd'),
        exp.category,
        `"${exp.description || ''}"`,
        exp.amount.toFixed(2)
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BudgetByte_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = (expenses, activeCurrencyCode, totalSpent) => {
    if (!expenses || expenses.length === 0) return;

    const doc = new jsPDF();
    const currentDate = format(new Date(), 'MMM dd, yyyy');

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('BudgetByte Expense Report', 14, 22);

    // Meta
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate}`, 14, 32);
    doc.text(`Total Spent: ${totalSpent.toFixed(2)} ${activeCurrencyCode}`, 14, 40);

    // Table Data
    const tableData = expenses.map(exp => [
        format(new Date(exp.date), 'MMM dd, yyyy'),
        exp.category,
        exp.description || '-',
        `${exp.amount.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: 50,
        head: [['Date', 'Category', 'Description', `Amount (${activeCurrencyCode})`]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] }, // Indigo-500
        styles: { fontSize: 10, cellPadding: 5 },
        alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    doc.save(`BudgetByte_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
