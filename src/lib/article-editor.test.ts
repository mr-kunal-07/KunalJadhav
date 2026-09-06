import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import ArticleContent from "@/components/ArticleContent";
import { articleEditorExtensions, validEditorUrl } from "./article-editor";

describe("Visual article editor", () => {
  it("keeps headings, formatting, lists, links, images and code after reopening Markdown", () => {
    const body = '## A useful idea\n\n**Bold**, *italic* and ~~removed~~ with `code`.\n\n- First\n- Second\n\n1. One\n2. Two\n\n> A quote\n\n[Source](https://example.com/source)\n\n![An accessible description](https://example.com/photo.jpg)\n\n```js\nconst value = "<safe>";\n```\n\n---';
    const editor = new Editor({ extensions: articleEditorExtensions(), content: body, contentType: "markdown" });
    const markdown = editor.getMarkdown();
    editor.commands.setContent(markdown, { contentType: "markdown" });
    const html = renderToStaticMarkup(createElement(ArticleContent, { content: editor.getMarkdown() }));
    for (const piece of ['<h2>A useful idea</h2>', '<strong>Bold</strong>', '<em>italic</em>', '<del>removed</del>', '<ul>', '<ol>', '<blockquote>', 'href="https://example.com/source"', 'alt="An accessible description"', 'src="https://example.com/photo.jpg"', '<pre>', '&lt;safe&gt;', '<hr']) expect(html).toContain(piece);
    editor.destroy();
  });
  it("serializes visual changes and undo without changing the storage format", () => {
    const editor = new Editor({ extensions: articleEditorExtensions(), content: "Hello world", contentType: "markdown" });
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.toggleBold();
    expect(editor.getMarkdown()).toBe("**Hello** world");
    editor.commands.undo();
    expect(editor.getMarkdown()).toBe("Hello world");
    editor.destroy();
  });
  it("rejects script and embedded image URLs", () => {
    expect(validEditorUrl("javascript:alert(1)")).toBe(false);
    expect(validEditorUrl("data:image/svg+xml,test", true)).toBe(false);
    expect(validEditorUrl("https://example.com/image.png", true)).toBe(true);
    expect(validEditorUrl("mailto:hello@example.com")).toBe(true);
  });
});
