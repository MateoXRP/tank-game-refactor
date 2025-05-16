import { useGame } from "../context/GameContext";
import Cookies from "js-cookie";

export default function GameOverScreen() {
  const { resetGame, setCurrentScreen, setPlayerName } = useGame();

  const handleRestart = () => {
    resetGame();
    setCurrentScreen("shop");
  };

  const handleSignOut = () => {
    Cookies.remove("tankPlayer");
    setPlayerName("");
    setCurrentScreen("login");
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl text-red-500 font-bold mb-4">💀 Game Over</h1>
      <p className="text-lg mb-6">Both tanks have been destroyed.</p>
      <div className="flex gap-4">
        <button
          onClick={handleRestart}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-bold"
        >
          🔁 Restart
        </button>
        <button
          onClick={handleSignOut}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-bold"
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

