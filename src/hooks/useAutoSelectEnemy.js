import { useEffect } from "react";

export default function useAutoSelectEnemy(
  enemyState,
  currentTankIndex,
  enemyTurnActive,
  setSelectedEnemyId
) {
  useEffect(() => {
    const e1 = enemyState.find(e => e.id === 1);
    const e2 = enemyState.find(e => e.id === 2);

    if (e1 && e1.hp > 0) {
      setSelectedEnemyId(1);
    } else if (e2 && e2.hp > 0) {
      setSelectedEnemyId(2);
    } else {
      setSelectedEnemyId(null);
    }
  }, [enemyState, currentTankIndex, enemyTurnActive]);
}

