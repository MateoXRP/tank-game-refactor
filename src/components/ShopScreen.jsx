import { useGame } from "../context/GameContext";
import tankImg from "/tank1.png";

export default function ShopScreen() {
  const {
    tanks,
    setTanks,
    setCurrentScreen,
    gold,
    setGold,
    currentLevel,
    currentBattle,
  } = useGame();

  const MAX_UPGRADE = 5;

  function hasUpgrade(tank, stat) {
    return tank[stat];
  }

  function isFullyUpgraded(tank) {
    return tank.attack === MAX_UPGRADE && tank.defense === MAX_UPGRADE;
  }

  function canRepair(tank) {
    return tank.hp < tank.maxHp && gold >= 10;
  }

  function repairTank(tankId) {
    if (gold < 10) return;
    setGold(prev => prev - 10);
    setTanks(prev =>
      prev.map(t =>
        t.id === tankId ? { ...t, hp: Math.min(t.hp + 25, t.maxHp) } : t
      )
    );
  }

  function buyUpgrade(tankId, stat) {
    if (gold < 20) return;
    setGold(prev => prev - 20);
    setTanks(prev =>
      prev.map(t =>
        t.id === tankId && t[stat] < MAX_UPGRADE
          ? { ...t, [stat]: t[stat] + 1 }
          : t
      )
    );
  }

  return (
    <div className="text-center max-w-md w-full space-y-4 mx-auto p-4 text-white">
      <h2 className="text-xl mb-1 font-bold text-yellow-300">💰 Upgrade Shop</h2>
      <h2 className="text-sm text-gray-300 mb-1">
        Level {currentLevel} – Battle {currentBattle}/5
      </h2>
      <p className="text-yellow-400 text-sm font-bold mb-4">
        💰 Gold: {gold}
      </p>

      {tanks.map(tank => (
        <div key={tank.id} className="p-4 bg-gray-800 rounded-lg shadow">
          <img
            src={tankImg}
            alt={`Tank ${tank.id}`}
            className="w-20 h-20 object-contain mx-auto mb-2"
          />
          <p className="mb-1 font-semibold">
            Tank {tank.id}{" "}
            <span className="text-yellow-400 text-sm">(Lvl {tank.level || 1})</span>
          </p>
          <p className="text-sm mb-1">
            HP: {tank.hp} | ATK: {tank.attack} | DEF: {tank.defense}
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
                    i < hasUpgrade(tank, "attack") ? "bg-yellow-400" : "bg-gray-600"
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
                    i < hasUpgrade(tank, "defense") ? "bg-yellow-400" : "bg-gray-600"
                  }`}
                ></div>
              ))}
              <span className="text-xs text-green-300 ml-1">DEF</span>
            </div>
          </div>
          <div className="flex justify-center space-x-2 mt-2 flex-wrap gap-2">
            <button
              disabled={tank.attack >= 5 || gold < 20}
              className={`px-3 py-1 rounded text-sm transition ${
                tank.attack >= 5
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => buyUpgrade(tank.id, "attack")}
            >
              +5 ATK (20g)
            </button>
            <button
              disabled={tank.defense >= 5 || gold < 20}
              className={`px-3 py-1 rounded text-sm transition ${
                tank.defense >= 5
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={() => buyUpgrade(tank.id, "defense")}
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
        onClick={() => setCurrentScreen("battle")}
      >
        Start Battle
      </button>
    </div>
  );
}

