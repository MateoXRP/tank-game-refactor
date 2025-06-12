// components/ShopScreen.jsx
import React from "react";
import { useGame } from "../context/GameContext";

export default function ShopScreen() {
  const {
    tanks,
    gold,
    buyUpgrade,
    hasUpgrade,
    currentLevel,
    currentBattle,
    setCurrentScreen,
    repairTank,
    playerName,
  } = useGame();

  const startBattle = () => {
    setCurrentScreen("battle");
  };

  const isFullyUpgraded = (tank) =>
    hasUpgrade(tank, "atk") === 5 && hasUpgrade(tank, "def") === 5;

  const canRepair = (tank) =>
    tank.hp < tank.maxHp && gold >= 10;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-base shadow-md border-b border-gray-800">
        <div className="text-white font-bold">
          🪖 Tank Game — 🛒Shop L{currentLevel}B{currentBattle}
        </div>
        <div className="text-gray-300 font-medium">
          {playerName} | 💰 {gold}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-6">
        <div className="flex flex-col gap-6 w-full items-center">
          {tanks.map((tank) => (
            <div key={tank.id} className="w-full max-w-sm p-4 bg-gray-800 rounded-lg shadow flex flex-col items-center">
              <img
                src={`/tank${tank.id}.png`}
                alt={`Tank ${tank.id}`}
                className="w-20 h-20 object-contain mb-3"
              />
              <p className="font-semibold text-white mb-1">
                Tank {tank.id}{" "}
                <span className="text-yellow-400 text-sm">
                  (Lvl {tank.level || 1})
                </span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                HP: {tank.hp} | ATK: {tank.atk} | DEF: {tank.def}
              </p>

              {isFullyUpgraded(tank) && (
                <p className="text-green-400 text-sm mb-2">🧨 Missile Ready</p>
              )}

              <div className="flex justify-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        i < hasUpgrade(tank, "atk")
                          ? "bg-yellow-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  ))}
                  <span className="text-xs text-blue-300 ml-1">ATK</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        i < hasUpgrade(tank, "def")
                          ? "bg-yellow-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  ))}
                  <span className="text-xs text-green-300 ml-1">DEF</span>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-2 flex-wrap gap-2">
                <button
                  disabled={hasUpgrade(tank, "atk") >= 5 || gold < 20}
                  className={`px-3 py-1 rounded text-sm transition ${
                    hasUpgrade(tank, "atk") >= 5 || gold < 20
                      ? "opacity-50 cursor-not-allowed bg-gray-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => buyUpgrade(tank.id, "atk")}
                >
                  +5 ATK (20💰)
                </button>
                <button
                  disabled={hasUpgrade(tank, "def") >= 5 || gold < 20}
                  className={`px-3 py-1 rounded text-sm transition ${
                    hasUpgrade(tank, "def") >= 5 || gold < 20
                      ? "opacity-50 cursor-not-allowed bg-gray-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => buyUpgrade(tank.id, "def")}
                >
                  +5 DEF (20💰)
                </button>
                <button
                  disabled={!canRepair(tank)}
                  onClick={() => repairTank(tank.id)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    !canRepair(tank)
                      ? "opacity-50 cursor-not-allowed bg-gray-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  🛠 Repair (10💰)
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-10 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded font-bold text-black"
          onClick={startBattle}
        >
          🚀 Start Battle
        </button>
      </div>
    </div>
  );
}
