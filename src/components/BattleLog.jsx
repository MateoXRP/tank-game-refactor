// components/BattleLog.jsx
import React from "react";

export default function BattleLog({ log }) {
  return (
    <div className="bg-gray-900 rounded p-4 text-sm h-full overflow-y-auto font-sans">
      <h3 className="text-white text-base font-semibold mb-3">📜 Battle Log</h3>
      {log.length === 0 ? (
        <p className="text-gray-400 italic">No events yet...</p>
      ) : (
        <ul className="space-y-2">
          {log.map((entry, idx) => (
            <li
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            >
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
