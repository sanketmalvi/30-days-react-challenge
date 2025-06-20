import React, { useReducer, useEffect } from 'react';
import './App.css';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const getInitialState = () => {
  const stored = localStorage.getItem('expenses');
  return stored ? JSON.parse(stored) : [];
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, [], getInitialState);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state));
  }, [state]);

  const total = state.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="app">
      <h1>💸 Expense Tracker</h1>
      <ExpenseForm dispatch={dispatch} />
      <h2>Total Spent: ₹{total.toFixed(2)}</h2>
      <ExpenseList expenses={state} dispatch={dispatch} />
    </div>
  );
}