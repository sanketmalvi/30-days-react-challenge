import { useState } from 'react';
import './App.css';

function App() {
  const [counter, setCounter] = useState(0);

  const addValue = () => setCounter(prev => prev + 1);
  const removeValue = () => setCounter(prev => Math.max(prev - 1, 0));
  const resetValue = () => setCounter(0);

  return (
    <div className="app">
      <div className="card">
        <h1>React Counter</h1>
        <div className="counter-display">{counter}</div>
        <div className="buttons">
          <button className="btn add" onClick={addValue}>+ Add</button>
          <button
            className="btn remove"
            onClick={removeValue}
            disabled={counter === 0}
          >
            − Remove
          </button>
          <button className="btn reset" onClick={resetValue}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
