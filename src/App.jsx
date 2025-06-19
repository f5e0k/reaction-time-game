import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const getRandomDelay = (min = 2000, max = 5000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleStart = () => {
    setGameState("waiting");
    setMessage("Wait for green...");
    const delay = getRandomDelay();
    const id = setTimeout(() => {
      setGameState("go");
      setMessage("CLICK!");
      setStartTime(Date.now());
    }, delay);
    setTimeoutId(id);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timeoutId);
      setGameState("start");
      setMessage("Too Soon!");
      setReactionTime(null);
    } else if (gameState === "go") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setHistory((prev) => [time, ...prev.slice(0, 4)]);
      setGameState("start");
      setMessage(`Your time: ${time} ms`);
    }
  };

  const bestTime = history.length ? Math.min(...history) : null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        gameState === "go"
          ? "bg-green-400"
          : gameState === "waiting"
          ? "bg-gray-300"
          : "bg-white"
      }`}
      onClick={gameState !== "start" ? handleClick : null}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8"
      >
        <h1 className="text-4xl font-bold mb-6">Reaction Time Game</h1>
        {gameState === "start" && (
          <button
            onClick={handleStart}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            Start Game
          </button>
        )}
        <p className="text-xl mt-6">{message}</p>
        {reactionTime !== null && (
          <p className="text-2xl mt-4 font-mono">{reactionTime} ms</p>
        )}
        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Previous Times</h2>
            <ul className="mt-2 space-y-1">
              {history.map((time, index) => (
                <li
                  key={index}
                  className={`text-md ${
                    time === bestTime
                      ? "text-green-700 font-bold"
                      : "text-gray-800"
                  }`}
                >
                  {index + 1}. {time} ms
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
