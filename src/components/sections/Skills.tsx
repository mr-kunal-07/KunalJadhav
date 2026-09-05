import React, { memo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// ── react-icons/si — verified correct export names ───────────────────────────
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiRedux,
  SiRedis,
  SiVercel,
  SiDocker,
  SiFirebase,
} from "react-icons/si";

// ── lucide-react — concept / abstract icons only ─────────────────────────────
import {
  Network,
  Shield,
  Key,
  Lock,
  Globe,
  Radio,
  Database,
  TrendingUp,
  BookOpen,
  Layers,
  Rocket,
  Gauge,
  Eye,
  Scissors,
  Image,
  Activity,
  Zap,
  Brain,
  TreePine,
  Code2,
  Bell,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SkillItem {
  label: string;
  icon: React.ReactElement;
  color: string;
}

interface SkillCategory {
  category: string;
  headerIcon: React.ReactElement;
  headerColor: string;
  headerBg: string;
  items: SkillItem[];
}

const S = 13;
const skill = (
  label: string,
  icon: React.ReactElement,
  color: string,
): SkillItem => ({ label, icon, color });

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS DATA
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS: SkillCategory[] = [
  {
    category: "Core Stack",
    headerIcon: <Rocket size={22} />,
    headerColor: "text-orange-400",
    headerBg: "bg-orange-400/10",
    items: [
      skill("JavaScript", <SiJavascript size={S} />, "#F7DF1E"),
      skill("TypeScript", <SiTypescript size={S} />, "#3178C6"),
      skill("React JS", <SiReact size={S} />, "#61DAFB"),
      skill("Next JS", <SiNextdotjs size={S} />, "#FFFFFF"),
      skill("Node JS", <SiNodedotjs size={S} />, "#339933"),
      skill("Express JS", <SiExpress size={S} />, "#CCCCCC"),
      skill("REST APIs", <Network size={S} />, "#6BA539"),
      skill("MongoDB", <SiMongodb size={S} />, "#47A248"),
      skill("Git", <SiGit size={S} />, "#F05032"),
    ],
  },
  {
    category: "Frontend",
    headerIcon: <SiReact size={22} color="#61DAFB" />,
    headerColor: "text-blue-400",
    headerBg: "bg-blue-400/10",
    items: [
      skill("HTML", <SiHtml5 size={S} />, "#E34F26"),
      skill("CSS", <SiCss size={S} />, "#1572B6"),
      skill("Tailwind CSS", <SiTailwindcss size={S} />, "#06B6D4"),
      skill("Redux Toolkit", <SiRedux size={S} />, "#764ABC"),
      skill("PWA", <Globe size={S} />, "#5A0FC8"),
    ],
  },
  {
    category: "Backend",
    headerIcon: <SiNodedotjs size={22} color="#339933" />,
    headerColor: "text-green-400",
    headerBg: "bg-green-400/10",
    items: [
      skill("REST API Design", <Network size={S} />, "#6BA539"),
      skill("WebSockets", <Radio size={S} />, "#848484"),
      skill("Authentication", <Lock size={S} />, "#607D8B"),
      skill("Authorization", <Shield size={S} />, "#607D8B"),
      skill("JWT", <Key size={S} />, "#D63AFF"),
      skill("OAuth", <Key size={S} />, "#4285F4"),
      skill("Webhooks", <Bell size={S} />, "#FF9800"),
    ],
  },
  {
    category: "Cloud & DevOps",
    headerIcon: <SiDocker size={22} color="#2496ED" />,
    headerColor: "text-cyan-400",
    headerBg: "bg-cyan-400/10",
    items: [
      skill("Docker", <SiDocker size={S} />, "#2496ED"),
      skill("Vercel", <SiVercel size={S} />, "#FFFFFF"),
    ],
  },
  {
    category: "Databases",
    headerIcon: <Database size={22} />,
    headerColor: "text-indigo-400",
    headerBg: "bg-indigo-400/10",
    items: [
      skill("Firebase", <SiFirebase size={S} />, "#FFCA28"),
      skill("MongoDB", <SiMongodb size={S} />, "#47A248"),
      skill("PostgreSQL", <SiPostgresql size={S} />, "#4169E1"),
    ],
  },
  {
    category: "System Design",
    headerIcon: <Layers size={22} />,
    headerColor: "text-purple-400",
    headerBg: "bg-purple-400/10",
    items: [
      skill("MVC", <Layers size={S} />, "#78909C"),
      skill("Event Driven Architecture", <Zap size={S} />, "#FFA726"),
      skill("RESTful Architecture", <Network size={S} />, "#6BA539"),
      skill("Scalable Systems", <TrendingUp size={S} />, "#42A5F5"),
      skill("Design Patterns", <BookOpen size={S} />, "#8D6E63"),
    ],
  },
  {
    category: "Performance",
    headerIcon: <Gauge size={22} />,
    headerColor: "text-amber-400",
    headerBg: "bg-amber-400/10",
    items: [
      skill("Performance Optimization", <Gauge size={S} />, "#FFCA28"),
      skill("Lazy Loading", <Eye size={S} />, "#42A5F5"),
      skill("Code Splitting", <Scissors size={S} />, "#FF7043"),
      skill("Image Optimization", <Image size={S} />, "#26C6DA"),
      skill("Caching", <SiRedis size={S} />, "#FF4438"),
      skill("Core Web Vitals", <Activity size={S} />, "#4285F4"),
    ],
  },
  {
    category: "Software Engineering",
    headerIcon: <Code2 size={22} />,
    headerColor: "text-violet-400",
    headerBg: "bg-violet-400/10",
    items: [
      skill("Algorithms", <Brain size={S} />, "#AB47BC"),
      skill("Data Structures", <TreePine size={S} />, "#66BB6A"),
      skill("OOP", <Layers size={S} />, "#42A5F5"),
      skill("Functional Programming", <Code2 size={S} />, "#7E57C2"),
      skill("Code Reviews", <Eye size={S} />, "#78909C"),
      skill("Documentation", <BookOpen size={S} />, "#8D6E63"),
    ],
  },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const SectionTitle = memo(() => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView)
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
  }, [controls, inView]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls}>
      <h2 className="section-title">
        <span className="gradient-text">My Skills</span>
      </h2>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-8 mt-2"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />
    </motion.div>
  );
});
SectionTitle.displayName = "SectionTitle";

