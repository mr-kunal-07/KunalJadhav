import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageSeo, getStructuredData, SITE_URL } from "@/data/seo";

export default function PageSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = getPageSeo(pathname);
    document.title = page.title;
    const setMeta = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = content;
    };
    setMeta("name", "description", page.description);
    setMeta("name", "robots", page.robots);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:url", SITE_URL + page.path);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = SITE_URL + page.path;
    document.getElementById("profile-structured-data")?.remove();
    const data = getStructuredData(pathname);
    if (data) {
      const script = document.createElement("script");
      script.id = "profile-structured-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(data);
      document.head.append(script);
    }
  }, [pathname]);
  return null;
}
