import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGame } from "../context/GameContext";
import { db, submitGlobalScore, fetchGlobalLeaderboard } from "../firebase";

export default function GameOverScreen() {
  const {
    playerName,
    resetGame,
    setCurrentScreen,
    setPlayerName,
    currentLevel,
    currentBattle,
    tanks,
  } = useGame();

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const totalKills = tanks.reduce((sum, t) => sum + (t.kills || 0), 0);
    submitGlobalScore("tank_leaderboard", {
      name: playerName,
      level: currentLevel,
      battle: currentBattle,
      kills: totalKills,
      timestamp: Date.now(),
    });
    fetchGlobalLeaderboard("tank_leaderboard", 10).then(setLeaderboard);
  }, []);

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

      <div className="flex gap-4 mb-6">
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

      <div className="max-w-md w-full">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">🏆 Leaderboard</h2>
        <div className="bg-gray-800 p-4 rounded text-sm text-left space-y-1">
          {leaderboard.map((entry, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {i + 1}. {entry.name}
              </span>
              <span>
                L{entry.level}-{entry.battle} | {entry.kills} kills
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

