import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [tanks, setTanks] = useState([
    {
      id: 1,
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 5,
      upgrades: { atk: 0, def: 0 },
    },
    {
      id: 2,
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 5,
      upgrades: { atk: 0, def: 0 },
    },
  ]);

  const [gold, setGold] = useState(60);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentBattle, setCurrentBattle] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [currentScreen, setCurrentScreen] = useState("shop");

  const startBattle = () => {
    setCurrentScreen("battle");
  };

  const buyUpgrade = (tankId, stat) => {
    const cost = 20;
    setTanks(prev =>
      prev.map(t => {
        if (t.id !== tankId) return t;

        const newUpgrades = {
          ...t.upgrades,
          [stat]: (t.upgrades[stat] || 0) + 1,
        };

        return {
          ...t,
          upgrades: newUpgrades,
          [stat]: t[stat] + 5,
        };
      })
    );
    setGold(g => g - cost);
  };

  // ✅ Shared helper function
  function hasUpgrade(tank, stat) {
    return tank.upgrades?.[stat] || 0;
  }

  return (
    <GameContext.Provider
      value={{
        tanks,
        setTanks,
        gold,
        setGold,
        currentLevel,
        setCurrentLevel,
        currentBattle,
        setCurrentBattle,
        playerName,
        setPlayerName,
        currentScreen,
        setCurrentScreen,
        startBattle,
        buyUpgrade,
        hasUpgrade, // ✅ Exposed globally
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

