import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ArticleContent from "./ArticleContent";
describe("Article rendering", () => {
  it("renders Markdown without executing HTML or unsafe links", () => {
    const html = renderToStaticMarkup(<ArticleContent content={'# Heading\n\n**Bold**\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)\n\n[safe](https://example.com)'} />);
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<strong>Bold</strong>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="https://example.com"');
  });
});
