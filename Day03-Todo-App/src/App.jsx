import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (editingId !== null) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: input } : todo
      ));
      setEditingId(null);
    } else {
      setTodos([...todos, { id: Date.now(), text: input }]);
    }

    setInput('');
  };

  const handleEdit = (id) => {
    const editTodo = todos.find(todo => todo.id === id);
    setInput(editTodo.text);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>📝 Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      {todos.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={todo.id}>
                <td>{index + 1}</td>
                <td>{todo.text}</td>
                <td>
                  <button onClick={() => handleEdit(todo.id)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
