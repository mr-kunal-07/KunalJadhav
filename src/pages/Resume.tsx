import { Download, ExternalLink, FileText } from "lucide-react";
export default function Resume() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-20 space-y-5">
        <a href="/" className="inline-block text-sm underline underline-offset-4">← Back to Kunal’s portfolio</a>
        <header className="glass-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <FileText size={20} />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-none text-foreground truncate">
                Kunal <span className="gradient-text">Jadhav</span>
              </h1>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <span className="tag-pill">Full-Stack Developer</span>
                <span
                  className="text-[11px] text-muted-foreground font-mono"
                  title="File: Kunal_Jadhav_Resume.pdf"
                >
                  Kunal_Jadhav_Resume.pdf
                </span>
              </div>
            </div>
          </div>
          <nav
            aria-label="Resume actions"
            className="flex gap-2 w-full sm:w-auto"
          >
            <a
              href="/Kunal.pdf"
              download="Kunal_Jadhav_Resume.pdf"
              aria-label="Download Kunal_Jadhav_Resume.pdf"
              className="hero-button-primary flex-1 sm:flex-none justify-center"
            >
              <Download size={16} />
              Download PDF
            </a>
            <a
              href="/Kunal.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume in new tab"
              className="hero-button-outline !p-2.5 shrink-0"
            >
              <ExternalLink size={16} />
            </a>
          </nav>
        </header>
        <div className="rounded-xl overflow-hidden border border-border bg-card">
          <iframe
            src="/Kunal.pdf#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
            title="Kunal Jadhav — Resume"
            aria-label="Resume PDF viewer"
            className="block w-full h-[clamp(460px,80vh,900px)] border-none"
          />
        </div>
      </div>
    </main>
  );
}
