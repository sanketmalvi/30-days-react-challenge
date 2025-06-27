import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { quizReducer, initialState } from './quizReducer';

const API_BASE = 'https://opentdb.com/api.php?amount=5&category=';
const CATEGORY_API = 'https://opentdb.com/api_category.php';

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function QuizApp() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    axios.get(CATEGORY_API).then(res => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  useEffect(() => {
    if (!state.questions.length || state.showResult) return;
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.timer, state.questions, state.showResult]);

  const startQuiz = () => {
    axios.get(`${API_BASE}${selectedCat}&difficulty=${difficulty}&type=multiple`).then(res => {
      const questions = res.data.results.map(q => ({
        ...q,
        options: shuffle([...q.incorrect_answers, q.correct_answer])
      }));
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    });
  };

  if (!state.questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-lg">🧠 Quiz App</h1>
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm mb-1 text-cyan-300">Choose Category:</label>
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded focus:outline-none"
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-cyan-300">Choose Difficulty:</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full bg-gray-100 text-black px-4 py-2 rounded focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={startQuiz}
            disabled={!selectedCat}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-all"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }


  if (state.showResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl text-center mb-4 text-green-400">🏁 Quiz Complete!</h1>
        <p className="text-center text-xl mb-6">Score: {state.score} / {state.questions.length}</p>

        <div className="max-w-3xl mx-auto space-y-6">
          {state.questions.map((q, idx) => (
            <div key={idx} className="bg-zinc-800 p-4 rounded shadow">
              <h2 className="mb-2 font-semibold" dangerouslySetInnerHTML={{ __html: q.question }}></h2>
              <ul className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.correct_answer;
                  const isSelected = opt === state.userAnswers[idx]?.selected;
                  return (
                    <li
                      key={i}
                      className={`px-3 py-2 rounded ${isCorrect ? 'bg-green-600' : isSelected ? 'bg-red-600' : 'bg-gray-700'} text-white`}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    ></li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={() => dispatch({ type: 'SET_QUESTIONS', payload: [] })} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Restart Quiz</button>
        </div>
      </div>
    );
  }

  const current = state.questions[state.index];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Question {state.index + 1} / {state.questions.length}</h2>
          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full">⏱️ {state.timer}s</span>
        </div>
        <h3 className="text-xl mb-4 font-semibold" dangerouslySetInnerHTML={{ __html: current.question }}></h3>
        <div className="grid gap-3">
          {current.options.map(option => (
            <button
              key={option}
              dangerouslySetInnerHTML={{ __html: option }}
              onClick={() => dispatch({ type: 'SELECT_OPTION', payload: option })}
              className={`px-4 py-2 rounded border transition-all duration-200 ${state.selected === option ? 'bg-green-600' : 'bg-gray-700'} hover:bg-cyan-700`}
              disabled={!!state.selected}
            />
          ))}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={() => dispatch({ type: 'NEXT' })}
            disabled={!state.selected}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            {state.index + 1 === state.questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
