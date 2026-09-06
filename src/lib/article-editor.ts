import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";

// Keep Compose output compatible with the public Markdown renderer and existing articles.
export function articleEditorExtensions() {
  return [
    StarterKit.configure({ underline: false, link: { openOnClick: false } }),
    Image.configure({ allowBase64: false }),
    Markdown,
  ];
}

export function validEditorUrl(value: string, image = false) {
  try {
    const url = new URL(value);
    return (image ? ["https:"] : ["https:", "http:", "mailto:"]).includes(url.protocol);
  } catch { return false; }
}
