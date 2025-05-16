import React from "react";

export default function TargetSelector({ enemyState, selectedEnemyId, setSelectedEnemyId }) {
  return (
    <div className="mt-4 text-center">
      <p className="text-sm mb-2">Select Target</p>
      <div className="flex justify-center gap-3">
        {enemyState.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEnemyId(e.id)}
            disabled={e.hp <= 0}
            className={`px-4 py-1 text-sm rounded ${
              e.hp <= 0
                ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed"
                : selectedEnemyId === e.id
                ? "bg-yellow-400 text-black font-bold"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>
    </div>
  );
}

