import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Home,
  User,
  Code,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Download,
  BookOpen,
} from "lucide-react";
import { FloatingDock } from "@/components/FloatingDock";
import ThemeToggle from "@/components/ThemeToggle";
import Hero from "@/components/sections/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Articles from "@/components/sections/Articles";
const SOCIALS = [
  {
    href: "https://www.x.com/kunaljadhav02",
    label: "Twitter",
    Icon: Twitter,
    headerOnly: true,
  },
  {
    href: "https://www.instagram.com/the.mr_kunal",
    label: "Instagram",
    Icon: Instagram,
  },
  { href: "https://github.com/mr-kunal-07", label: "GitHub", Icon: Github },
  {
    href: "https://www.linkedin.com/in/kunaltech",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: "mailto:dev.kunaljadhav@gmail.com", label: "Email", Icon: Mail },
];
function SocialLinks({ header = false }: { header?: boolean }) {
  return (
    <>
      {SOCIALS.filter((s) => header || !s.headerOnly).map(
        ({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={label}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
          >
            <Icon className="w-4 h-4" />
          </a>
        ),
      )}
    </>
  );
}
type InstallPrompt = Event & { prompt: () => Promise<void> };
function Header() {
  const prompt = useRef<InstallPrompt | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  useEffect(() => {
    const available = (event: Event) => {
      event.preventDefault();
      prompt.current = event as InstallPrompt;
      setCanInstall(true);
    };
    const installed = () => {
      prompt.current = null;
      setCanInstall(false);
    };
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  const install = async () => {
    if (!prompt.current) return;
    await prompt.current.prompt();
    prompt.current = null;
    setCanInstall(false);
  };
  return (
    <header className="py-6 w-full fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
        <a
          href="#"
          aria-label="Kunal Jadhav - Home"
          className="text-2xl font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="gradient-text">Kunal</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {canInstall && (
            <button
              onClick={install}
              aria-label="Install App"
              className="hero-button-primary gap-1.5 px-2.5 py-2 rounded-full"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-[0.8rem]">
                Install App
              </span>
            </button>
          )}
          <ThemeToggle />
          <SocialLinks header />
        </div>
      </div>
    </header>
  );
}
function FloatingNav() {
  const [bottom, setBottom] = useState(24);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top =
          document.querySelector("footer")?.getBoundingClientRect().top ??
          window.innerHeight;
        setBottom(Math.max(24, window.innerHeight - top - 20));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const scroll = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "instant"
      : "smooth";
    if (id === "home") window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior });
  };
  const items = [
    { title: "Home", Icon: Home, id: "home" },
    { title: "Experience", Icon: Briefcase, id: "experience" },
    { title: "About", Icon: User, id: "about" },
    { title: "Projects", Icon: Code, id: "projects" },
    { title: "Articles", Icon: BookOpen, id: "articles" },
    { title: "Contact", Icon: Mail, id: "contact" },
  ].map(({ title, Icon, id }) => ({
    title,
    icon: <Icon className="h-full w-full text-foreground" />,
    href: id === "home" ? "#" : "#" + id,
    onClick: () => scroll(id),
  }));
  return (
    <div
      aria-label="Main navigation"
      className="fixed left-1/2 -translate-x-1/2 z-50 transition-[bottom] duration-150 ease-out"
      style={{ bottom }}
    >
      <FloatingDock
        items={[
          ...items,
          {
            title: "GitHub",
            icon: <Github className="h-full w-full" />,
            href: "https://github.com/mr-kunal-07/",
            target: "_blank",
          },
          {
            title: "LinkedIn",
            icon: <Linkedin className="h-full w-full" />,
            href: "https://www.linkedin.com/in/kunaltech/",
            target: "_blank",
          },
        ]}
      />
    </div>
  );
}
export default function Index() {
  return (
    <div className="relative selection:bg-gray-100/20">
      <ScrollProgress />
      <Header />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content">
        <Hero />
        <Experience />
        <About />
        <Projects />
        <Articles />
        <Contact />
      </main>
      <FloatingNav />
      <BackToTop />
      <footer className="border-t border-border flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left sm:gap-6 px-6 py-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Kunal Jadhav. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
