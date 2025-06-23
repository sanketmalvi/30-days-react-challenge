import { useState } from 'react';

export default function TaskModal({ close, addTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    addTask(title, description);
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Task</h2>
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
}
