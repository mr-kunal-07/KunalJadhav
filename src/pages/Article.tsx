import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ArticleContent from "@/components/ArticleContent";
import ArticleStats from "@/components/ArticleStats";
import type { Article as ArticleData } from "@/data/articles";
import { articlesEnabled } from "@/hooks/useArticles";
import { SITE_URL } from "@/data/seo";

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const [result, setResult] = useState<{ slug: string; article: ArticleData | null; error?: boolean } | null>(null);
  const current = result?.slug === slug ? result : null;
  useEffect(() => {
    let active = true;
    if (!articlesEnabled) { setResult({ slug, article: null }); return; }
    void import("@/lib/articles").then(module => module.getArticle(slug))
      .then(article => { if (active) setResult({ slug, article }); })
      .catch(() => { if (active) setResult({ slug, article: null, error: true }); });
    return () => { active = false; };
  }, [slug]);
  useEffect(() => {
    if (!current) return;
    const article = current.article;
    const title = article ? `${article.title} | Kunal Jadhav` : "Article unavailable | Kunal Jadhav";
    const description = article?.summary ?? "This article is not available. Explore other articles by Kunal Jadhav.";
    document.title = title;
    for (const [selector, content] of [
      ['meta[name="description"]', description], ['meta[name="robots"]', article ? "index, follow, max-image-preview:large" : "noindex, follow"],
      ['meta[property="og:title"]', title], ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', `${SITE_URL}/articles/${slug}`], ['meta[property="og:type"]', "article"],
      ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', description],
    ]) document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}/articles/${slug}`);
    const schema = document.createElement("script");
    if (article) {
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.summary,
        url: `${SITE_URL}/articles/${slug}`, mainEntityOfPage: `${SITE_URL}/articles/${slug}`,
        datePublished: new Date(article.publishedAt!).toISOString(), dateModified: new Date(article.updatedAt).toISOString(),
        author: { "@type": "Person", name: "Kunal Jadhav", url: SITE_URL }, image: `${SITE_URL}/social/kunal-jadhav.jpg` });
      document.head.append(schema);
    }
    return () => { schema.remove(); };
  }, [current, slug]);
  return <main className="min-h-screen bg-background px-5 py-12 text-foreground"><div className="mx-auto max-w-3xl">
    <Link to="/articles" className="mb-12 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> All articles</Link>
    {!current ? <><h1 className="text-3xl font-semibold">Article</h1><p role="status" className="mt-5 text-muted-foreground">Loading article…</p></> : current.article ? <article>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{current.article.category}</p>
      <h1 className="mt-5 break-words text-4xl font-semibold leading-tight sm:text-5xl">{current.article.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{current.article.summary}</p>
      <p className="mb-10 mt-6 border-b border-border pb-8 text-sm text-muted-foreground">Kunal Jadhav · <time dateTime={new Date(current.article.publishedAt!).toISOString()}>{new Date(current.article.publishedAt!).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</time></p>
      <div className="mb-8"><ArticleStats key={current.article.slug} slug={current.article.slug} interactive trackView /></div>
      <ArticleContent content={current.article.content} />
    </article> : <><h1 className="text-3xl font-semibold">{current.error ? "Unable to load this article" : "Article not available"}</h1><p className="mt-5 text-muted-foreground">{current.error ? "Please check your connection and try again." : "It may have been removed or is not published yet."}</p><Link className="mt-6 inline-block underline" to="/articles">Explore articles</Link></>}
  </div></main>;
}
