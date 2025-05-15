import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const GameContext = createContext();

export function GameProvider({ children, initialName = "", initialScreen = "login" }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [gold, setGold] = useState(60);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentBattle, setCurrentBattle] = useState(1);

  const [tanks, setTanks] = useState([
    {
      id: 1,
      hp: 100,
      maxHp: 100,
      attack: 0,
      defense: 0,
      level: 1,
      hasMissile: false,
      hasAirstrike: false,
    },
    {
      id: 2,
      hp: 100,
      maxHp: 100,
      attack: 0,
      defense: 0,
      level: 1,
      hasMissile: false,
      hasAirstrike: false,
    },
  ]);

  const [cooldowns, setCooldowns] = useState({
    missile: [false, false],
    airstrike: [false, false],
  });

  // Save screen changes
  useEffect(() => {
    if (currentScreen) Cookies.set("tankScreen", currentScreen);
  }, [currentScreen]);

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        tanks,
        setTanks,
        currentScreen,
        setCurrentScreen,
        currentLevel,
        setCurrentLevel,
        currentBattle,
        setCurrentBattle,
        cooldowns,
        setCooldowns,
        gold,
        setGold,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);

