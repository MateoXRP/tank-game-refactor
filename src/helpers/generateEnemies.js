// helpers/generateEnemies.js

export default function generateEnemies(level) {
  const getEnemyStats = (type) => {
    const baseStats = {
      grunt: { hp: 60, atk: 10, def: 5 },
      brute: { hp: 100, atk: 20, def: 10 },
    };

    const stats = baseStats[type];
    const scale = level >= 6 ? 1 + (level - 5) * 0.15 : 1; // Scaling after level 5

    return {
      hp: Math.round(stats.hp * scale),
      maxHp: Math.round(stats.hp * scale),
      atk: Math.round(stats.atk * scale),
      def: Math.round(stats.def * scale),
      type,
    };
  };

  const generateBruteOnlyFormation = () => {
    const formations = [
      [getEnemyStats("brute")],
      [getEnemyStats("brute"), getEnemyStats("brute")],
    ];
    return formations[Math.random() < 0.4 ? 0 : 1];
  };

  const generateMixedFormation = () => {
    const formations = [
      [getEnemyStats("grunt")],
      [getEnemyStats("grunt"), getEnemyStats("grunt")],
      [getEnemyStats("brute")],
      [getEnemyStats("grunt"), getEnemyStats("brute")],
    ];
    const weights = [0.4, 0.3, 0.15, 0.15];
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < formations.length; i++) {
      sum += weights[i];
      if (rand < sum) return formations[i];
    }
    return formations[0];
  };

  const enemies = level >= 6 ? generateBruteOnlyFormation() : generateMixedFormation();

  return enemies.map((enemy, index) => ({
    id: index + 1,
    name: `${enemy.type === "grunt" ? "Grunt" : "Brute"} ${index + 1}`,
    ...enemy,
  }));
}

