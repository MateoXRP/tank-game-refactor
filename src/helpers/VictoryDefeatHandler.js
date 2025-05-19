// VictoryDefeatHandler.js

export function handleVictory({
  enemyState,
  setGold,
  setTanks,
  currentBattle,
  setCurrentBattle,
  currentLevel,
  setCurrentLevel,
  resetWeapons,
  setCurrentScreen,
}) {
  const goldEarned = 20 * enemyState.length; // Restored full gold per tank
  setGold((prev) => prev + goldEarned);

  setTanks((prev) =>
    prev.map((t) => ({
      ...t,
      hp: Math.min(t.hp + 12, t.maxHp), // 💉 Reduced healing from 25 → 12
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
}

export function handleDefeat(setCurrentScreen) {
  setTimeout(() => setCurrentScreen("gameover"), 800);
}

