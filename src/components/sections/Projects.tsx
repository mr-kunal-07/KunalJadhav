import { useRef } from "react";
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import projectSaas from "@/assets/project-saas.jpg";
import projectChat from "@/assets/project-chat.jpg";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => { if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } }); }, [controls, inView]);
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls} className={className}>{children}</motion.div>;
};

const PROJECTS = [
  {
    title: "StudyZone Learning Website",
    desc: "'StudyZone' is a fully responsive Educational Website developed using HTML, CSS, and JavaScript with 4 dynamic pages including Home, About, Courses, and Contact.",
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: '/pro/studyzone.webp',
    live: "https://studyzone1.vercel.app/",
    github: "https://github.com/mr-kunal-07/StudyZone",
  },
  {
    title: "SaaS Landing Page",
    desc: "A fully responsive SaaS landing page using Next.js, Tailwind CSS, TypeScript, and Framer Motion with smooth, visually appealing animations.",
    tags: ["Next JS", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: projectSaas,
    live: "https://saas-landing-demo.vercel.app",
    github: "https://github.com/mr-kunal-07/SaaS-Landing",
  },
  {
    title: "Chat Application",
    desc: "Real-time chat application using the MERN stack featuring Socket.io messaging, user authentication, private messaging, group chat, and message history.",
    tags: ["React JS", "Node JS", "MongoDB", "Socket.io", "Tailwind CSS"],
    image: projectChat,
    live: "https://chat-app-demo.vercel.app",
    github: "https://github.com/mr-kunal-07/Chat-App",
  },
];

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Projects = () => (
  <section id="projects" className="section-container">
    <AnimatedSection>
      <h2 className="section-title"><span className="gradient-text">Projects</span></h2>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-2 mt-2"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }} style={{ transformOrigin: "left" }}
      />
      <p className="section-subtitle">Here are some of my projects from my Web Development Journey.</p>
    </AnimatedSection>
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECTS.map((p, i) => (
        <AnimatedSection key={p.title}>
          <TiltCard className="glass-card flex flex-col h-full p-0 overflow-hidden group cursor-default">
            {/* Image */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Live Demo"
                >
                  <ExternalLink size={16} />
                </a>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-foreground/90 transition-colors">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
              </div>
            </div>
          </TiltCard>
        </AnimatedSection>
      ))}
    </div>
  </section>
);

export default Projects;
