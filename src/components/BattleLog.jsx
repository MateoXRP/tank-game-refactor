import React from "react";

export default function BattleLog({ log }) {
  return (
    <div className="bg-gray-800 rounded p-4 max-w-md mx-auto">
      {log.length === 0 && (
        <h3 className="text-center text-lg mb-2">📜 Battle Log</h3>
      )}
      <ul className="text-sm space-y-1">
        {log.map((entry, idx) => (
          <li key={idx}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
