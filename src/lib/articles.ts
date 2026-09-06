import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, where, type DocumentData } from "firebase/firestore";
import { db } from "./firebase";
import { validateArticle, type Article, type ArticleInput } from "@/data/articles";

function readArticle(slug: string, data: DocumentData): Article {
  return { slug, title: data.title, summary: data.summary, category: data.category,
    content: data.content, status: data.status, createdAt: data.createdAt?.toMillis() ?? 0,
    updatedAt: data.updatedAt?.toMillis() ?? 0, publishedAt: data.publishedAt?.toMillis() ?? null };
}

export async function listArticles(admin = false): Promise<Article[]> {
  const articles = collection(db, "articles");
  const request = admin ? query(articles, orderBy("updatedAt", "desc"))
    : query(articles, where("status", "==", "published"), orderBy("publishedAt", "desc"), limit(100));
  try {
    const snapshot = await getDocs(request);
    return snapshot.docs.map(item => readArticle(item.id, item.data()));
  } catch (error) {
    if (admin || (error as { code?: string })?.code !== "failed-precondition") throw error;
    // Keep the public status filter when the composite index is missing/building.
    // Sort all published results before limiting, so newer articles aren't omitted.
    const snapshot = await getDocs(query(articles, where("status", "==", "published")));
    return snapshot.docs.map(item => readArticle(item.id, item.data()))
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0) || b.slug.localeCompare(a.slug))
      .slice(0, 100);
  }
}

export async function getArticle(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) return null;
  const snapshot = await getDocs(query(collection(db, "articles"), where("slug", "==", slug), where("status", "==", "published"), limit(1)));
  return snapshot.empty ? null : readArticle(snapshot.docs[0].id, snapshot.docs[0].data());
}

export async function saveArticle(input: ArticleInput, isNew: boolean, expectedUpdatedAt?: number) {
  validateArticle(input);
  const reference = doc(db, "articles", input.slug);
  await runTransaction(db, async transaction => {
    const existing = await transaction.get(reference);
    if (isNew && existing.exists()) throw new Error("That URL slug is already used. Choose another one.");
    if (!isNew && !existing.exists()) throw new Error("This article was deleted. Reload the dashboard.");
    if (!isNew && existing.data()?.updatedAt?.toMillis() !== expectedUpdatedAt)
      throw new Error("This article changed in another session. Reopen it before saving.");
    transaction.set(reference, {
      ...input,
      createdAt: existing.data()?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: existing.data()?.publishedAt ?? (input.status === "published" ? serverTimestamp() : null),
    });
  });
  const saved = await getDoc(reference);
  return readArticle(saved.id, saved.data()!);
}

export async function deleteArticle(slug: string) { await deleteDoc(doc(db, "articles", slug)); }

export function articleError(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied") return "Access denied. Check your admin role and the Firestore rules in the Firebase setup guide.";
  if (code === "failed-precondition") return "Firestore needs the article index. Deploy firestore.indexes.json and wait for the index to finish building.";
  if (code === "unavailable") return "Cannot reach Firestore. Check your connection and try again.";
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
