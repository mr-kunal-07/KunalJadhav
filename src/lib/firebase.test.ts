import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: { name: "[DEFAULT]" },
  db: { type: "firestore" },
  analytics: { type: "analytics" },
  getApps: vi.fn(),
  initializeApp: vi.fn(),
  getFirestore: vi.fn(),
  isSupported: vi.fn(),
  getAnalytics: vi.fn(),
}));

vi.mock("firebase/app", () => ({ getApps: mocks.getApps, initializeApp: mocks.initializeApp }));
vi.mock("firebase/firestore", () => ({ getFirestore: mocks.getFirestore }));
vi.mock("firebase/analytics", () => ({ isSupported: mocks.isSupported, getAnalytics: mocks.getAnalytics }));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  mocks.getApps.mockReturnValue([]);
  mocks.initializeApp.mockReturnValue(mocks.app);
  mocks.getFirestore.mockReturnValue(mocks.db);
  mocks.isSupported.mockResolvedValue(true);
  mocks.getAnalytics.mockReturnValue(mocks.analytics);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Firebase startup", () => {
  it("initializes Firestore for the configured portfolio project", async () => {
    const { app, db } = await import("./firebase");
    expect(mocks.initializeApp).toHaveBeenCalledWith(expect.objectContaining({ projectId: "kunal-jadhav-portfolio" }));
    expect(mocks.getFirestore).toHaveBeenCalledWith(app);
    expect(db).toBe(mocks.db);
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
  });

  it("reuses the default app across module reloads", async () => {
    mocks.getApps.mockReturnValue([mocks.app]);
    const { app } = await import("./firebase");
    expect(app).toBe(mocks.app);
    expect(mocks.initializeApp).not.toHaveBeenCalled();
  });

  it("does not initialize Analytics during server rendering", async () => {
    vi.stubGlobal("window", undefined);
    const { initializeAnalytics } = await import("./firebase");
    expect(await initializeAnalytics()).toBeNull();
    expect(mocks.isSupported).not.toHaveBeenCalled();
  });

  it("skips Analytics in unsupported browsers", async () => {
    mocks.isSupported.mockResolvedValue(false);
    const { initializeAnalytics } = await import("./firebase");
    expect(await initializeAnalytics()).toBeNull();
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
  });

  it("initializes Analytics once for concurrent callers", async () => {
    const { initializeAnalytics } = await import("./firebase");
    const results = await Promise.all([initializeAnalytics(), initializeAnalytics()]);
    expect(results).toEqual([mocks.analytics, mocks.analytics]);
    expect(mocks.getAnalytics).toHaveBeenCalledTimes(1);
  });

  it("contains Analytics failures so callers can continue", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.isSupported.mockRejectedValue(new Error("Browser storage unavailable"));
    const { initializeAnalytics } = await import("./firebase");
    expect(await initializeAnalytics()).toBeNull();
    expect(mocks.getAnalytics).not.toHaveBeenCalled();
  });
});
