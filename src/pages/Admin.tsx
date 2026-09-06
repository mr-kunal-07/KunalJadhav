import { useCallback, useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, BookOpen, LogOut, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { auth, isAdmin, loginAdmin, loginError, logoutAdmin } from "@/lib/admin";
import { articleError, deleteArticle, listArticles, saveArticle } from "@/lib/articles";
import { makeSlug, type Article, type ArticleInput } from "@/data/articles";
import ArticleContent from "@/components/ArticleContent";
import ArticleStats from "@/components/ArticleStats";
import ArticleEditor from "@/components/ArticleEditor";
import { articlesEnabled } from "@/hooks/useArticles";

const blank = (): ArticleInput => ({ slug: "", title: "", summary: "", category: "Development", content: "", status: "draft" });
const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-foreground/40 disabled:opacity-50";
const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50";

export default function Admin() {
  const [session, setSession] = useState<"checking" | "signed-out" | "admin">("checking");
  const [authError, setAuthError] = useState("");
  const [username, setUsername] = useState("kunal");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const current = ++generation;
      setSession(user ? "checking" : "signed-out");
      if (!user) return;
      try {
        const allowed = await isAdmin(user.uid);
        if (current !== generation) return;
        if (allowed) { setAuthError(""); setSession("admin"); }
        else { setAuthError("This account has no admin access. Add its UID to the admins collection using the setup guide."); await logoutAdmin(); }
      } catch (error) {
        if (current !== generation) return;
        setAuthError(articleError(error));
        await logoutAdmin();
      }
    });
    return () => { generation++; unsubscribe(); };
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault(); setSigningIn(true); setAuthError("");
    try { await loginAdmin(username, password); setPassword(""); }
    catch (error) { setAuthError(loginError(error)); }
    finally { setSigningIn(false); }
  }

  return <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
    <div className="mx-auto max-w-7xl">
      <a href="/" className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back to portfolio</a>
      {session === "admin" ? <Dashboard /> : <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-7 sm:p-10">
        <ShieldCheck className="mb-6" size={32} aria-hidden="true" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kunal’s workspace</p>
        <h1 className="mt-3 text-3xl font-semibold">Article admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A place to write, refine and share your ideas.</p>
        {session === "checking" ? <p role="status" className="mt-8">Checking your session…</p> : <form onSubmit={signIn} className="mt-8 space-y-5">
          <label className="block text-sm font-medium">Username<input className={`${inputClass} mt-2`} value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required disabled={signingIn} /></label>
          <label className="block text-sm font-medium">Password<input className={`${inputClass} mt-2`} type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required disabled={signingIn} /></label>
          <button className={`${buttonClass} w-full bg-foreground text-background hover:bg-foreground/90`} disabled={signingIn}>{signingIn ? "Signing in…" : "Sign in"}</button>
        </form>}
        {authError && <p role="alert" className="mt-5 text-sm text-red-600 dark:text-red-400">{authError}</p>}
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Private access for the portfolio owner.</p>
      </div>}
    </div>
  </main>;
}

