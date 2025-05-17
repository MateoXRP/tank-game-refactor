import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState("");
  const [currentScreen, setCurrentScreen] = useState("login");

  const createInitialTank = (id) => ({
    id,
    hp: 100,
    maxHp: 100,
    atk: 5,
    def: 5,
    level: 1,
    exp: 0,
    expToNext: 2,
    upgrades: { atk: 0, def: 0 },
    kils: 0,
  });

  const getDefaultTanks = () => [createInitialTank(1), createInitialTank(2)];

  const [tanks, setTanks] = useState(getDefaultTanks());
  const [gold, setGold] = useState(40); // reduced from 60
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentBattle, setCurrentBattle] = useState(1);

  const hasUpgrade = (tank, stat) => tank.upgrades?.[stat] || 0;

  const buyUpgrade = (tankId, stat) => {
    const cost = 20;
    const targetTank = tanks.find((t) => t.id === tankId);
    if (!targetTank || gold < cost || targetTank.upgrades[stat] >= 5) return;

    setGold((prevGold) => prevGold - cost);
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? {
              ...t,
              [stat]: t[stat] + 5,
              upgrades: {
                ...t.upgrades,
                [stat]: t.upgrades[stat] + 1,
              },
            }
          : t
      )
    );
  };

  const repairTank = (tankId) => {
    const cost = 10;
    const targetTank = tanks.find((t) => t.id === tankId);
    if (!targetTank || gold < cost || targetTank.hp >= targetTank.maxHp) return;

    setGold((prevGold) => prevGold - cost);
    setTanks((prev) =>
      prev.map((t) =>
        t.id === tankId
          ? { ...t, hp: Math.min(t.hp + 25, t.maxHp) }
          : t
      )
    );
  };

  const resetGame = () => {
    setTanks(getDefaultTanks());
    setGold(40);
    setCurrentLevel(1);
    setCurrentBattle(1);
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        currentScreen,
        setCurrentScreen,
        tanks,
        setTanks,
        gold,
        setGold,
        currentLevel,
        setCurrentLevel,
        currentBattle,
        setCurrentBattle,
        hasUpgrade,
        buyUpgrade,
        repairTank,
        resetGame,
        getDefaultTanks,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

