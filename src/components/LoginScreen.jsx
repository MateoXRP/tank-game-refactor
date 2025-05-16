import { useState } from "react";
import Cookies from "js-cookie";
import { useGame } from "../context/GameContext";

export default function LoginScreen() {
  const { setPlayerName, setCurrentScreen } = useGame();
  const [nameInput, setNameInput] = useState("");

  const handleLogin = () => {
    if (nameInput.trim()) {
      Cookies.set("tankPlayer", nameInput.trim(), { expires: 7 });
      setPlayerName(nameInput.trim());
      setCurrentScreen("shop");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-yellow-300 mb-6">🪖 Tank Game</h1>
      <p className="mb-4 text-gray-300">Enter your name to begin:</p>
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        className="px-4 py-2 rounded text-black mb-4"
        placeholder="Your name"
      />
      <button
        onClick={handleLogin}
        className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded font-bold"
      >
        🚀 Play
      </button>
    </div>
  );
}

