// firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Submit a new score to the specified leaderboard
export async function submitGlobalScore(boardName, { name, level, battle, kills }) {
  try {
    const docRef = doc(db, boardName, name);
    const docSnap = await getDoc(docRef);

    let finalLevel = level;
    let finalBattle = battle;
    let finalKills = kills;

    if (docSnap.exists()) {
      const existing = docSnap.data();

      // 🧮 Accumulate kills
      finalKills = (existing.kills || 0) + kills;

      // 🧩 Compare level/battle to keep the furthest point
      if (
        existing.level > level ||
        (existing.level === level && existing.battle > battle)
      ) {
        finalLevel = existing.level;
        finalBattle = existing.battle;
      }
    }

    await setDoc(docRef, {
      name,
      level: finalLevel,
      battle: finalBattle,
      kills: finalKills,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error submitting score:", err);
  }
}

// Fetch top 10 scores from the specified leaderboard
export async function fetchGlobalLeaderboard(boardName, limitCount = 10) {
  try {
    const q = query(
      collection(db, boardName),
      orderBy("level", "desc"),
      orderBy("battle", "desc"),
      orderBy("kills", "desc"),
      orderBy("timestamp", "asc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

