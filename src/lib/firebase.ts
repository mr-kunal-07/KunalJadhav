import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

// Firebase web configuration identifies the project; Firestore rules control access.
const firebaseConfig = {
  apiKey: "AIzaSyAZijCdzzae6YrZsqs4IZIerHu-yga46gM",
  authDomain: "kunal-jadhav-portfolio.firebaseapp.com",
  projectId: "kunal-jadhav-portfolio",
  storageBucket: "kunal-jadhav-portfolio.firebasestorage.app",
  messagingSenderId: "376138035991",
  appId: "1:376138035991:web:c8d1b17cdc1ae4d87afd52",
  measurementId: "G-XPVB72Y9QL",
};

// Reuse the default app during development hot reloads.
export const app = getApps().find((existing) => existing.name === "[DEFAULT]")
  ?? initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analyticsPromise: Promise<Analytics | null> | undefined;

export function initializeAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  analyticsPromise ??= import("firebase/analytics")
    .then(async ({ isSupported, getAnalytics }) =>
      await isSupported() ? getAnalytics(app) : null,
    )
    .catch((error: unknown) => {
      // Analytics being unavailable must not prevent the portfolio from loading.
      console.warn("Firebase Analytics is unavailable.", error);
      return null;
    });

  return analyticsPromise;
}
