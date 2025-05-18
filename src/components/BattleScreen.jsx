// BattleScreen.jsx
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useGame } from "../context/GameContext";
import useWeapons from "../hooks/useWeapons";
import useAutoSelectEnemy from "../hooks/useAutoSelectEnemy";
import { handleVictory, handleDefeat } from "../helpers/VictoryDefeatHandler";
import doEnemyTurn from "../helpers/doEnemyTurn";
import generateEnemies from "../helpers/generateEnemies";

import BattleLog from "./BattleLog";
import TankDisplay from "./TankDisplay";
import WeaponSelector from "./WeaponSelector";
import TargetSelector from "./TargetSelector";
import FireButton from "./FireButton";

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
  const [enemyState, setEnemyState] = useState(generateEnemies(currentLevel, currentBattle)); // 🔁 updated here
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
  const liveTanks = tanks.filter((t) => t.hp > 0);
  const liveEnemies = enemyState.filter((e) => e.hp > 0);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  useAutoSelectEnemy(enemyState, currentTankIndex, enemyTurnActive, setSelectedEnemyId);

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

    const base = getDamage(selectedWeapon);
    setFiringTankId(currentTank.id);
    await sleep(300);

    let newEnemyState = [...enemyState];
    let newLog = [];

    if (selectedWeapon === "airstrike") {
      newEnemyState = newEnemyState.map((enemy) => {
        if (enemy.hp <= 0) return enemy;
        const damage = Math.max(0, Math.round(base + currentTank.atk * 0.5 - enemy.def * 0.3));
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

      const damage = Math.max(0, Math.round(base + currentTank.atk * 0.5 - target.def * 0.3));
      const newHp = Math.max(target.hp - damage, 0);
      const isKill = newHp === 0;

      newEnemyState = newEnemyState.map((e) =>
        e.id === target.id ? { ...e, hp: newHp } : e
      );

      newLog.push(
        `💥 Tank ${currentTank.id} hit ${target.name} with ${selectedWeapon} for ${damage}.`
      );

      if (isKill) {
        setTanks((prev) =>
          prev.map((tank) => {
            if (tank.id !== currentTank.id) return tank;
            const newExp = tank.exp + 1;
            const needsLevelUp = newExp >= tank.expToNext;
            return needsLevelUp
              ? {
                  ...tank,
                  exp: 0,
                  expToNext: tank.expToNext * 2,
                  level: tank.level + 1,
                  hp: tank.hp + 10,
                  maxHp: tank.maxHp + 10,
                  atk: tank.atk + 2,
                  def: tank.def + 2,
                  kills: (tank.kills || 0) + 1,
                }
              : {
                  ...tank,
                  exp: newExp,
                  kills: (tank.kills || 0) + 1,
                };
          })
        );
      }
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
      handleVictory({
        enemyState: newEnemyState,
        setGold,
        setTanks,
        currentBattle,
        setCurrentBattle,
        currentLevel,
        setCurrentLevel,
        resetWeapons,
        setCurrentScreen,
      });
      return;
    }

    let nextTankIndex = (currentTankIndex + 1) % tanks.length;
    while (tanks[nextTankIndex].hp <= 0 && nextTankIndex !== currentTankIndex) {
      nextTankIndex = (nextTankIndex + 1) % tanks.length;
    }

    setCurrentTankIndex(nextTankIndex);

    const isBackToStart = nextTankIndex === 0;
    if (isBackToStart || liveTanks.length === 1) {
      await doEnemyTurn({
        freshEnemyState: newEnemyState,
        setEnemyTurnActive,
        setFiringTankId,
        setDamagedPlayerId,
        setTanks,
        setLog,
        tanks,
        currentLevel,
        sleep,
      });
    }
  };

  useEffect(() => {
    if (battleEnded) return;

    if (liveEnemies.length === 0) {
      setBattleEnded(true);
      handleVictory({
        enemyState,
        setGold,
        setTanks,
        currentBattle,
        setCurrentBattle,
        currentLevel,
        setCurrentLevel,
        resetWeapons,
        setCurrentScreen,
      });
    } else if (liveTanks.length === 0) {
      setBattleEnded(true);
      handleDefeat(setCurrentScreen);
    }
  }, [tanks, enemyState]);

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

      <TargetSelector
        enemyState={enemyState}
        selectedEnemyId={selectedEnemyId}
        setSelectedEnemyId={setSelectedEnemyId}
      />

      <WeaponSelector
        weaponList={weaponList}
        currentTank={currentTank}
        selectedWeapon={selectedWeapon}
        setSelectedWeapon={setSelectedWeapon}
        isWeaponAvailable={isWeaponAvailable}
      />

      <FireButton
        handleFire={handleFire}
        selectedWeapon={selectedWeapon}
        enemyTurnActive={enemyTurnActive}
        currentTank={currentTank}
      />

      <div className="mt-3">
        <BattleLog log={log} />
      </div>
    </div>
  );
}