const SkillItemRow = memo(
  ({ item, delay }: { item: SkillItem; delay: number }) => (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay, duration: 0.25 }}
      className="text-sm text-muted-foreground flex items-center gap-2
      transition-colors duration-200 group-hover:text-foreground/80"
      aria-label={item.label}
    >
      <span
        className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: item.color }}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      {item.label}
    </motion.li>
  ),
);
SkillItemRow.displayName = "SkillItemRow";

const SkillCard = memo(
  ({ category, index }: { category: SkillCategory; index: number }) => (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={CARD_VARIANTS}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.18 } }}
      className="glass-card group cursor-default"
      aria-labelledby={`skill-cat-${index}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${category.headerBg} flex items-center justify-center
          ${category.headerColor} transition-transform duration-300
          group-hover:scale-110 group-hover:rotate-3`}
          aria-hidden="true"
        >
          {category.headerIcon}
        </div>
        <h3
          id={`skill-cat-${index}`}
          className="text-base font-bold text-foreground"
        >
          {category.category}
        </h3>
      </div>

      <ul className="space-y-2" role="list">
        {category.items.map((item, si) => (
          <SkillItemRow
            key={item.label}
            item={item}
            delay={Math.min(index * 0.06 + si * 0.04, 0.8)}
          />
        ))}
      </ul>
    </motion.article>
  ),
);
SkillCard.displayName = "SkillCard";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const Skills = memo(() => (
  <section className="mt-16" aria-label="Skills">
    <SectionTitle />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SKILLS.map((category, i) => (
        <SkillCard key={category.category} category={category} index={i} />
      ))}
    </div>
  </section>
));

Skills.displayName = "Skills";
export default Skills;
