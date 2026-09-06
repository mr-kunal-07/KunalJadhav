import { useEffect, useState } from "react";
import type { Article } from "@/data/articles";

export const articlesEnabled = import.meta.env.VITE_FIREBASE_ARTICLES_ENABLED === "true";
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(articlesEnabled);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!articlesEnabled) return;
    let active = true;
    void import("@/lib/articles").then(module => module.listArticles()).then(items => {
      if (active) setArticles(items);
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { articles, loading, error };
}
