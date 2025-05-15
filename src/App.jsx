import { GameProvider, useGame } from "./context/GameContext";
import LoginScreen from "./components/LoginScreen";
import ShopScreen from "./components/ShopScreen";
import BattleScreen from "./components/BattleScreen";

function GameRouter() {
  const { playerName, currentScreen } = useGame();

  if (!playerName) return <LoginScreen />;
  if (currentScreen === "shop") return <ShopScreen />;
  if (currentScreen === "battle") return <BattleScreen />;

  return null;
}

export default function App({ initialScreen, initialName }) {
  return (
    <GameProvider initialScreen={initialScreen} initialName={initialName}>
      <div className="bg-black min-h-screen">
        <GameRouter />
      </div>
    </GameProvider>
  );
}

