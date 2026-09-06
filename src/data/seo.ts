export const SITE_URL = "https://kunaltech.vercel.app";
export const SEO_PAGES = {
  "/admin": {
    title: "Article Admin | Kunal Jadhav",
    description: "Private article management for Kunal Jadhav’s portfolio. Sign in to create drafts, edit your writing and manage published articles.",
    path: "/admin",
    robots: "noindex, nofollow",
  },
  "/": {
    title: "Kunal Jadhav | Full Stack & React Developer in Mumbai",
    description: "Explore Kunal Jadhav’s portfolio: a Mumbai-based Full Stack Developer working at IDSSPL. Discover React, Next.js and Node.js projects, experience and contact details.",
    path: "/",
    robots: "index, follow, max-image-preview:large",
  },
  "/kunal-resume": {
    title: "Kunal Jadhav Resume | Full Stack Developer",
    description: "View and download Kunal Jadhav’s résumé. Explore his full-stack development skills, professional experience and projects, or visit his portfolio to get in touch.",
    path: "/kunal-resume",
    robots: "index, follow, max-image-preview:large",
  },
  "/404": {
    title: "Page Not Found | Kunal Jadhav",
    description: "This page could not be found. Visit Kunal Jadhav’s portfolio for projects, experience and contact information.",
    path: "/404",
    robots: "noindex, follow",
  },
  "/articles": {
    title: "Articles | Kunal Jadhav",
    description: "Explore Kunal Jadhav’s articles on frontend development, web performance, and lessons from building for the web. Read practical notes, ideas and experiences.",
    path: "/articles",
    robots: "index, follow, max-image-preview:large",
  },
};
export function getPageSeo(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    return { ...SEO_PAGES["/articles"], title: "Article | Kunal Jadhav", path };
  }
  return SEO_PAGES[path as keyof typeof SEO_PAGES] ?? SEO_PAGES["/404"];
}
export function getStructuredData(pathname: string) {
  if (getPageSeo(pathname).path !== "/") return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Kunal Jadhav",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/hero/developer-768.webp`,
        jobTitle: "Front-End Developer",
        description: "Full Stack Developer based in Mumbai, currently working at IDSSPL Technologies Pvt. Ltd.",
        worksFor: { "@type": "Organization", name: "IDSSPL Technologies Pvt. Ltd.", url: "https://www.idsspl.com/" },
        homeLocation: { "@type": "Place", name: "Mumbai, India" },
        knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Full Stack Development"],
        sameAs: ["https://github.com/mr-kunal-07", "https://www.linkedin.com/in/kunaltech", "https://www.instagram.com/the.mr_kunal", "https://x.com/kunaljadhav02"],
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Kunal Jadhav — Developer Portfolio", inLanguage: "en", publisher: { "@id": `${SITE_URL}/#person` } },
      { "@type": "ProfilePage", "@id": `${SITE_URL}/#profile`, url: `${SITE_URL}/`, name: SEO_PAGES["/"].title, description: SEO_PAGES["/"].description, mainEntity: { "@id": `${SITE_URL}/#person` }, isPartOf: { "@id": `${SITE_URL}/#website` }, inLanguage: "en" },
    ],
  };
}
