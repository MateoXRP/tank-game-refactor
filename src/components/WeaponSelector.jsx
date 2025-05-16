import React from "react";

export default function WeaponSelector({
  weaponList,
  currentTank,
  selectedWeapon,
  setSelectedWeapon,
  isWeaponAvailable,
}) {
  return (
    <div className="mt-4 text-center">
      <p className="text-sm mb-2">Select Weapon</p>
      <div className="flex justify-center gap-3 flex-wrap">
        {weaponList.map((weapon) => (
          <button
            key={weapon.key}
            onClick={() => setSelectedWeapon(weapon.key)}
            disabled={!isWeaponAvailable(currentTank, weapon.key)}
            className={`px-3 py-1 text-sm rounded ${
              selectedWeapon === weapon.key
                ? "bg-yellow-400 text-black font-bold"
                : isWeaponAvailable(currentTank, weapon.key)
                ? weapon.color
                : "bg-gray-600 opacity-50 cursor-not-allowed"
            }`}
          >
            {weapon.label}
          </button>
        ))}
      </div>
    </div>
  );
}

