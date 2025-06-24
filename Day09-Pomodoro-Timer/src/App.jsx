
import { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [showSettings, setShowSettings] = useState(true);

  const timerRef = useRef(null);
  const beepRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
    setShowSettings(true);
  };

  const switchMode = () => {
    const newMode = mode === "focus" ? "break" : "focus";
    setMode(newMode);
    setTime(newMode === "focus" ? focusDuration * 60 : breakDuration * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setTimeout(() => setTime((t) => t - 1), 1000);
    } else if (isRunning && time === 0) {
      switchMode();
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, time]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-red-100 to-orange-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">🍅 Pomodoro Timer</h1>
        <p className="text-gray-500 mb-2">Mode: <span className="font-semibold">{mode.toUpperCase()}</span></p>

        {showSettings && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Focus Duration (mins)</label>
            <input
              type="number"
              min="1"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded mb-2"
              disabled={isRunning}
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (mins)</label>
            <input
              type="number"
              min="1"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
              disabled={isRunning}
            />
            <button
              onClick={() => {
                setTime(focusDuration * 60);
                setShowSettings(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 mt-2 rounded"
            >
              Set Durations
            </button>
          </div>
        )}

        <div className="text-5xl font-mono text-red-600 mb-6">{formatTime(time)}</div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={toggleTimer}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>
        </div>

        <button
          onClick={switchMode}
          className="mt-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm px-4 py-1 rounded-full transition"
        >
          Switch to {mode === "focus" ? "Break" : "Focus"} Mode
        </button>

      </div>
    </div>
  );
}
