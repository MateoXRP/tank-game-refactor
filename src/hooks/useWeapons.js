import { useState } from "react";
import { useGame } from "../context/GameContext";

export default function useWeapons() {
  const { tanks, hasUpgrade } = useGame();

  const [missileUsed, setMissileUsed] = useState({ 1: false, 2: false });
  const [airstrikeUsed, setAirstrikeUsed] = useState({ 1: false, 2: false });
  const [cannonCooldown, setCannonCooldown] = useState({ 1: 0, 2: 0 });

  const isMissileUnlocked = (tank) =>
    hasUpgrade(tank, "atk") === 5 && hasUpgrade(tank, "def") === 5;

  const isAirstrikeUnlocked = () =>
    tanks.every(
      (tank) =>
        hasUpgrade(tank, "atk") === 5 && hasUpgrade(tank, "def") === 5
    );

  const isWeaponAvailable = (tank, weaponKey) => {
    const id = tank.id;

    if (weaponKey === "cannon") {
//      console.log("🔧 Checking cannon cooldown for Tank", id, "=", cannonCooldown[id]);
    }

    switch (weaponKey) {
      case "machinegun":
        return true;
      case "cannon":
        return cannonCooldown[id] === 0;
      case "missile":
        return isMissileUnlocked(tank) && !missileUsed[id];
      case "airstrike":
        return isAirstrikeUnlocked() && !airstrikeUsed[id];
      default:
        return false;
    }
  };

  const markWeaponUsed = (tankId, weaponKey) => {
    if (weaponKey === "missile") {
      setMissileUsed((prev) => ({ ...prev, [tankId]: true }));
    } else if (weaponKey === "airstrike") {
      setAirstrikeUsed((prev) => ({ ...prev, [tankId]: true }));
    } else if (weaponKey === "cannon") {
//      console.log("💥 Setting cannon cooldown for Tank", tankId);
      setCannonCooldown((prev) => ({ ...prev, [tankId]: 1 }));
    }
  };

  const advanceCooldownFor = (tankId) => {
    setCannonCooldown((prev) => {
      const updated = {
        ...prev,
        [tankId]: Math.max(0, (prev[tankId] || 0) - 1),
      };
//      console.log("🔁 Advancing cooldowns:", updated);
      return updated;
    });
  };

  const resetWeapons = () => {
    setMissileUsed({ 1: false, 2: false });
    setAirstrikeUsed({ 1: false, 2: false });
    setCannonCooldown({ 1: 0, 2: 0 });
  };

  return {
    isWeaponAvailable,
    markWeaponUsed,
    advanceCooldownFor,
    resetWeapons,
  };
}

