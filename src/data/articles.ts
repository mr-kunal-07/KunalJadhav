export type ArticleInput = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  status: "draft" | "published";
};

// Firestore timestamps are normalized to milliseconds for display.
export type Article = ArticleInput & {
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};

export function makeSlug(title: string) {
  return title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/, "");
}

export function validateArticle(article: ArticleInput) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || article.slug.length > 80)
    throw new Error("Use a URL slug of up to 80 lowercase letters, numbers and hyphens.");
  for (const [field, max] of [["title", 120], ["summary", 320], ["category", 60], ["content", 200000]] as const) {
    if (!article[field].trim() || article[field].length > max)
      throw new Error(`${field[0].toUpperCase() + field.slice(1)} is required and must be at most ${max.toLocaleString()} characters.`);
  }
  if (!["draft", "published"].includes(article.status)) throw new Error("Choose draft or published.");
  return article;
}
