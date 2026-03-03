import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import {
  Globe, Trophy, GraduationCap, Briefcase,
  Home, User, Code, Mail, Github, Linkedin,
  Link,
  Download,
} from "lucide-react";
import { FloatingDock } from "@/components/FloatingDock";
import ThemeToggle from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import LoadingScreen from "@/components/LoadingScreen";
import StatsCounter from "@/components/StatsCounter";

// ========== ANIMATED SECTION ==========
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => { if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } }); }, [controls, inView]);
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls} className={className}>{children}</motion.div>;
};

// ========== HEADER ==========
const Header = () => {
  const promptRef = useRef<(Event & { prompt: () => Promise<void> }) | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as Event & { prompt: () => Promise<void> };
      setCanInstall(true);
    };
    const installed = () => setCanInstall(false);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const handleInstall = async () => {
    if (!promptRef.current) return;
    await promptRef.current.prompt();
    promptRef.current = null;
    setCanInstall(false);
  };

  return (
    <header className="py-6 w-full fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-medium" style={{ fontFamily: "var(--font-mono)" }}>
          <span className="gradient-text">Kunal</span>
        </a>
        <div className="flex items-center gap-2">

          {canInstall && (
            <button
              onClick={handleInstall}
              aria-label="Install App"
              className="hero-button-primary group gap-1.5 px-2.5 py-2 rounded-full"
            >
              <Download className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline text-[0.8rem]">Install App</span>
            </button>
          )}

          <ThemeToggle />
          <a href="https://github.com/mr-kunal-07/" target="_blank" rel="noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors hover:bg-accent">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/kunal-jadhav" target="_blank" rel="noreferrer" aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors hover:bg-accent">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="mailto:kunaljadhav@example.com" aria-label="Email"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors hover:bg-accent">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

// ========== ABOUT ME ==========
const AboutMe = () => (
  <section id="about" className="section-container">
    <AnimatedSection>
      <h2 className="section-title"><span className="gradient-text">About Me</span></h2>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-8 mt-2"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }} style={{ transformOrigin: "left" }}
      />
    </AnimatedSection>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <AnimatedSection>
        <div className="glass-card overflow-hidden p-0">
          <div className="relative group">
            <div className="aspect-square overflow-hidden">
              <img
                src="/pwa-192.png"
                alt="Kunal Jadhav portrait"
                loading="lazy"
                decoding="async"
                width="400"
                height="400"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Kunal Jadhav</h3>
                <p className="text-muted-foreground text-sm">Full Stack Developer</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-foreground/90 text-sm mb-4">
              Full Stack Developer focused on building scalable, high-performance, AI-powered software solutions.
              Startup enthusiast driven to take ideas from 0 &rarr; 1.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="about-stat">
                <div className="about-stat-value">5+</div>
                <div className="about-stat-label">Years of Experience</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-value">24+</div>
                <div className="about-stat-label">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="md:col-span-2">
        <div className="glass-card h-full">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-6">
              <p className="text-foreground/90">
                I&apos;m a Full Stack Developer with a passion for creating innovative and user-friendly applications.
                Currently working as a Software Developer & Founding Engineer at <a href="https://www.Oohpoint.com/" className="underline" target="_blank" rel="noreferrer">Oohpoint</a>.
                I&apos;ve worked on a wide range of projects, including web applications, mobile apps, and APIs.
                I&apos;ve also contributed to open source projects, helping others learn and grow.

              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Globe size={18} />, label: "Location", value: "Mumbai, India" },
                  { icon: <GraduationCap size={18} />, label: "Education", value: "BSc.CS - CSMU" },
                  { icon: <Briefcase size={18} />, label: "Focus", value: "Full Stack Development" },
                  { icon: <Trophy size={18} />, label: "Interests", value: "Web Dev, Open Source" },
                ].map((item) => (
                  <div key={item.label} className="info-item">
                    <div className="info-icon">{item.icon}</div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="education" className="space-y-4">
              <div className="border-l-2 border-border pl-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">Chhatrapati Shivaji Maharaj University</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">BSc.CS (Bachelor of Science in Computer Science) </p>
                  <p className="text-xs text-muted-foreground mt-1">Sep 2023 - Jun 2026</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">Swami Vivekanand Junior College</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">12th (Science, Maharashtra Board)</p>
                  <p className="text-xs text-muted-foreground mt-1">Sep 2022 - Jun 2023</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">St Joseph's High School</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">10th (Maharashtra Board)</p>
                  <p className="text-xs text-muted-foreground mt-1">Sep 2021 - Jun 2022</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="achievements" className="space-y-4">
              <div className="border-l-2 border-border pl-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">#1 Rank — Aptos Blockchain Bootcamp by RiseIn (2024) - <a href="https://www.linkedin.com/posts/kunaljadhav4295_blockchain-web3-aptosblockchain-activity-7259550141890633730-CQP_/" className="underline text-sm font-semibold text-foreground " target="_blank" rel="noreferrer">View Certificate</a>.</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Secured 1st place among 1000+ participants in RiseIn’s Aptos Blockchain Bootcamp, demonstrating strong expertise in Web3 development, smart contracts, and Aptos ecosystem fundamentals.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">Technical Lead — GDG On Campus CSMU (2024–25) - <a href="https://www.linkedin.com/posts/kunaljadhav4295_googledevelopergroups-gdgcsmu-leadership-activity-7341495796220985345-d2uB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEj5khoBv15O2XcetbX4mGVgGAHrhJVJsVQ" className="underline text-sm font-semibold text-foreground " target="_blank" rel="noreferrer">View Certificate</a>.</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Served as Technical Lead at GDG On Campus CSMU (2024–25), where I organized workshops, guided team members, and contributed to building an active student developer community.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-foreground -ml-[1.4rem]" />
                    <h4 className="font-semibold text-foreground">Multi AI — AI SaaS Toolbox - <a href="https://www.linkedin.com/posts/kunaljadhav4295_googledevelopergroups-gdgcsmu-leadership-activity-7341495796220985345-d2uB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEj5khoBv15O2XcetbX4mGVgGAHrhJVJsVQ" className="underline text-sm font-semibold text-foreground " target="_blank" rel="noreferrer"><Link className="w-3.5 h-3.5 inline mr-1 mb-0.5" />Live </a>.</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Created Multi AI, an AI SaaS platform used by 650+ people to edit images, review resumes with AI, and generate blog content. Built with React, Node.js, Gemini API, OpenAI.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedSection>
    </div>

    <StatsCounter />
    <Skills />
  </section>
);

// ========== FLOATING NAV ==========
const DOCK_HEIGHT = 40; // approximate height of FloatingDock in px
const DEFAULT_BOTTOM = 24; // bottom-6 = 24px

const FloatingNav = () => {
  const [bottomOffset, setBottomOffset] = useState(DEFAULT_BOTTOM);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    let ticking = false;

    const update = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const footerTop = footer.getBoundingClientRect().top;
          const viewportHeight = window.innerHeight;
          const stickyBottom = viewportHeight - footerTop - DOCK_HEIGHT / 2;

          setBottomOffset(
            stickyBottom > DEFAULT_BOTTOM ? stickyBottom : DEFAULT_BOTTOM
          );

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update(); // run once on mount

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const scrollToSection = (id: string) => {
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };


  const NAV_LINKS = [
    { title: "Home", icon: <Home className="h-full w-full text-foreground" />, href: "#", onClick: () => scrollToSection("top") },
    { title: "About", icon: <User className="h-full w-full text-foreground" />, href: "#about", onClick: () => scrollToSection("about") },
    { title: "Experience", icon: <Briefcase className="h-full w-full text-foreground" />, href: "#experience", onClick: () => scrollToSection("experience") },
    { title: "Projects", icon: <Code className="h-full w-full text-foreground" />, href: "#projects", onClick: () => scrollToSection("projects") },
    { title: "Contact", icon: <Mail className="h-full w-full text-foreground" />, href: "#contact", onClick: () => scrollToSection("contact") },
    { title: "GitHub", icon: <Github className="h-full w-full text-foreground" />, href: "https://github.com/mr-kunal-07/", target: "_blank" },
    { title: "LinkedIn", icon: <Linkedin className="h-full w-full text-foreground" />, href: "https://www.linkedin.com/in/kunaljadhav4295/", target: "_blank" },
  ];
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 transition-[bottom] duration-150 ease-out"
      style={{ bottom: bottomOffset }}
    >
      <FloatingDock items={NAV_LINKS} />
    </div>
  );
};


// ========== MAIN PAGE ==========
const Index = () => (
  <div className="relative selection:bg-gray-100/20">
    <LoadingScreen />
    <ScrollProgress />
    <Header />

    <main>
      <Hero />
      <AboutMe />
      <Experience />
      <Projects />
      <Contact />
    </main>

    <FloatingNav />
    <BackToTop />
    <footer
      className="
  border-t border-border 
  flex flex-col items-center gap-4 text-center
  sm:flex-row sm:justify-between sm:text-left sm:gap-6 px-6 py-6 
"
    >
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Kunal Jadhav. All rights reserved.
      </p>

      <div className="flex items-center gap-2">

        <ThemeToggle />
        <a
          href="https://github.com/mr-kunal-07/"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors duration-200 hover:bg-accent"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/kunaljadhav4295"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors duration-200 hover:bg-accent"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a
          href="mailto:dev.kunaljadhav@gmail.com"
          aria-label="Email"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors duration-200 hover:bg-accent"
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </footer>
  </div>
);

export default Index;
