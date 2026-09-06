import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getDocs: vi.fn() }));
vi.mock("./firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  collection: (_db: unknown, path: string) => path,
  query: (path: string, ...constraints: unknown[]) => ({ path, constraints }),
  where: (field: string, op: string, value: string) => ({ field, op, value }),
  orderBy: (field: string, direction: string) => ({ field, direction }),
  limit: (count: number) => ({ limit: count }),
  getDocs: mocks.getDocs,
  deleteDoc: vi.fn(), doc: vi.fn(), getDoc: vi.fn(), runTransaction: vi.fn(), serverTimestamp: vi.fn(),
}));
import { listArticles } from "./articles";
const snapshot = (times: number[]) => ({ docs: times.map(time => ({ id: `article-${time}`, data: () => ({ status: "published", publishedAt: { toMillis: () => time } }) })) });
beforeEach(() => vi.clearAllMocks());

describe("Public article queries", () => {
  it("falls back to a published-only query and returns the newest 100 without an index", async () => {
    mocks.getDocs.mockRejectedValueOnce({ code: "failed-precondition" })
      .mockResolvedValueOnce(snapshot(Array.from({ length: 103 }, (_, index) => index + 1)));
    const result = await listArticles();
    expect(mocks.getDocs.mock.calls[1][0]).toEqual({ path: "articles", constraints: [{ field: "status", op: "==", value: "published" }] });
    expect(result).toHaveLength(100);
    expect(result[0].publishedAt).toBe(103);
    expect(result[99].publishedAt).toBe(4);
  });
  it("does not retry permission errors with a broader query", async () => {
    mocks.getDocs.mockRejectedValueOnce({ code: "permission-denied" });
    await expect(listArticles()).rejects.toEqual({ code: "permission-denied" });
    expect(mocks.getDocs).toHaveBeenCalledTimes(1);
  });
  it("uses one bounded query when the index is ready", async () => {
    mocks.getDocs.mockResolvedValueOnce(snapshot([20, 10]));
    expect((await listArticles()).map(article => article.publishedAt)).toEqual([20, 10]);
    expect(mocks.getDocs).toHaveBeenCalledTimes(1);
  });
  it("does not silently turn an admin request into a public list", async () => {
    mocks.getDocs.mockRejectedValueOnce({ code: "failed-precondition" });
    await expect(listArticles(true)).rejects.toEqual({ code: "failed-precondition" });
    expect(mocks.getDocs).toHaveBeenCalledTimes(1);
  });
});
