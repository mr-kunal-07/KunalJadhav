import { ArrowRight } from "lucide-react";
import ArticleList from "@/components/ArticleList";
import SectionHeading from "@/components/SectionHeading";

export default function Articles() {
  return (
    <section id="articles" className="section-container" aria-labelledby="articles-heading">
      <div id="articles-heading">
        <SectionHeading title="Articles" subtitle="Notes, ideas, and lessons from building for the web." />
      </div>
      <ArticleList limit={3} />
      <div className="mt-8 flex justify-center">
        <a href="/articles" className="hero-button-outline">
          Explore articles <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
