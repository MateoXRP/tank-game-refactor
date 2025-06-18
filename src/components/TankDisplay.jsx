// components/TankDisplay.jsx
import React from "react";
import tankImg from "/tank1.png";
import enemyImg from "/enemy.png";

export default function TankDisplay({
  entities = [],
  type,
  firingTankId,
  damagedId,
  selectedEnemyId,
  setSelectedEnemyId,
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {entities.map((entity) => {
        const isSelected = selectedEnemyId === entity.id && type === "enemy";
        const clickHandler = () => {
          if (type === "enemy" && setSelectedEnemyId && entity.hp > 0) {
            setSelectedEnemyId(entity.id);
          }
        };

        return (
          <div
            key={entity.id}
            onClick={clickHandler}
            className={`bg-gray-800 rounded-lg shadow-md flex flex-col items-center px-2 py-2 transition duration-150 
              w-28 h-32 sm:w-32 sm:h-36 md:w-36 md:h-40
              ${type === "enemy" && setSelectedEnemyId ? "cursor-pointer hover:scale-105" : ""}
              ${isSelected ? "ring-4 ring-yellow-400" : ""}
            `}
          >
            <div className="flex items-center justify-center w-full h-24 sm:h-28">
              <img
                src={type === "player" ? tankImg : enemyImg}
                className={`max-w-full max-h-full ${
                  type === "enemy" && entity.type === "brute"
                    ? "w-16 sm:w-20 md:w-28"
                    : "w-14 sm:w-18 md:w-24"
                } ${
                  firingTankId === (type === "player" ? entity.id : entity.id + 100)
                    ? "shake"
                    : ""
                } ${damagedId === entity.id ? "glow-red shake" : ""}`}
                alt={type === "player" ? `Tank ${entity.id}` : entity.name}
              />
            </div>

            <div className="text-[10px] sm:text-xs text-center mt-1 w-full leading-tight">
              <p className="font-semibold">
                {type === "player"
                  ? `Tank ${entity.id} (L${entity.level ?? 1})`
                  : entity.name}
              </p>
              <div className="w-full h-2 bg-gray-700 rounded overflow-hidden my-1">
                <div
                  className={type === "player" ? "bg-green-500 h-full" : "bg-red-500 h-full"}
                  style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
                ></div>
              </div>
              <p>
                HP: {entity.hp} / {entity.maxHp}
              </p>
              {type === "player" && (
                <p className="text-[9px] sm:text-[10px] text-yellow-300 mt-1">
                  🔫 {entity.atk} 🛡️ {entity.def} 🎖️ {entity.exp}/{entity.expToNext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
