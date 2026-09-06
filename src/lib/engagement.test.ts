import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getDoc: vi.fn(), getCountFromServer: vi.fn(), runTransaction: vi.fn(), set: vi.fn(), get: vi.fn() }));
vi.mock("./firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  collection: (_db: unknown, ...segments: string[]) => segments.join('/'),
  doc: (_db: unknown, ...segments: string[]) => segments.join('/'),
  query: (path: string, filter: unknown) => ({ path, filter }),
  where: (field: string, op: string, value: unknown) => ({ field, op, value }),
  getDoc: mocks.getDoc, getCountFromServer: mocks.getCountFromServer,
  runTransaction: mocks.runTransaction, serverTimestamp: () => 'SERVER_TIME',
}));
import { getVisitorId, readEngagement, recordEngagement } from './engagement';
const createdAt = { seconds: 100, nanoseconds: 500 };
const article = (status = 'published') => ({ exists: () => true, data: () => ({ status, createdAt }) });
beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear();
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-4111-8111-111111111111');
  mocks.runTransaction.mockImplementation(async (_db, callback) => callback({ get: mocks.get, set: mocks.set }));
});
describe('Article engagement', () => {
  it('keeps the same visitor ID across reloads', () => { expect(getVisitorId()).toBe(getVisitorId()); expect(crypto.randomUUID).toHaveBeenCalledTimes(1); });
  it('records a browser only once without changing the article', async () => {
    mocks.get.mockResolvedValueOnce(article()).mockResolvedValueOnce({ exists: () => false });
    await recordEngagement('hello', 'likes');
    expect(mocks.set).toHaveBeenCalledWith('articles/hello/likes/100-500-11111111-1111-4111-8111-111111111111', { createdAt: 'SERVER_TIME', articleCreatedAt: createdAt });
    mocks.get.mockResolvedValueOnce(article()).mockResolvedValueOnce({ exists: () => true });
    await recordEngagement('hello', 'likes');
    expect(mocks.set).toHaveBeenCalledTimes(1);
  });
  it('never records engagement for drafts', async () => {
    mocks.get.mockResolvedValueOnce(article('draft'));
    await expect(recordEngagement('hello', 'views')).rejects.toThrow('not published');
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it('counts only the current article generation and restores the liked state', async () => {
    mocks.getDoc.mockResolvedValueOnce(article()).mockResolvedValueOnce({ exists: () => true });
    mocks.getCountFromServer.mockResolvedValueOnce({ data: () => ({ count: 12 }) }).mockResolvedValueOnce({ data: () => ({ count: 3 }) });
    expect(await readEngagement('hello')).toEqual({ views: 12, likes: 3, liked: true });
    expect(mocks.getCountFromServer.mock.calls[0][0].filter).toEqual({ field: 'articleCreatedAt', op: '==', value: createdAt });
  });
});
