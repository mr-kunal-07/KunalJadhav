import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, CodeXml, Link2, Unlink, ImagePlus, Minus, Undo2, Redo2, Eraser, Pencil, Eye } from "lucide-react";
import { articleEditorExtensions, validEditorUrl } from "@/lib/article-editor";
import ArticleContent from "@/components/ArticleContent";

type Props = { value: string; onChange: (value: string) => void; disabled?: boolean };
const field = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30";

export default function ArticleEditor({ value, onChange, disabled = false }: Props) {
  const [mode, setMode] = useState<"compose" | "source" | "preview">("compose");
  const [insert, setInsert] = useState<"link" | "image" | null>(null);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const lastValue = useRef(value);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const editor = useEditor({
    extensions: articleEditorExtensions(),
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editable: !disabled,
    editorProps: { attributes: { class: "article-content min-h-[420px] px-5 py-6 sm:px-8 outline-none", role: "textbox", "aria-label": "Article body", "aria-multiline": "true", spellcheck: "true" } },
    onUpdate: ({ editor: current }) => {
      const markdown = current.isEmpty ? "" : current.getMarkdown();
      lastValue.current = markdown;
      onChange(markdown);
    },
  });

  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);
  useEffect(() => {
    if (editor && mode === "compose" && value !== lastValue.current) {
      editor.commands.setContent(value, { contentType: "markdown", emitUpdate: false });
      lastValue.current = value;
    }
  }, [editor, value, mode]);
  useEffect(() => { if (mode === "source") sourceRef.current?.focus(); }, [mode]);

  function tool(label: string, icon: ReactNode, action: () => void, active = false, unavailable = false) {
    return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled || unavailable || !editor} onMouseDown={event => event.preventDefault()} onClick={action} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-30 ${active ? "bg-foreground text-background" : "hover:bg-secondary"}`}>{icon}</button>;
  }
  function showInsert(kind: "link" | "image") {
    setInsert(kind); setError("");
    setUrl(kind === "link" ? editor?.getAttributes("link").href ?? "" : "");
    setDescription(kind === "link" && editor ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " ") : "");
  }
  function applyInsert() {
    if (!editor || !insert) return;
    const address = url.trim();
    if (!validEditorUrl(address, insert === "image")) { setError(insert === "image" ? "Enter a full HTTPS image URL." : "Enter a full web URL or mailto: email link."); return; }
    if (insert === "image" && !description.trim()) { setError("Add a short image description for accessibility."); return; }
    if (insert === "image") editor.chain().focus().setImage({ src: address, alt: description.trim() }).run();
    else if (editor.state.selection.empty && !editor.isActive("link")) editor.chain().focus().insertContent({ type: "text", text: description.trim() || address, marks: [{ type: "link", attrs: { href: address } }] }).run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: address }).run();
    setInsert(null); setError("");
  }

  const words = value.trim() ? value.trim().split(/\s+/u).length : 0;
  return <section aria-label="Article body editor">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-medium">Article body</h3><span className="text-xs text-muted-foreground">Write it your way.</span></div>
    <div className="overflow-hidden rounded-xl border border-border bg-background focus-within:border-foreground/40">
      <div className="flex flex-wrap gap-1 border-b border-border bg-secondary/40 p-2" aria-label="Editor view">
        {([ ["compose", Pencil, "Compose"], ["source", CodeXml, "Markdown"], ["preview", Eye, "Preview"] ] as const).map(([view, Icon, label]) => <button key={view} type="button" disabled={disabled} aria-pressed={mode === view} onClick={() => { setMode(view); setInsert(null); }} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${mode === view ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon size={15} />{label}</button>)}
      </div>
      {mode === "compose" && <>
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2" role="group" aria-label="Text formatting">
          {tool("Undo", <Undo2 size={17} />, () => editor?.chain().focus().undo().run(), false, !editor?.can().undo())}
          {tool("Redo", <Redo2 size={17} />, () => editor?.chain().focus().redo().run(), false, !editor?.can().redo())}
          <select aria-label="Paragraph style" disabled={disabled || !editor} value={editor?.isActive("codeBlock") ? "code" : editor?.isActive("heading") ? String(editor.getAttributes("heading").level) : "paragraph"} onChange={event => {
            const style = event.target.value;
            if (style === "paragraph") editor?.chain().focus().setParagraph().run();
            else if (style === "code") editor?.chain().focus().setCodeBlock().run();
            else editor?.chain().focus().setHeading({ level: Number(style) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
          }} className="mx-1 h-10 max-w-[150px] rounded-lg border border-border bg-background px-2 text-sm"><option value="paragraph">Paragraph</option><option value="1">Heading 1</option><option value="2">Heading 2</option><option value="3">Heading 3</option><option value="4">Heading 4</option><option value="5">Heading 5</option><option value="6">Heading 6</option><option value="code">Code block</option></select>
          {tool("Bold (Ctrl+B)", <Bold size={17} />, () => editor?.chain().focus().toggleBold().run(), editor?.isActive("bold"))}
          {tool("Italic (Ctrl+I)", <Italic size={17} />, () => editor?.chain().focus().toggleItalic().run(), editor?.isActive("italic"))}
          {tool("Strikethrough", <Strikethrough size={17} />, () => editor?.chain().focus().toggleStrike().run(), editor?.isActive("strike"))}
          {tool("Inline code", <Code size={17} />, () => editor?.chain().focus().toggleCode().run(), editor?.isActive("code"))}
          {tool("Bulleted list", <List size={17} />, () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive("bulletList"))}
          {tool("Numbered list", <ListOrdered size={17} />, () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive("orderedList"))}
          {tool("Quote", <Quote size={17} />, () => editor?.chain().focus().toggleBlockquote().run(), editor?.isActive("blockquote"))}
          {tool("Insert or edit link", <Link2 size={17} />, () => showInsert("link"), editor?.isActive("link"))}
          {tool("Remove link", <Unlink size={17} />, () => editor?.chain().focus().extendMarkRange("link").unsetLink().run(), false, !editor?.isActive("link"))}
          {tool("Insert image", <ImagePlus size={17} />, () => showInsert("image"))}
          {tool("Divider", <Minus size={17} />, () => editor?.chain().focus().setHorizontalRule().run())}
          {tool("Clear formatting", <Eraser size={17} />, () => editor?.chain().focus().unsetAllMarks().clearNodes().run())}
        </div>
        {insert && <div className="space-y-3 border-b border-border bg-secondary/30 p-4" role="group" aria-label={insert === "image" ? "Add image" : "Add link"} onKeyDown={event => {
          if (event.key === "Enter") { event.preventDefault(); applyInsert(); }
          if (event.key === "Escape") { event.preventDefault(); setInsert(null); editor?.commands.focus(); }
        }}>
          <p className="text-sm font-medium">{insert === "image" ? "Insert an image" : "Insert or edit a link"}</p>
          <label className="block text-xs">{insert === "image" ? "Image URL (HTTPS)" : "Link URL"}<input autoFocus type="url" value={url} onChange={event => setUrl(event.target.value)} className={`${field} mt-1`} placeholder="https://…" /></label>
          <label className="block text-xs">{insert === "image" ? "Image description (alt text)" : "Text (used when inserting a new link)"}<input value={description} onChange={event => setDescription(event.target.value)} className={`${field} mt-1`} /></label>
          {insert === "image" && <p className="text-xs text-muted-foreground">Use a publicly hosted image URL.</p>}
          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2"><button type="button" onClick={applyInsert} className="rounded-lg bg-foreground px-4 py-2 text-sm text-background">Insert</button><button type="button" onClick={() => { setInsert(null); editor?.commands.focus(); }} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button></div>
        </div>}
      </>}
      <div hidden={mode !== "compose"} className="blog-editor"><EditorContent editor={editor} /></div>
      {mode === "source" && <textarea ref={sourceRef} aria-label="Article body Markdown source" className="min-h-[420px] w-full resize-y bg-background px-5 py-6 font-mono text-sm leading-relaxed outline-none sm:px-8" value={value} onChange={event => onChange(event.target.value)} maxLength={200000} disabled={disabled} placeholder="Share what you learned…" />}
      {mode === "preview" && <div className="min-h-[420px] px-5 py-6 sm:px-8"><ArticleContent content={value || "Your article preview will appear here."} /></div>}
      <div className="flex flex-wrap justify-between gap-2 border-t border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground"><span>{words.toLocaleString()} words · {words ? Math.max(1, Math.ceil(words / 200)) : 0} min read</span><span>{value.length.toLocaleString()} / 200,000 characters</span></div>
    </div>
    {value.length > 200000 && <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">The article is too long to save. Please shorten it to 200,000 characters.</p>}
  </section>;
}
