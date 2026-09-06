import { describe, expect, it } from "vitest";
import { makeSlug, validateArticle, type ArticleInput } from "./articles";
const valid: ArticleInput = { slug: "hello-react", title: "Hello React", summary: "A useful summary", category: "React", content: "Some content", status: "draft" };
describe("Article input boundaries", () => {
  it("produces readable, bounded URL slugs", () => {
    expect(makeSlug("  React & Café: What's new? ")).toBe("react-cafe-what-s-new");
    expect(makeSlug("long title ".repeat(40))).toHaveLength(80);
  });
  it("rejects path traversal, slashes, reserved characters and empty slugs", () => {
    for (const slug of ["", "../admin", "a/b", "A-title", "test?x=1", "test-", "a".repeat(81)])
      expect(() => validateArticle({ ...valid, slug })).toThrow();
  });
  it("requires useful content and enforces storage limits", () => {
    expect(() => validateArticle({ ...valid, content: " \n\t " })).toThrow();
    expect(() => validateArticle({ ...valid, title: "a".repeat(121) })).toThrow();
    expect(() => validateArticle({ ...valid, summary: "a".repeat(321) })).toThrow();
    expect(validateArticle(valid)).toEqual(valid);
  });
});
