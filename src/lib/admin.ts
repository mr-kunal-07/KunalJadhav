import { browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "./firebase";

export const auth = getAuth(app);
const adminEmail = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL || "dev.kunaljadhav@gmail.com";

export async function loginAdmin(username: string, password: string) {
  if (username.trim().toLowerCase() !== "kunal") throw new Error("Incorrect username or password.");
  await setPersistence(auth, browserSessionPersistence);
  await signInWithEmailAndPassword(auth, adminEmail, password);
}
export async function isAdmin(uid: string) {
  const role = await getDoc(doc(db, "admins", uid));
  return role.exists() && role.data().role === "admin";
}
export const logoutAdmin = () => signOut(auth);
export function loginError(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password", "auth/invalid-email"].includes(code ?? "")) return "Incorrect username or password.";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait before trying again.";
  if (code === "auth/network-request-failed") return "Cannot connect to Firebase. Check your internet connection.";
  if (["auth/operation-not-allowed", "auth/configuration-not-found"].includes(code ?? "")) return "Firebase sign-in is not enabled yet. Complete the Firebase setup guide first.";
  return error instanceof Error ? error.message : "Sign-in failed. Please try again.";
}
