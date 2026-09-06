import { useCallback, useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
import type { Engagement } from "@/lib/engagement";

export default function ArticleStats({ slug, interactive = false, trackView = false }: { slug: string; interactive?: boolean; trackView?: boolean }) {
  const [stats, setStats] = useState<Engagement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const refresh = useCallback(async () => {
    const module = await import("@/lib/engagement");
    return module.readEngagement(slug);
  }, [slug]);

  useEffect(() => {
    let active = true;
    setStats(null); setUnavailable(false); setError("");
    const load = () => { void refresh().then(value => { if (active) { setStats(value); setUnavailable(false); } }).catch(() => { if (active) setUnavailable(true); }); };
    void (async () => {
      if (trackView) {
        try { const module = await import("@/lib/engagement"); await module.recordEngagement(slug, "views"); }
        catch { /* Readable counts remain useful when a view cannot be recorded. */ }
      }
      if (active) load();
    })();
    window.addEventListener("focus", load);
    return () => { active = false; window.removeEventListener("focus", load); };
  }, [slug, trackView, refresh]);

  async function like() {
    if (busy || stats?.liked) return;
    setBusy(true); setError("");
    try {
      const module = await import("@/lib/engagement");
      await module.recordEngagement(slug, "likes");
      setStats(await module.readEngagement(slug));
      setUnavailable(false);
    } catch { setError("Could not save your like. Please try again."); }
    finally { setBusy(false); }
  }

  const count = (value: number | undefined) => value === undefined ? "—" : value.toLocaleString("en-IN");
  return <span className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
    <span className="inline-flex items-center gap-1.5" title="Views counted once per browser"><Eye size={15} aria-hidden="true" />{count(stats?.views)} {stats?.views === 1 ? "view" : "views"}</span>
    {interactive ? <button type="button" onClick={() => void like()} disabled={busy || !stats || stats.liked} aria-pressed={stats?.liked ?? false}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm transition-colors hover:bg-secondary disabled:cursor-default ${stats?.liked ? "text-rose-500" : "text-foreground"}`}>
      <Heart size={17} fill={stats?.liked ? "currentColor" : "none"} aria-hidden="true" />
      {busy ? "Saving…" : stats?.liked ? "Liked" : "Like"} · {count(stats?.likes)}
    </button> : <span className="inline-flex items-center gap-1.5"><Heart size={15} aria-hidden="true" />{count(stats?.likes)} {stats?.likes === 1 ? "like" : "likes"}</span>}
    {unavailable && <span role="status">Counts unavailable</span>}
    {error && <span role="alert" className="basis-full text-red-600 dark:text-red-400">{error}</span>}
  </span>;
}
