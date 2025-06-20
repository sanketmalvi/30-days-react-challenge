import React from 'react';

export default function ExpenseList({ expenses, dispatch }) {
  if (expenses.length === 0) return <p className="empty">No expenses added yet.</p>;

  return (
    <ul className="list">
      {expenses.map((expense) => (
        <li key={expense.id} className="item">
          <span>{expense.title} — ₹{expense.amount.toFixed(2)}</span>
          <button onClick={() => dispatch({ type: 'DELETE', payload: expense.id })}>🗑</button>
        </li>
      ))}
    </ul>
  );
}
