import { ArrowUpRight } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import ArticleStats from "@/components/ArticleStats";

const gridClass = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

export default function ArticleList({ limit }: { limit?: number }) {
  const { articles: allArticles, loading, error } = useArticles();
  const articles = limit === undefined ? allArticles : allArticles.slice(0, limit);

  if (loading) return <p role="status" className="rounded-2xl border border-border p-8 text-muted-foreground">Loading articles…</p>;
  if (error) return <p role="alert" className="rounded-2xl border border-border p-8 text-muted-foreground">Articles are temporarily unavailable. Please try again later.</p>;

  if (articles.length === 0) {
    return <p className="text-sm text-muted-foreground">No articles published yet.</p>;
  }

  return (
    <div className={gridClass}>
      {articles.map((article) => (
        <article key={article.slug} className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{article.category}</p>
          <h3 className="break-words text-xl font-semibold leading-snug">
            <a href={`/articles/${article.slug}`} className="inline-flex items-start gap-3 hover:underline">
              {article.title}<ArrowUpRight size={18} className="mt-1 shrink-0" aria-hidden="true" />
            </a>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
          <div className="mt-auto pt-6"><ArticleStats slug={article.slug} /></div>
        </article>
      ))}
    </div>
  );
}
