import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGame } from "./context/GameContext";
import LoginScreen from "./components/LoginScreen";
import ShopScreen from "./components/ShopScreen";
import BattleScreen from "./components/BattleScreen";
import GameOverScreen from "./components/GameOverScreen";

export default function App() {
  const { playerName, setPlayerName, currentScreen } = useGame();

  useEffect(() => {
    const saved = Cookies.get("tankPlayer");
    if (saved) setPlayerName(saved);
  }, []);

  if (!playerName) return <LoginScreen />;
  if (currentScreen === "shop") return <ShopScreen />;
  if (currentScreen === "battle") return <BattleScreen />;
  if (currentScreen === "gameover") return <GameOverScreen />;

  return null;
}

