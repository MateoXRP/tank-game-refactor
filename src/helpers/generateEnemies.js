// src/helpers/generateEnemies.js

export default function generateEnemies(level) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Define enemy types
  const enemyTypes = {
    weak: {
      name: "Grunt",
      baseHp: 50,
    },
    medium: {
      name: "Bruiser",
      baseHp: 80,
    },
  };

  // Weighted formation selection that favors stronger enemies as level increases
  const formationPool = [];

  if (level <= 2) {
    formationPool.push(["weak"]);
    formationPool.push(["weak", "weak"]);
  } else if (level <= 4) {
    formationPool.push(["weak", "medium"]);
    formationPool.push(["medium"]);
    formationPool.push(["weak", "weak"]);
  } else {
    formationPool.push(["medium"]);
    formationPool.push(["weak", "medium"]);
    formationPool.push(["medium", "medium"]);
  }

  const formation = formationPool[Math.floor(Math.random() * formationPool.length)];

  return formation.map((typeKey, index) => {
    const type = enemyTypes[typeKey];
    const hp = type.baseHp + rand(0, level * 2); // Scale HP with level
    return {
      id: index + 1,
      name: type.name,
      hp,
      maxHp: hp,
    };
  });
}

