import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { submitGlobalScore, fetchGlobalLeaderboard } from "../firebase";
import { useGame } from "../context/GameContext";

export default function GameOverScreen() {
  const {
    setCurrentScreen,
    tanks,
    currentLevel,
    currentBattle,
    resetGameState,
  } = useGame();

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const name = Cookies.get("tankPlayer");
    if (name) {
      const totalKills = tanks.reduce((sum, t) => sum + (t.kills || 0), 0);
      submitGlobalScore("tank_leaderboard", {
        name,
        level: currentLevel,
        battle: currentBattle,
        kills: totalKills,
        timestamp: Date.now(),
      });
    }
    fetchGlobalLeaderboard("tank_leaderboard").then(setLeaderboard);
  }, []);

  const restart = () => {
    resetGameState();
    setCurrentScreen("shop");
  };

  const signout = () => {
    Cookies.remove("tankPlayer");
    setCurrentScreen("login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-4xl text-red-500 font-bold mb-4">💀 Game Over</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={restart}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
        >
          🔁 Restart
        </button>
        <button
          onClick={signout}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
        >
          🚪 Sign Out
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded max-w-md w-full">
        <h2 className="text-xl font-bold mb-2 text-center text-yellow-300">
          🏆 Leaderboard
        </h2>
        <ul className="text-sm space-y-1">
          {leaderboard.map((entry, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {entry.name} – L{entry.level} B{entry.battle}
              </span>
              <span>🎯 {entry.kills} Kills</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

