// helpers/doEnemyTurn.js
import { flushSync } from "react-dom";

export default async function doEnemyTurn({
  freshEnemyState,
  setEnemyTurnActive,
  setFiringTankId,
  setDamagedPlayerId,
  setTanks,
  setLog,
  tanks,
  currentLevel,
  sleep,
}) {
  setEnemyTurnActive(true);

  const enemies = freshEnemyState.filter((e) => e.hp > 0);

  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;

    const target = chooseTargetTank(tanks);
    const baseDamage = Math.floor(Math.random() * 5 + 5 + currentLevel);
    const reduced = Math.max(0, baseDamage + (enemy.atk || 0) * 0.5 - (target.def || 0) * 0.3);
    const finalDamage = Math.round(reduced);

    // 🧹 Clear previous states
    flushSync(() => {
      setFiringTankId(null);
      setDamagedPlayerId(null);
    });
    await new Promise((r) => requestAnimationFrame(r));

    // 🎯 Fire animation
    flushSync(() => setFiringTankId(enemy.id + 100));
    await new Promise((r) => requestAnimationFrame(r));
    await sleep(300);

    // 💥 Damage animation
    flushSync(() => setDamagedPlayerId(target.id));
    await new Promise((r) => requestAnimationFrame(r));
    await sleep(200);

    // 🩸 Apply damage
    setTanks((prev) =>
      prev.map((t) =>
        t.id === target.id
          ? { ...t, hp: Math.max(t.hp - finalDamage, 0) }
          : t
      )
    );

    // 📝 Log result
    setLog((prev) => [
      `💣 ${enemy.name} hit Tank ${target.id} for ${finalDamage} damage.`,
      ...prev,
    ]);

    await sleep(500);

    // 🧼 Cleanup
    flushSync(() => {
      setFiringTankId(null);
      setDamagedPlayerId(null);
    });
    await new Promise((r) => requestAnimationFrame(r));
    await sleep(300);
  }

  setEnemyTurnActive(false);
}

function chooseTargetTank(tanks) {
  const live = tanks.filter((t) => t.hp > 0);
  if (live.length === 1) return live[0];
  const [a, b] = live;
  if (a.def !== b.def) return a.def < b.def ? a : b;
  if (a.hp !== b.hp) return a.hp < b.hp ? a : b;
  return a.id === 1 ? a : b;
}