function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState<ArticleInput | null>(null);
  const [selected, setSelected] = useState<Article | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try { setArticles(await listArticles(true)); }
    catch (problem) { setError(articleError(problem)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function open(article?: Article) {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setSelected(article ?? null); setEditor(article ? { slug: article.slug, title: article.title, summary: article.summary, category: article.category, content: article.content, status: article.status } : blank());
    setDirty(false); setPreview(false); setSlugEdited(!!article); setError(""); setNotice("");
  }
  function change(field: keyof ArticleInput, value: string) {
    if (!editor) return;
    setEditor({ ...editor, [field]: value, ...(field === "title" && !selected && !slugEdited ? { slug: makeSlug(value) } : {}) });
    if (field === "slug") setSlugEdited(true);
    setDirty(true); setNotice("");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editor) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await saveArticle(editor, !selected, selected?.updatedAt);
      setSelected(saved); setDirty(false);
      setArticles(items => [saved, ...items.filter(item => item.slug !== saved.slug)]);
      setNotice(saved.status === "published" ? "Article published." : "Draft saved. Only you can see it.");
    } catch (problem) { setError(articleError(problem)); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!selected || !window.confirm(`Permanently delete “${selected.title}”? This cannot be undone.`)) return;
    setBusy(true); setError("");
    try {
      await deleteArticle(selected.slug);
      setArticles(items => items.filter(item => item.slug !== selected.slug));
      setEditor(null); setSelected(null); setDirty(false); setNotice("Article deleted.");
    } catch (problem) { setError(articleError(problem)); }
    finally { setBusy(false); }
  }
  async function signOut() {
    if (dirty && !window.confirm("Sign out and discard your unsaved changes?")) return;
    try { await logoutAdmin(); } catch (problem) { setError(loginError(problem)); }
  }

  const published = articles.filter(article => article.status === "published").length;
  const visible = articles.filter(article => (filter === "all" || article.status === filter) && `${article.title} ${article.category}`.toLowerCase().includes(search.toLowerCase()));

  return <>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your writing desk</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Articles</h1><p className="mt-3 text-sm text-muted-foreground">{articles.length} total · {published} published · {articles.length - published} drafts</p></div>
      <div className="flex gap-3"><button className={buttonClass} onClick={() => void signOut()} disabled={busy}><LogOut size={16} /> Sign out</button><button className={`${buttonClass} bg-foreground text-background hover:bg-foreground/90`} onClick={() => open()} disabled={busy}><Plus size={16} /> New article</button></div>
    </header>
    {!articlesEnabled && <p className="mb-6 rounded-xl border border-border bg-secondary p-4 text-sm">Public articles are still in Coming soon mode. After Firebase setup, set VITE_FIREBASE_ARTICLES_ENABLED=true and rebuild the site.</p>}
    {error && <p role="alert" className="mb-5 rounded-xl border border-red-500/30 p-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
    {notice && <p role="status" className="mb-5 rounded-xl border border-border p-4 text-sm">{notice}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-border bg-card p-5" aria-label="Article library">
        <label className="relative block"><span className="sr-only">Search articles</span><Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" /><input className={`${inputClass} pl-9`} placeholder="Search articles…" value={search} onChange={event => setSearch(event.target.value)} /></label>
        <label className="mt-3 block"><span className="sr-only">Filter articles</span><select className={inputClass} value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All articles</option><option value="draft">Drafts</option><option value="published">Published</option></select></label>
        <div className="my-4 flex justify-between text-xs text-muted-foreground"><span>{visible.length} articles</span><button onClick={() => void refresh()} disabled={loading || busy} className="underline">Refresh</button></div>
        {loading ? <p role="status" className="py-6 text-sm text-muted-foreground">Loading articles…</p> : visible.length ? <ul className="space-y-2">{visible.map(article => <li key={article.slug}><button disabled={busy} onClick={() => open(article)} className={`w-full rounded-xl border p-4 text-left transition-colors hover:bg-secondary ${selected?.slug === article.slug ? "border-foreground/40 bg-secondary" : "border-border"}`}><span className="text-[11px] uppercase tracking-wider text-muted-foreground">{article.status}</span><span className="mt-2 block break-words text-sm font-medium">{article.title}</span><span className="mt-2 block text-xs text-muted-foreground">{new Date(article.updatedAt).toLocaleDateString()}</span><span className="mt-3 block"><ArticleStats slug={article.slug} /></span></button></li>)}</ul> : <p className="py-6 text-sm text-muted-foreground">{articles.length ? "No matching articles." : "Your next idea starts here. Create your first article."}</p>}
      </aside>
      {editor ? <form onSubmit={save} className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{selected ? "Edit article" : "New article"}{dirty && <span className="ml-2 text-xs font-normal text-muted-foreground">Unsaved</span>}</h2><button type="button" className={buttonClass} onClick={() => setPreview(!preview)}>{preview ? "Continue writing" : "Preview"}</button></div>
        <fieldset disabled={busy} className="space-y-5">
          {preview ? <div className="min-h-80"><p className="text-xs uppercase tracking-wider text-muted-foreground">{editor.category}</p><h2 className="my-4 break-words text-3xl font-semibold">{editor.title || "Untitled article"}</h2><p className="mb-8 text-muted-foreground">{editor.summary}</p><ArticleContent content={editor.content || "Start writing to see your preview."} /></div> : <>
            <label className="block text-sm font-medium">Title<input className={`${inputClass} mt-2`} value={editor.title} onChange={event => change("title", event.target.value)} maxLength={120} required /></label>
            <label className="block text-sm font-medium">URL slug<input className={`${inputClass} mt-2`} value={editor.slug} onChange={event => change("slug", event.target.value)} disabled={!!selected || busy} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" required /><span className="mt-2 block break-all text-xs font-normal text-muted-foreground">/articles/{editor.slug || "your-article"}{selected ? " · URL stays fixed after creation." : " · Generated from the title, or choose your own."}</span></label>
            <label className="block text-sm font-medium">Category<input className={`${inputClass} mt-2`} value={editor.category} onChange={event => change("category", event.target.value)} maxLength={60} required /></label>
            <label className="block text-sm font-medium">Summary<textarea className={`${inputClass} mt-2`} rows={3} value={editor.summary} onChange={event => change("summary", event.target.value)} maxLength={320} required /><span className="mt-2 block text-xs font-normal text-muted-foreground">Used on article cards and in the search description.</span></label>
            <ArticleEditor key={selected?.slug ?? "new"} value={editor.content} onChange={value => change("content", value)} disabled={busy} />
          </>}
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5"><label className="text-sm font-medium">Visibility<select className={`${inputClass} mt-2`} value={editor.status} onChange={event => change("status", event.target.value)}><option value="draft">Draft — private</option><option value="published">Published — public</option></select></label><button className={`${buttonClass} bg-foreground text-background hover:bg-foreground/90`} disabled={busy}>{busy ? "Saving…" : editor.status === "published" ? "Save & publish" : "Save draft"}</button></div>
          {selected && <div className="flex flex-wrap items-center justify-between gap-4 pt-3">{selected.status === "published" && articlesEnabled ? <a href={`/articles/${selected.slug}`} target="_blank" rel="noreferrer" className="text-sm underline">View public article</a> : <span className="text-xs text-muted-foreground">{selected.status === "draft" ? "This draft is private." : "Public display is not enabled yet."}</span>}<button type="button" className={`${buttonClass} text-red-600 dark:text-red-400`} onClick={() => void remove()} disabled={busy}><Trash2 size={15} /> Delete</button></div>}
        </fieldset>
      </form> : <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center"><BookOpen size={32} className="mb-5 text-muted-foreground" /><h2 className="text-xl font-semibold">Make room for your next idea.</h2><p className="mt-3 max-w-sm text-sm text-muted-foreground">Choose an article to edit, or start a new draft. Publish whenever you’re ready.</p><button className={`${buttonClass} mt-6`} onClick={() => open()}><Plus size={16} /> Write an article</button></div>}
    </div>
  </>;
}
