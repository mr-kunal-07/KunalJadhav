import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import ArticleEditor from "./ArticleEditor";

describe("Article editor state", () => {
  it("does not modify articles when opened, locked during save, or replaced", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onChange = vi.fn();
    try {
      await act(async () => root.render(<ArticleEditor value="## Original article" onChange={onChange} />));
      expect(container.querySelector('[role="textbox"]')?.textContent).toContain("Original article");
      expect(onChange).not.toHaveBeenCalled();
      await act(async () => root.render(<ArticleEditor value="## Original article" onChange={onChange} disabled />));
      expect(container.querySelector('[role="textbox"]')?.getAttribute("contenteditable")).toBe("false");
      expect(onChange).not.toHaveBeenCalled();
      await act(async () => root.render(<ArticleEditor value="A different article" onChange={onChange} />));
      expect(container.querySelector('[role="textbox"]')?.textContent).toContain("A different article");
      expect(onChange).not.toHaveBeenCalled();
    } finally {
      await act(async () => root.unmount());
      container.remove();
      vi.unstubAllGlobals();
    }
  });
});
