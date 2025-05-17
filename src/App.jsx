import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGame } from "./context/GameContext";
import LoginScreen from "./components/LoginScreen";
import ShopScreen from "./components/ShopScreen";
import BattleScreen from "./components/BattleScreen";
import GameOverScreen from "./components/GameOverScreen";

export default function App() {
  const {
    playerName,
    setPlayerName,
    currentScreen,
    setCurrentScreen,
  } = useGame();

  useEffect(() => {
    const savedName = Cookies.get("tankPlayer");
    if (savedName && !playerName) {
      setPlayerName(savedName);
      setCurrentScreen("shop");
    }
  }, [playerName, setPlayerName, setCurrentScreen]);

  if (!playerName) return <LoginScreen />;

  switch (currentScreen) {
    case "shop":
      return <ShopScreen />;
    case "battle":
      return <BattleScreen />;
    case "gameover":
      return <GameOverScreen />;
    default:
      return <LoginScreen />;
  }
}

