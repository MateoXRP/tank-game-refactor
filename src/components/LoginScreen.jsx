import { useState } from "react";
import { useGame } from "../context/GameContext";
import Cookies from "js-cookie";

export default function LoginScreen() {
  const { setPlayerName, setCurrentScreen } = useGame();
  const [input, setInput] = useState("");

  const handleStart = () => {
    if (input.trim() !== "") {
      Cookies.set("tankPlayer", input);
      setPlayerName(input);
      setCurrentScreen("shop");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">🪖 Tank Game</h1>
      <input
        className="p-2 text-black rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleStart} className="mt-4 px-4 py-2 bg-green-600 rounded">
        Start
      </button>
    </div>
  );
}

