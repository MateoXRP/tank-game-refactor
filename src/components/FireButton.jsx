import React from "react";

export default function FireButton({
  handleFire,
  selectedWeapon,
  enemyTurnActive,
  currentTank
}) {
  const isDisabled =
    !selectedWeapon || enemyTurnActive || currentTank.hp <= 0;

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleFire}
        disabled={isDisabled}
        className={`px-5 py-2 rounded font-bold mt-2 ${
          isDisabled
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        🔥 Fire!
      </button>
    </div>
  );
}

