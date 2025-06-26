import { useState } from 'react';
import './App.css';
const initialBoard = Array(9).fill(null);

export default function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXTurn(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400 drop-shadow animate-fade-in">Tic Tac Toe</h1>

      <div className="grid grid-cols-3 gap-4">
        {board.map((value, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 flex items-center justify-center border-2 border-cyan-600 cursor-pointer text-5xl font-bold neon-box animate-tile"
          >
            <span
              className={`transition-transform duration-300 ease-in-out transform scale-110 ${
                value === 'X'
                  ? 'text-neon-pink drop-shadow-neon animate-pop'
                  : value === 'O'
                  ? 'text-neon-green drop-shadow-neon animate-pop'
                  : ''
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 animate-fade-in">
        {winner ? (
          <h2 className="text-2xl mb-3 animate-bounce">🎉 Winner: <span className="text-yellow-300">{winner}</span></h2>
        ) : board.every(cell => cell) ? (
          <h2 className="text-2xl mb-3 animate-bounce">🤝 It's a Draw!</h2>
        ) : (
          <h2 className="text-xl text-gray-400">Turn: <span className="text-blue-300">{isXTurn ? 'X' : 'O'}</span></h2>
        )}
        <button
          onClick={resetGame}
          className="mt-3 px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded shadow transition hover:scale-105"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(cells) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  for (let [a,b,c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}
