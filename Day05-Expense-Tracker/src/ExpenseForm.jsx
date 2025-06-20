import React, { useState } from 'react';

export default function ExpenseForm({ dispatch }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || isNaN(amount)) return alert('Enter valid data');
    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
    };
    dispatch({ type: 'ADD', payload: newExpense });
    setTitle('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">➕ Add Expense</button>
    </form>
  );
}