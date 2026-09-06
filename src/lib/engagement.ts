import { collection, doc, getCountFromServer, getDoc, query, runTransaction, serverTimestamp, where, type Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type Engagement = { views: number; likes: number; liked: boolean };
export type EngagementKind = "views" | "likes";
const visitorKey = "portfolio-article-visitor";

export function getVisitorId() {
  try {
    const existing = localStorage.getItem(visitorKey);
    if (existing && /^[a-f0-9-]{36}$/.test(existing)) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(visitorKey, id);
    return id;
  } catch { return null; }
}

function eventId(createdAt: Timestamp, visitorId: string) {
  return `${createdAt.seconds}-${createdAt.nanoseconds}-${visitorId}`;
}

export async function readEngagement(slug: string): Promise<Engagement> {
  const article = await getDoc(doc(db, "articles", slug));
  if (!article.exists()) throw new Error("Article is unavailable.");
  const createdAt = article.data().createdAt as Timestamp;
  const visitorId = getVisitorId();
  const [views, likes, like] = await Promise.all([
    getCountFromServer(query(collection(db, "articles", slug, "views"), where("articleCreatedAt", "==", createdAt))),
    getCountFromServer(query(collection(db, "articles", slug, "likes"), where("articleCreatedAt", "==", createdAt))),
    visitorId ? getDoc(doc(db, "articles", slug, "likes", eventId(createdAt, visitorId))) : null,
  ]);
  return { views: views.data().count, likes: likes.data().count, liked: like?.exists() ?? false };
}

export async function recordEngagement(slug: string, kind: EngagementKind) {
  const visitorId = getVisitorId();
  if (!visitorId) throw new Error("Browser storage is unavailable. Enable it to record your like.");
  await runTransaction(db, async transaction => {
    const article = await transaction.get(doc(db, "articles", slug));
    if (!article.exists() || article.data().status !== "published") throw new Error("This article is not published.");
    const createdAt = article.data().createdAt as Timestamp;
    const reference = doc(db, "articles", slug, kind, eventId(createdAt, visitorId));
    const existing = await transaction.get(reference);
    if (!existing.exists()) transaction.set(reference, { createdAt: serverTimestamp(), articleCreatedAt: createdAt });
  });
}
