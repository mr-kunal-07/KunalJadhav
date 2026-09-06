import { ArrowLeft } from "lucide-react";
import ArticleList from "@/components/ArticleList";
import ThemeToggle from "@/components/ThemeToggle";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <a href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} aria-hidden="true" /> Back to portfolio
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Kunal Jadhav · Writing</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Articles</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A place to share ideas, explore how things work, and reflect on the craft of building for the web.
        </p>
        <section className="mt-12 sm:mt-16" aria-labelledby="writing-heading">
          <h2 id="writing-heading" className="mb-5 text-lg font-semibold">From the notebook</h2>
          <ArticleList />
        </section>
        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          Have a topic in mind? <a href="/#contact" className="text-foreground underline underline-offset-4">Let’s talk.</a>
        </div>
      </main>
    </div>
  );
}
