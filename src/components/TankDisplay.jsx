// components/TankDisplay.jsx
import React from "react";
import tankImg from "/tank1.png";
import enemyImg from "/enemy.png";

export default function TankDisplay({ entities = [], type, firingTankId, damagedId }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {entities.map((entity) => {
        const isFiring = firingTankId === (type === "player" ? entity.id : entity.id + 100);
        const isDamaged =
          type === "enemy"
            ? damagedId === -1 || damagedId === entity.id // ✅ Support airstrike flash
            : damagedId === entity.id;

        return (
          <div key={entity.id} className="flex flex-col items-center">
            <img
              src={type === "player" ? tankImg : enemyImg}
              className={`w-24 ${
                isFiring ? "shake" : ""
              } ${isDamaged ? "glow-red shake" : ""}`}
              alt={type === "player" ? `Tank ${entity.id}` : entity.name}
            />
            <div className="text-sm text-center mt-1 w-28">
              <p>
                {type === "player"
                  ? `Tank ${entity.id} (L${entity.level ?? 1})`
                  : entity.name}
              </p>
              <div className="w-24 h-2 bg-gray-700 rounded overflow-hidden my-1">
                <div
                  className={type === "player" ? "bg-green-500 h-full" : "bg-red-500 h-full"}
                  style={{
                    width: `${(entity.hp / entity.maxHp) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs">
                HP: {entity.hp} / {entity.maxHp}
              </p>
              {type === "player" && (
                <p className="text-xs text-yellow-300">
                  🔫:{entity.atk} 🛡️:{entity.def} 🎖️:{entity.exp}/{entity.expToNext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

