import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";

// ─── Project Data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    title: "Multi AI",
    subtitle: "AI SaaS Toolbox",
    description:
      "An AI-powered SaaS platform used by 650+ people to edit images, review resumes with AI, and generate blog content. Built with React, Node.js, Gemini API, and OpenAI.",
    tags: ["React", "Node.js", "Gemini API", "OpenAI", "Tailwind CSS"],
    category: "AI",
    featured: true,
    live: "https://multi-ai.vercel.app",
    github: "https://github.com/mr-kunal-07/",
    stats: [
      { label: "Active Users", value: "650+" },
      { label: "AI Tools", value: "3+" },
    ],
    accent: "from-neutral-500/10 to-neutral-700/5",
  },
  {
    id: 2,
    title: "Oohpoint Platform",
    subtitle: "Founding Engineer · Full Stack",
    description:
      "Contributed as a Founding Engineer building scalable web infrastructure for an out-of-home advertising platform. Architected core APIs and dashboards used in production.",
    tags: ["React", "TypeScript", "Node.js", "REST API", "MongoDB"],
    category: "Full Stack",
    featured: true,
    live: "https://www.oohpoint.com",
    github: null,
    stats: [
      { label: "Role", value: "Founding Eng." },
      { label: "Scale", value: "Production" },
    ],
    accent: "from-neutral-400/10 to-neutral-600/5",
  },
  {
    id: 3,
    title: "KodxMedia",
    subtitle: "Media & Tech Studio",
    description:
      "A personal media and tech studio website showcasing creative and technical services. Built as a professional brand presence for digital and design-focused work.",
    tags: ["React", "Tailwind CSS", "Next.js"],
    category: "Frontend",
    featured: false,
    live: "https://www.kodxmedia.site",
    github: "https://github.com/mr-kunal-07/",
    stats: [
      { label: "Type", value: "Studio" },
      { label: "Stack", value: "Next.js" },
    ],
    accent: "from-neutral-300/10 to-neutral-500/5",
  },
  {
    id: 5,
    title: "StudyZone",
    subtitle: "Educational Platform",
    description:
      "A real-world educational website offering a comprehensive learning experience for users. Fully responsive, developed using HTML, CSS, and JavaScript with a content-first approach.",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
    featured: false,
    live: null,
    github: "https://github.com/mr-kunal-07/StudyZone",
    stats: [
      { label: "Type", value: "Ed-Tech" },
      { label: "Stack", value: "Vanilla JS" },
    ],
    accent: "from-neutral-500/10 to-neutral-300/5",
  },
  {
    id: 8,
    title: "Aptos Blockchain DApp",
    subtitle: "Web3 · #1 Rank among 1000+",
    description:
      "A decentralized application built on the Aptos blockchain during RiseIn's bootcamp — secured 1st place among 1000+ participants. Covers smart contract interaction and Move language fundamentals.",
    tags: ["Aptos", "Move", "React", "Web3"],
    category: "Web3",
    featured: false,
    live: null,
    github: "https://github.com/mr-kunal-07/",
    stats: [
      { label: "Rank", value: "#1" },
      { label: "Participants", value: "1000+" },
    ],
    accent: "from-neutral-300/10 to-neutral-500/5",
  },
];

const CATEGORIES = ["All", "AI", "Full Stack", "Web3", "Frontend"];

// ─── Animation Variants ───────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
};

// ─── Featured Card ────────────────────────────────────────────────────────────

const FeaturedCard = ({ project, index }: { project: typeof PROJECTS[0]; index: number }) => (
  <motion.div
    layout
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="group relative glass-card overflow-hidden flex flex-col justify-between min-h-[280px]"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-60 pointer-events-none`} />

    <div className="relative z-10 flex items-start justify-between gap-4">
      <div>
        <span className="tag-pill mb-3 inline-block">{project.category}</span>
        <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{project.subtitle}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" aria-label="Live"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>

    <p className="relative z-10 text-sm text-foreground/75 leading-relaxed mt-4 flex-1">{project.description}</p>

    <div className="relative z-10 mt-5 flex gap-6 border-t border-border pt-4">
      {project.stats.map((s) => (
        <div key={s.label}>
          <p className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
          <p className="text-[11px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
      {project.tags.map((tag) => (
        <span key={tag} className="tag-pill">{tag}</span>
      ))}
    </div>

    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-foreground/60 group-hover:w-full transition-all duration-500 ease-out" />
  </motion.div>
);

// ─── Compact Card ─────────────────────────────────────────────────────────────

const CompactCard = ({ project, index }: { project: typeof PROJECTS[0]; index: number }) => (
  <motion.div
    layout
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="group relative glass-card overflow-hidden flex flex-col gap-3"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-40 pointer-events-none`} />

    <div className="relative z-10 flex items-start justify-between gap-2">
      <div>
        <span className="tag-pill inline-block mb-2">{project.category}</span>
        <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{project.title}</h3>
        <p className="text-xs text-muted-foreground">{project.subtitle}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
            <Github className="w-3 h-3" />
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" aria-label="Live"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>

    <p className="relative z-10 text-sm text-foreground/70 leading-relaxed">{project.description}</p>

    <div className="relative z-10 flex gap-4 border-t border-border pt-3">
      {project.stats.map((s) => (
        <div key={s.label}>
          <p className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="relative z-10 flex flex-wrap gap-1">
      {project.tags.map((tag) => (
        <span key={tag} className="tag-pill text-[10px]">{tag}</span>
      ))}
    </div>

    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-foreground/40 group-hover:w-full transition-all duration-500 ease-out" />
  </motion.div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────

const Projects = () => {
  const [active, setActive] = useState("All");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);
  const featured = filtered.filter((p) => p.featured);
  const compact = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-container" ref={ref}>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title"><span className="gradient-text">Projects</span></h2>
        <motion.div
          className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-4 mt-2"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ transformOrigin: "left" }}
        />
        <p className="section-subtitle">
          A selection of things I've built — from AI SaaS to blockchain DApps and everything in between.
        </p>
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div key={active} className="space-y-4">



          {compact.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {compact.map((p, i) => <CompactCard key={p.id} project={p} index={featured.length + i} />)}
            </div>
          )}

          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((p, i) => <FeaturedCard key={p.id} project={p} index={i} />)}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* GitHub CTA */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <a href="https://github.com/mr-kunal-07/" target="_blank" rel="noreferrer"
          className="hero-button-outline group gap-2">
          <Github className="w-4 h-4" />
          View all 16+ repos on GitHub
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.div>

    </section>
  );
};

export default Projects;