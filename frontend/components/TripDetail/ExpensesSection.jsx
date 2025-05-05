import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../src/utils/formatters';
import { expenseApi } from '../../src/utils/api';

const ExpensesSection = ({ expenses, members, groupId }) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const calculateTotalExpenses = () => {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateExpensePerPerson = () => {
    if (!members || members.length === 0) return 0;
    return calculateTotalExpenses() / members.length;
  };

  const getExpensesByCategory = () => {
    if (!expenses || expenses.length === 0) return {};
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    return categories;
  };

  const getExpensePayer = (userId) => {
    if (!members) return "Unknown";
    const member = members.find(m => m._id === userId);
    return member?.name || "Unknown";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || submitting) return;

    try {
      setSubmitting(true);
      await expenseApi.create({
        ...newExpense,
        group_id: groupId
      });
      
      // Reset form
      setNewExpense({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddingExpense(false);
      
      // In a real app, you'd refresh the expenses list here
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const expenseCategories = getExpensesByCategory();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-blue-700">Expenses</h2>
        <button 
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center"
          onClick={() => setIsAddingExpense(!isAddingExpense)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isAddingExpense ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            )}
          </svg>
          {isAddingExpense ? 'Cancel' : 'Add Expense'}
        </button>
      </div>
      
      {isAddingExpense && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-3">Add New Expense</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select
                  name="category"
                  value={newExpense.category}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Recreation">Recreation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded ${
                  submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700">TOTAL EXPENSES</div>
            <div className="text-xl font-bold text-blue-800">{formatCurrency(calculateTotalExpenses())}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-700">PER PERSON</div>
            <div className="text-xl font-bold text-green-800">{formatCurrency(calculateExpensePerPerson())}</div>
          </div>
        </div>
        
        {Object.keys(expenseCategories).length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">EXPENSES BY CATEGORY</div>
            <div className="space-y-2">
              {Object.entries(expenseCategories).map(([category, amount], index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      category === 'Food' ? 'bg-red-500' :
                      category === 'Transport' ? 'bg-blue-500' :
                      category === 'Accommodation' ? 'bg-green-500' :
                      category === 'Recreation' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></span>
                    <span>{category}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {(!expenses || expenses.length === 0) ? (
          <div className="text-center py-4 text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          expenses.map((expense, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    Paid by: {getExpensePayer(expense.paid_by)} • {formatDate(expense.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(expense.amount)}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100 inline-block mt-1">
                    {expense.category}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensesSection;