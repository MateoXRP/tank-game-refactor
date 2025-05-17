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
  const goldEarned = Math.floor((20 * enemyState.length) * 0.5); // 50% reduced gold
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

