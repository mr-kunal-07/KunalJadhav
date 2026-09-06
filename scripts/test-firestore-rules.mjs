import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import assert from "node:assert/strict";

if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Run through the Firestore emulator; these tests never target a live project.");
let environment;
const sample = (slug = "hello", status = "draft") => ({ slug, title: "Hello", summary: "A short summary", category: "React", content: "## Hello\nArticle body", status, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), publishedAt: status === "published" ? serverTimestamp() : null });
before(async () => {
  environment = await initializeTestEnvironment({ projectId: "demo-portfolio-admin", firestore: { rules: await readFile("firestore.rules", "utf8") } });
});
beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), "admins", "owner"), { role: "admin" }); });
});
after(async () => { await environment?.cleanup(); });
const owner = () => environment.authenticatedContext("owner").firestore();
const visitor = () => environment.unauthenticatedContext().firestore();
const outsider = () => environment.authenticatedContext("other-user").firestore();

test("public views and likes are append-only events on published articles", async () => {
  await setDoc(doc(owner(), "articles", "hello"), sample("hello", "published"));
  const articleCreatedAt = (await getDoc(doc(owner(), "articles", "hello"))).data().createdAt;
  const id = `${articleCreatedAt.seconds}-${articleCreatedAt.nanoseconds}-11111111-1111-4111-8111-111111111111`;
  for (const kind of ['views', 'likes']) {
    const event = doc(visitor(), "articles", "hello", kind, id);
    await assertSucceeds(getDoc(event));
    await assertSucceeds(setDoc(event, { createdAt: serverTimestamp(), articleCreatedAt }));
    await assertFails(setDoc(event, { createdAt: serverTimestamp(), articleCreatedAt }));
    await assertFails(deleteDoc(event));
    const count = await assertSucceeds(getCountFromServer(query(collection(visitor(), "articles", "hello", kind), where("articleCreatedAt", "==", articleCreatedAt))));
    assert.equal(count.data().count, 1);
    await assertSucceeds(deleteDoc(doc(owner(), "articles", "hello", kind, id)));
  }
});
test("engagement rejects drafts, missing articles, extra fields and forged creation dates", async () => {
  await setDoc(doc(owner(), "articles", "hello"), sample());
  const articleCreatedAt = (await getDoc(doc(owner(), "articles", "hello"))).data().createdAt;
  const id = `${articleCreatedAt.seconds}-${articleCreatedAt.nanoseconds}-11111111-1111-4111-8111-111111111111`;
  const event = doc(visitor(), "articles", "hello", "views", id);
  await assertFails(setDoc(event, { createdAt: serverTimestamp(), articleCreatedAt }));
  await assertFails(getCountFromServer(collection(visitor(), "articles", "hello", "views")));
  await assertFails(setDoc(doc(visitor(), "articles", "missing", "views", id), { createdAt: serverTimestamp(), articleCreatedAt }));
  await updateDoc(doc(owner(), "articles", "hello"), { status: 'published', publishedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await assertFails(setDoc(event, { createdAt: serverTimestamp(), articleCreatedAt, count: 999 }));
  await assertFails(setDoc(event, { createdAt: Timestamp.fromMillis(1), articleCreatedAt }));
  await assertFails(setDoc(event, { createdAt: serverTimestamp(), articleCreatedAt: Timestamp.fromMillis(1) }));
  await assertFails(setDoc(doc(visitor(), "articles", "hello", "other", id), { createdAt: serverTimestamp(), articleCreatedAt }));
});

test("owner can create, edit, publish, unpublish and delete; visitors see only published content", async () => {
  const reference = doc(owner(), "articles", "hello");
  await assertSucceeds(setDoc(reference, sample()));
  await assertFails(getDoc(doc(visitor(), "articles", "hello")));
  await assertFails(getDoc(doc(outsider(), "articles", "hello")));
  await assertSucceeds(updateDoc(reference, { title: "Updated", updatedAt: serverTimestamp() }));
  await assertSucceeds(updateDoc(reference, { status: "published", publishedAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  await assertSucceeds(getDoc(doc(visitor(), "articles", "hello")));
  await assertSucceeds(updateDoc(reference, { status: "draft", updatedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(visitor(), "articles", "hello")));
  await assertSucceeds(deleteDoc(reference));
});
test("public queries require published status; admin can list drafts", async () => {
  await setDoc(doc(owner(), "articles", "public"), sample("public", "published"));
  await setDoc(doc(owner(), "articles", "private"), sample("private"));
  await assertSucceeds(getDocs(query(collection(visitor(), "articles"), where("status", "==", "published"), orderBy("publishedAt", "desc"))));
  await assertSucceeds(getDocs(query(collection(visitor(), "articles"), where("slug", "==", "private"), where("status", "==", "published"))));
  await assertFails(getDocs(collection(visitor(), "articles")));
  await assertSucceeds(getDocs(collection(owner(), "articles")));
});
test("unauthenticated and non-admin accounts cannot create, edit or delete", async () => {
  await setDoc(doc(owner(), "articles", "hello"), sample("hello", "published"));
  for (const db of [visitor(), outsider()]) {
    await assertFails(setDoc(doc(db, "articles", "new"), sample("new")));
    await assertFails(updateDoc(doc(db, "articles", "hello"), { title: "Hijacked", updatedAt: serverTimestamp() }));
    await assertFails(deleteDoc(doc(db, "articles", "hello")));
  }
});
test("clients cannot grant themselves admin privileges or enumerate roles", async () => {
  await assertFails(setDoc(doc(outsider(), "admins", "other-user"), { role: "admin" }));
  await assertFails(setDoc(doc(owner(), "admins", "other-user"), { role: "admin" }));
  await assertFails(getDocs(collection(owner(), "admins")));
  await assertSucceeds(getDoc(doc(owner(), "admins", "owner")));
  await assertFails(getDoc(doc(outsider(), "admins", "owner")));
});
test("invalid fields, oversized/blank text, malformed slugs and forged timestamps fail", async () => {
  for (const changes of [{ title: " " }, { content: "\n\t" }, { summary: "x".repeat(321) }, { unexpected: true }, { slug: "different" }, { publishedAt: Timestamp.fromMillis(1) }, { createdAt: Timestamp.fromMillis(1) }, { status: "secret" }]) {
    await assertFails(setDoc(doc(owner(), "articles", "hello"), { ...sample(), ...changes }));
  }
  await assertFails(setDoc(doc(owner(), "articles", "Bad_slug"), sample("Bad_slug")));
  await setDoc(doc(owner(), "articles", "hello"), sample("hello", "published"));
  await assertFails(updateDoc(doc(owner(), "articles", "hello"), { createdAt: Timestamp.fromMillis(1), updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(owner(), "articles", "hello"), { publishedAt: Timestamp.fromMillis(1), updatedAt: serverTimestamp() }));
});
test("revoking an admin role prevents subsequent edits", async () => {
  const db = owner();
  await setDoc(doc(db, "articles", "hello"), sample());
  await environment.withSecurityRulesDisabled(async context => { await deleteDoc(doc(context.firestore(), "admins", "owner")); });
  await assertFails(updateDoc(doc(db, "articles", "hello"), { title: "Changed", updatedAt: serverTimestamp() }));
});
