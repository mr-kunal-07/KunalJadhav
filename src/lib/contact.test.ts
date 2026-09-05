import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContact, validateContact } from "./contact";

afterEach(() => vi.unstubAllGlobals());
describe("contact validation", () => {
  it("rejects empty, malformed, and out-of-bounds input", () => {
    expect(validateContact("name", " ")).toBe("Name is required.");
    expect(validateContact("name", "A")).toContain("at least 2");
    expect(validateContact("name", "<b>Test</b>")).toContain("invalid");
    expect(validateContact("email", "bad address@example.com")).toContain(
      "valid email",
    );
    expect(validateContact("email", "name@domain")).toContain("valid email");
    expect(validateContact("message", "short")).toContain("at least 10");
    expect(validateContact("message", "x".repeat(2001))).toContain("2000");
  });
  it("accepts valid Unicode names and the supported message boundary", () => {
    expect(validateContact("name", "  Kunal Jadhav  ")).toBe("");
    expect(validateContact("name", "कुणाल जाधव")).toBe("");
    expect(validateContact("email", "person+portfolio@example.com")).toBe("");
    expect(validateContact("message", "x".repeat(2000))).toBe("");
  });
});
describe("email API contract (mock transport; no real emails)", () => {
  const values = {
    name: " Test Visitor ",
    email: " visitor@example.com ",
    message: " A test message. ",
  };
  it("posts trimmed values and passes the cancellation signal", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    await sendContact(values, controller.signal);
    expect(fetchMock).toHaveBeenCalledWith("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Visitor",
        email: "visitor@example.com",
        message: "A test message.",
      }),
      signal: controller.signal,
    });
  });
  it("does not report success for a server rejection or unreadable error response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Please try later." }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("HTML response");
        },
      });
    vi.stubGlobal("fetch", fetchMock);
    await expect(sendContact(values)).rejects.toThrow("Please try later.");
    await expect(sendContact(values)).rejects.toThrow("Failed to send");
  });
  it("preserves network and cancellation failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );
    await expect(sendContact(values)).rejects.toMatchObject({
      name: "AbortError",
    });
  });
  it("rejects a static host's HTML fallback even when it returns HTTP 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error("Unexpected HTML"); },
    }));
    await expect(sendContact(values)).rejects.toThrow("Failed to send");
  });
});
