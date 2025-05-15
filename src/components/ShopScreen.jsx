import React from "react";
import { useGame } from "../context/GameContext";

export default function ShopScreen() {
  const {
    tanks,
    gold,
    currentLevel,
    currentBattle,
    buyUpgrade,
    hasUpgrade,
    startBattle,
  } = useGame();

  function isFullyUpgraded(tank) {
    return hasUpgrade(tank, "atk") === 5 && hasUpgrade(tank, "def") === 5;
  }

  function canRepair(tank) {
    return tank.hp < 100 && gold >= 10;
  }

  function repairTank(tankId) {
    if (gold < 10) return;
    const event = new CustomEvent("repair-tank", { detail: tankId });
    window.dispatchEvent(event);
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex flex-col items-center">
      <div className="text-center max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-yellow-300 mb-1">🪖 Tank Game</h1>
        <p className="text-sm text-gray-300">
          Level {currentLevel} – Battle {currentBattle}/5
        </p>
        <p className="text-sm text-yellow-400 font-bold mt-1">💰 Gold: {gold}</p>
        <h2 className="text-xl mb-2">💰 Upgrade Shop</h2>

        {tanks.map((tank) => (
          <div key={tank.id} className="p-4 bg-gray-800 rounded-lg shadow">
            <img
              src={`/tank${tank.id}.png`}
              alt={`Tank ${tank.id}`}
              className="w-20 h-20 object-contain mx-auto mb-2"
            />
            <p className="mb-1 font-semibold">
              Tank {tank.id}{" "}
              <span className="text-yellow-400 text-sm">
                (Lvl {tank.level || 1})
              </span>
            </p>
            <p className="text-sm mb-1">
              HP: {tank.hp} | ATK: {tank.atk} | DEF: {tank.def}
            </p>
            {isFullyUpgraded(tank) && (
              <p className="text-green-400 text-sm mb-2">🧨 Missile Ready</p>
            )}
            <div className="flex justify-center gap-4 my-2">
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
                  hasUpgrade(tank, "atk") >= 5
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => buyUpgrade(tank.id, "atk")}
              >
                +5 ATK (20g)
              </button>
              <button
                disabled={hasUpgrade(tank, "def") >= 5 || gold < 20}
                className={`px-3 py-1 rounded text-sm transition ${
                  hasUpgrade(tank, "def") >= 5
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => buyUpgrade(tank.id, "def")}
              >
                +5 DEF (20g)
              </button>
              <button
                disabled={!canRepair(tank)}
                onClick={() => repairTank(tank.id)}
                className={`px-3 py-1 rounded text-sm transition ${
                  !canRepair(tank)
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                🛠 Repair (10g)
              </button>
            </div>
          </div>
        ))}

        <button
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-bold"
          onClick={startBattle}
        >
          Start Battle
        </button>
      </div>
    </div>
  );
}

