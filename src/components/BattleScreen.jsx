import { useState } from "react";
import { flushSync } from "react-dom";
import { useGame } from "../context/GameContext";
import useWeapons from "../hooks/useWeapons";
import tankImg from "/tank1.png";
import enemyImg from "/enemy.png";

export default function BattleScreen() {
  const { tanks, setTanks, currentLevel, currentBattle, gold } = useGame();

  const [selectedEnemyId, setSelectedEnemyId] = useState(null);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [enemyState, setEnemyState] = useState([
    { id: 1, name: "Enemy 1", hp: 60, maxHp: 60 },
    { id: 2, name: "Enemy 2", hp: 80, maxHp: 80 },
  ]);
  const [log, setLog] = useState([]);
  const [firingTankId, setFiringTankId] = useState(null);
  const [damagedEnemyId, setDamagedEnemyId] = useState(null);
  const [damagedPlayerId, setDamagedPlayerId] = useState(null);
  const [currentTankIndex, setCurrentTankIndex] = useState(0);
  const [enemyTurnActive, setEnemyTurnActive] = useState(false);

  const {
    isWeaponAvailable,
    markWeaponUsed,
    advanceCooldownFor,
    resetWeapons,
  } = useWeapons();

  const currentTank = tanks[currentTankIndex];
  const currentTurn = `Tank ${currentTank.id}`;

  const getDamage = (weapon) => {
    switch (weapon) {
      case "machinegun": return 5;
      case "cannon": return 10;
      case "missile": return 20;
      case "airstrike": return 15;
      default: return 0;
    }
  };

  const handleFire = () => {
    if (!selectedWeapon) return;

    // ✅ Cooldowns tick at start of tank's turn
    advanceCooldownFor(currentTank.id);

    markWeaponUsed(currentTank.id, selectedWeapon);

    const damage = getDamage(selectedWeapon);

    if (selectedWeapon === "airstrike") {
      enemyState.forEach((enemy) => {
        setTimeout(() => {
          setFiringTankId(currentTank.id);
          setDamagedEnemyId(enemy.id);
          setEnemyState((prev) =>
            prev.map((e) =>
              e.id === enemy.id
                ? { ...e, hp: Math.max(e.hp - damage, 0) }
                : e
            )
          );
          setLog((prev) => [
            `💥 ${currentTurn} used Airstrike on ${enemy.name} for ${damage} damage.`,
            ...prev,
          ]);
        }, 300);
      });
    } else {
      if (!selectedEnemyId) return;
      const target = enemyState.find((e) => e.id === selectedEnemyId);

      setFiringTankId(currentTank.id);

      setTimeout(() => {
        setDamagedEnemyId(selectedEnemyId);
        setEnemyState((prev) =>
          prev.map((e) =>
            e.id === selectedEnemyId
              ? { ...e, hp: Math.max(e.hp - damage, 0) }
              : e
          )
        );
        setLog((prev) => [
          `💥 ${currentTurn} hit ${target.name} with ${selectedWeapon} for ${damage} damage.`,
          ...prev,
        ]);
      }, 400);
    }

    setTimeout(() => {
      setFiringTankId(null);
      setDamagedEnemyId(null);
      setSelectedWeapon(null);
      setSelectedEnemyId(null);

      if (currentTankIndex === 1) {
        doEnemyTurn();
        setCurrentTankIndex(0);
      } else {
        setCurrentTankIndex((prev) => (prev + 1) % tanks.length);
      }
    }, 1000);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const doEnemyTurn = async () => {
    setEnemyTurnActive(true);
    const liveEnemies = enemyState.filter((e) => e.hp > 0);

    for (const enemy of liveEnemies) {
      const target = chooseTargetTank();
      const base = 5 + currentLevel;
      const damage = Math.floor(Math.random() * 5 + base);

      flushSync(() => {
        setFiringTankId(null);
        setDamagedPlayerId(null);
      });

      flushSync(() => setFiringTankId(enemy.id + 100));
      await sleep(300);

      flushSync(() => setDamagedPlayerId(target.id));
      setTanks((prev) =>
        prev.map((t) =>
          t.id === target.id
            ? { ...t, hp: Math.max(t.hp - damage, 0) }
            : t
        )
      );
      setLog((prev) => [
        `💣 ${enemy.name} hit Tank ${target.id} for ${damage} damage.`,
        ...prev,
      ]);

      await sleep(500);

      setFiringTankId(null);
      setDamagedPlayerId(null);
      await sleep(300);
    }

    setEnemyTurnActive(false);
  };

  const chooseTargetTank = () => {
    const liveTanks = tanks.filter((t) => t.hp > 0);
    if (liveTanks.length === 1) return liveTanks[0];

    const [a, b] = liveTanks;
    if (a.defense !== b.defense) {
      return a.defense < b.defense ? a : b;
    } else if (a.hp !== b.hp) {
      return a.hp < b.hp ? a : b;
    } else {
      return a.id === 1 ? a : b;
    }
  };

  const weaponList = [
    {
      label: "Machine Gun",
      key: "machinegun",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Cannon",
      key: "cannon",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      label: "Missile",
      key: "missile",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "Airstrike",
      key: "airstrike",
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-yellow-300 mb-1">🪖 Tank Game</h1>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-300">
          Level {currentLevel} – Battle {currentBattle}/5
        </p>
        <p className="text-sm text-yellow-400 font-bold mt-1">💰 Gold: {gold}</p>
      </div>

      {/* Tank Layout */}
      <div className="flex justify-center items-center gap-28 max-w-[600px] mt-4">
        <div className="flex flex-col items-center gap-3">
          {tanks.map((tank) => (
            <div key={tank.id} className="flex flex-col items-center">
              <img
                src={tankImg}
                alt="Player Tank"
                className={`w-24 ${
                  firingTankId === tank.id ? "shake" : ""
                } ${damagedPlayerId === tank.id ? "glow-red shake" : ""}`}
              />
              <div className="text-center mt-1 text-sm">
                <p>Tank {tank.id}</p>
                <div className="w-24 h-2 bg-gray-700 rounded overflow-hidden my-1">
                  <div
                    className="bg-green-500 h-full"
                    style={{
                      width: `${(tank.hp / tank.maxHp) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs">
                  HP: {tank.hp} / {tank.maxHp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          {enemyState.map((enemy) => (
            <div key={enemy.id} className="flex flex-col items-center">
              <img
                src={enemyImg}
                alt="Enemy Tank"
                className={`w-24 ${
                  firingTankId === enemy.id + 100 ? "shake" : ""
                } ${damagedEnemyId === enemy.id ? "glow-red shake" : ""}`}
              />
              <div className="text-center mt-1 text-sm">
                <p>{enemy.name}</p>
                <div className="w-24 h-2 bg-gray-700 rounded overflow-hidden my-1">
                  <div
                    className="bg-red-500 h-full"
                    style={{
                      width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs">
                  HP: {enemy.hp} / {enemy.maxHp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-green-400 font-semibold">
        🎯 Current Turn: {currentTurn}
      </p>

      <div className="mt-4 text-center">
        <p className="text-sm mb-2">Select Target</p>
        <div className="flex justify-center gap-3">
          {enemyState.map((enemy) => (
            <button
              key={enemy.id}
              onClick={() => setSelectedEnemyId(enemy.id)}
              className={`px-4 py-1 text-sm rounded ${
                selectedEnemyId === enemy.id
                  ? "bg-yellow-400 text-black font-bold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {enemy.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm mb-2">Select Weapon</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {weaponList.map((weapon) => (
            <button
              key={weapon.key}
              onClick={() => setSelectedWeapon(weapon.key)}
              disabled={!isWeaponAvailable(currentTank, weapon.key)}
              className={`px-3 py-1 text-sm rounded ${
                selectedWeapon === weapon.key
                  ? "bg-yellow-400 text-black font-bold"
                  : isWeaponAvailable(currentTank, weapon.key)
                  ? weapon.color
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >
              {weapon.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleFire}
          disabled={!selectedWeapon || enemyTurnActive}
          className={`px-5 py-2 rounded font-bold mt-2 ${
            !selectedWeapon || enemyTurnActive
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          }`}
        >
          🔥 Fire!
        </button>
      </div>

      <div className="mt-8 max-w-md w-full bg-gray-800 rounded-lg p-4 text-sm text-white text-left">
        {log.length === 0 ? (
          <p className="text-center">📝 Battle log will appear here...</p>
        ) : (
          log.map((entry, i) => <p key={i}>• {entry}</p>)
        )}
      </div>
    </div>
  );
}

