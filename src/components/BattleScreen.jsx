import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useGame } from "../context/GameContext";
import useWeapons from "../hooks/useWeapons";
import tankImg from "/tank1.png";
import enemyImg from "/enemy.png";
import BattleLog from "./BattleLog";
import TankDisplay from "./TankDisplay";
import useAutoSelectEnemy from "../hooks/useAutoSelectEnemy";
import WeaponSelector from "./WeaponSelector";
import TargetSelector from "./TargetSelector";


export default function BattleScreen() {
  const {
    tanks,
    setTanks,
    currentLevel,
    setCurrentLevel,
    currentBattle,
    setCurrentBattle,
    gold,
    setGold,
    setCurrentScreen,
  } = useGame();

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
  const [battleEnded, setBattleEnded] = useState(false);

  const {
    isWeaponAvailable,
    markWeaponUsed,
    advanceCooldownFor,
    resetWeapons,
  } = useWeapons();

  const currentTank = tanks[currentTankIndex];

  useEffect(() => {
  if (!currentTank || currentTank.hp <= 0 || enemyTurnActive) return;

  const priority = ["airstrike", "missile", "cannon", "machinegun"];
  for (const weapon of priority) {
    if (isWeaponAvailable(currentTank, weapon)) {
      setSelectedWeapon(weapon);
      break;
    }
  }
}, [currentTankIndex, enemyTurnActive]);
  const liveTanks = tanks.filter((t) => t.hp > 0);
  const liveEnemies = enemyState.filter((e) => e.hp > 0);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  useAutoSelectEnemy(enemyState, currentTankIndex, enemyTurnActive, setSelectedEnemyId);

  useEffect(() => {
    if (currentTank.hp <= 0 && !enemyTurnActive && !battleEnded) {
      let nextTankIndex = (currentTankIndex + 1) % tanks.length;
      while (tanks[nextTankIndex].hp <= 0 && nextTankIndex !== currentTankIndex) {
        nextTankIndex = (nextTankIndex + 1) % tanks.length;
      }
      setCurrentTankIndex(nextTankIndex);
    }
  }, [currentTankIndex, currentTank.hp, enemyTurnActive, battleEnded]);

  const getDamage = (weapon) => {
    switch (weapon) {
      case "machinegun": return 5;
      case "cannon": return 10;
      case "missile": return 20;
      case "airstrike": return 15;
      default: return 0;
    }
  };

  const handleFire = async () => {
    if (!selectedWeapon || currentTank.hp <= 0) return;

    advanceCooldownFor(currentTank.id);
    markWeaponUsed(currentTank.id, selectedWeapon);

    const damage = getDamage(selectedWeapon);
    setFiringTankId(currentTank.id);
    await sleep(300);

    let newEnemyState = [...enemyState];
    let newLog = [];

    if (selectedWeapon === "airstrike") {
      newEnemyState = newEnemyState.map((enemy) => {
        if (enemy.hp <= 0) return enemy;
        const newHp = Math.max(enemy.hp - damage, 0);
        if (newHp < enemy.hp) {
          newLog.push(`💥 Tank ${currentTank.id} airstruck ${enemy.name} for ${damage}.`);
        }
        return { ...enemy, hp: newHp };
      });
    } else {
      const target = newEnemyState.find((e) => e.id === selectedEnemyId);
      if (!target) return;

      setDamagedEnemyId(target.id);
      await sleep(200);

      newEnemyState = newEnemyState.map((e) =>
        e.id === target.id ? { ...e, hp: Math.max(e.hp - damage, 0) } : e
      );

      newLog.push(
        `💥 Tank ${currentTank.id} hit ${target.name} with ${selectedWeapon} for ${damage}.`
      );
    }

    setEnemyState(newEnemyState);
    setLog((prev) => [...newLog, ...prev]);

    await sleep(400);
    setFiringTankId(null);
    setDamagedEnemyId(null);
    setSelectedWeapon(null);
    setSelectedEnemyId(null);

    const allEnemiesDead = newEnemyState.every((e) => e.hp <= 0);
    if (allEnemiesDead) {
      setBattleEnded(true);
      endBattleVictory();
      return;
    }

    let nextTankIndex = (currentTankIndex + 1) % tanks.length;
    while (tanks[nextTankIndex].hp <= 0 && nextTankIndex !== currentTankIndex) {
      nextTankIndex = (nextTankIndex + 1) % tanks.length;
    }

    setCurrentTankIndex(nextTankIndex);

    const isBackToStart = nextTankIndex === 0;
    if (isBackToStart || liveTanks.length === 1) {
      await doEnemyTurn(newEnemyState);
    }
  };

  useEffect(() => {
    if (battleEnded) return;

    if (liveEnemies.length === 0) {
      setBattleEnded(true);
      endBattleVictory();
    } else if (liveTanks.length === 0) {
      setBattleEnded(true);
      endBattleDefeat();
    }
  }, [tanks, enemyState]);

  const endBattleVictory = () => {
    const goldEarned = 20 * enemyState.length;
    setGold((prev) => prev + goldEarned);

    setTanks((prev) =>
      prev.map((t) => ({
        ...t,
        hp: Math.min(t.hp + 25, t.maxHp),
      }))
    );

    if (currentBattle < 5) {
      setCurrentBattle(currentBattle + 1);
    } else {
      setCurrentLevel(currentLevel + 1);
      setCurrentBattle(1);
    }

    resetWeapons();
    setTimeout(() => setCurrentScreen("shop"), 1200);
  };

  const endBattleDefeat = () => {
    setTimeout(() => setCurrentScreen("gameover"), 800);
  };

  const doEnemyTurn = async (freshEnemyState) => {
    setEnemyTurnActive(true);

    const enemies = freshEnemyState.filter((e) => e.hp > 0);

    for (const enemy of enemies) {
      const target = chooseTargetTank();
      const damage = Math.floor(Math.random() * 5 + 5 + currentLevel);

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
    const live = tanks.filter((t) => t.hp > 0);
    if (live.length === 1) return live[0];
    const [a, b] = live;
    if (a.def !== b.def) return a.def < b.def ? a : b;
    if (a.hp !== b.hp) return a.hp < b.hp ? a : b;
    return a.id === 1 ? a : b;
  };

  const weaponList = [
    { label: "Machine Gun", key: "machinegun", color: "bg-blue-600" },
    { label: "Cannon", key: "cannon", color: "bg-orange-600" },
    { label: "Missile", key: "missile", color: "bg-purple-600" },
    { label: "Airstrike", key: "airstrike", color: "bg-red-600" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-yellow-300 mb-1">🪖 Tank Game</h1>
      <p className="text-sm text-gray-300">
        Level {currentLevel} – Battle {currentBattle}/5
      </p>
      <p className="text-sm text-yellow-400 font-bold mt-1">💰 Gold: {gold}</p>

      <div className="flex justify-center gap-28 mt-4 max-w-[600px]">
      <TankDisplay
      entities={tanks}
      type="player"
      firingTankId={firingTankId}
      damagedId={damagedPlayerId}
      />
      <TankDisplay
      entities={enemyState}
      type="enemy"
      firingTankId={firingTankId}
      damagedId={damagedEnemyId}
  />
</div>

      <p className="mt-6 text-sm text-green-400 font-semibold">
        🎯 Current Turn: Tank {currentTank.id}
      </p>

      <div className="mt-4 text-center">
      <TargetSelector
  enemyState={enemyState}
  selectedEnemyId={selectedEnemyId}
  setSelectedEnemyId={setSelectedEnemyId}
/>

      </div>

      <WeaponSelector
  weaponList={weaponList}
  currentTank={currentTank}
  selectedWeapon={selectedWeapon}
  setSelectedWeapon={setSelectedWeapon}
  isWeaponAvailable={isWeaponAvailable}
/>


      <div className="mt-4 text-center">
        <button
          onClick={handleFire}
          disabled={
            !selectedWeapon || enemyTurnActive || currentTank.hp <= 0
          }
          className={`px-5 py-2 rounded font-bold mt-2 ${
            !selectedWeapon || enemyTurnActive || currentTank.hp <= 0
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          }`}
        >
          🔥 Fire!
        </button>
      </div>

      <div className="mt-3">
  <BattleLog log={log} />
</div>


    </div>
  );
}





