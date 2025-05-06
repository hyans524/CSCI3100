import React, { useState, useEffect } from 'react';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  
  // Filter expenses for this group
  const filteredExpenses = expenses ? expenses.filter(expense => 
    String(expense.group_id._id) === String(groupId)) : [];
  
  const calculateTotalExpenses = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) return 0;
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateExpensePerPerson = () => {
    if (!members || members.length === 0) return 0;
    return calculateTotalExpenses() / members.length;
  };

  const getExpensesByCategory = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) return {};
    const categories = {};
    filteredExpenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    return categories;
  };

  const getExpensePayer = (userObj) => {
    if (!userObj || !members) return "Unknown";
    
    const userId = userObj._id;
    
    // Find matching member in the members array
    const member = members.find(m => m._id === userId);
    
    if (member) {
      return member.username;
    }
    return userObj.username || (userObj.user_id ? `User ${userObj.user_id}` : "Member");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      const intValue = parseInt(value, 10);
      setNewExpense({
        ...newExpense,
        [name]: isNaN(intValue) ? '' : intValue
      });

    } else {
      setNewExpense({
        ...newExpense,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || submitting) return;

    try {
      setSubmitting(true);
      
      // Mock user ID for testing
      const mockUserId = "67fba7d7cc439d8b22e006c9";
      
      // Create the expense data with the mock user ID
      const expenseData = {
        ...newExpense,
        group_id: groupId,
        paid_by: mockUserId
      };
      
      console.log('Sending expense data:', expenseData);
      
      const response = await expenseApi.create(expenseData);
      
      console.log('Server response:', response);
      
      // Reset form
      setNewExpense({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddingExpense(false);
      
      alert('Expense added successfully!');
      

      window.location.reload();

    } catch (error) {
      console.error('Failed to add expense:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      alert('Failed to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize delete confirmation
  const initiateDelete = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  // Handle expense deletion with confirmation
  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    
    try {
      await expenseApi.delete(expenseToDelete._id);
      console.log('Expense deleted successfully');
      
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
      window.location.reload();

    } catch (error) {
      console.error('Failed to delete expense:', error);
      
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
      setError('Failed to delete expense. Please try again.');
    }
  };

  const expenseCategories = getExpensesByCategory();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the expense "{expenseToDelete?.description}" for {formatCurrency(expenseToDelete?.amount)}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setExpenseToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteExpense}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                  step="1"
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
        {(!filteredExpenses || filteredExpenses.length === 0) ? (
          <div className="text-center py-4 text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          filteredExpenses.map((expense, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    Paid by: {getExpensePayer(expense.paid_by)} • {formatDate(expense.date)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-right mr-3">
                    <div className="font-semibold">{formatCurrency(expense.amount)}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 inline-block mt-1">
                      {expense.category}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => initiateDelete(expense)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete expense"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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