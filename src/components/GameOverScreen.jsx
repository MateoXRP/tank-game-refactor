import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGame } from "../context/GameContext";
import { submitGlobalScore, fetchGlobalLeaderboard } from "../firebase";

export default function GameOverScreen() {
  const {
    playerName,
    currentLevel,
    currentBattle,
    setCurrentScreen,
    tanks,
  } = useGame();

  const [leaderboard, setLeaderboard] = useState([]);
  const totalKills = tanks.reduce((sum, t) => sum + (t.kills || 0), 0); // FIXED

  const handleRestart = () => {
    window.location.reload(); // clears state, refreshes game
  };

  const handleSignOut = () => {
    Cookies.remove("tankPlayer");
    window.location.reload(); // clears state and cookies, goes back to login
  };

  useEffect(() => {
    async function updateLeaderboard() {
      await submitGlobalScore("tank_leaderboard", {
        name: playerName,
        level: currentLevel,
        battle: currentBattle,
        kills: totalKills,
      });

      const data = await fetchGlobalLeaderboard("tank_leaderboard");
      setLeaderboard(data);
    }

    updateLeaderboard();
  }, [playerName, currentLevel, currentBattle, tanks, totalKills]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-3xl text-red-500 font-bold mb-4">💀 Game Over</h1>
      <p className="mb-2 text-center">
        {playerName}, you made it to <br />
        <span className="font-bold text-yellow-300">
          Level {currentLevel}, Battle {currentBattle}
        </span>{" "}
        with <span className="text-green-400 font-bold">{totalKills}</span> kills.
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleRestart}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold"
        >
          🔁 Restart
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 font-semibold"
        >
          🚪 Sign Out
        </button>
      </div>

      <h2 className="text-xl mt-8 mb-2">🏆 Leaderboard</h2>
      <ul className="text-sm w-full max-w-xs space-y-1">
        {leaderboard.map((entry, index) => (
          <li
            key={index}
            className="bg-gray-800 rounded px-3 py-1 flex justify-between items-center"
          >
            <span className="font-bold">
              {index + 1}. {entry.name}
            </span>
            <span className="text-right text-yellow-300">
              L{entry.level}-B{entry.battle} | 🪖 {entry.kills}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

