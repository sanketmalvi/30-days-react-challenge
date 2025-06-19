import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (height && weight) {
      if (height <= 0 || weight <= 0) {
        setError('Height and weight must be positive numbers');
        setBMI(null);
        setCategory('');
      } else {
        const h = height / 100; // convert cm to meters
        const bmiValue = (weight / (h * h)).toFixed(2);
        setBMI(bmiValue);
        setError('');
        if (bmiValue < 18.5) setCategory('Underweight');
        else if (bmiValue < 24.9) setCategory('Normal');
        else setCategory('Overweight');
      }
    } else {
      setBMI(null);
      setCategory('');
      setError('');
    }
  }, [height, weight]);

  const getTips = () => {
    if (category === 'Underweight') return 'You might need to eat more nutritious food!';
    if (category === 'Normal') return 'Great job! Keep maintaining your health.';
    if (category === 'Overweight') return 'Consider a balanced diet and regular exercise.';
    return '';
  };

  return (
    <div className="app">
      <h1>BMI Calculator</h1>
      <div className="input-group">
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {bmi && (
        <div className={`result-card ${category.toLowerCase()}`}>
          <h2>Your BMI: {bmi}</h2>
          <p>Category: {category}</p>
          <p className="tip">{getTips()}</p>
        </div>
      )}
    </div>
  );
}

export default App;
