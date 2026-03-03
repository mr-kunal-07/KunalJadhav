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
  SiMysql,
  SiGit,
  SiLinux,
  SiHtml5,
  SiCss,             // ✓ NOT SiCss3
  SiTailwindcss,
  SiMui,
  SiRedux,
  SiFramer,
  SiGreensock,
  SiThreedotjs,
  SiChartdotjs,
  SiGraphql,
  SiRedis,
  SiGooglecloud,
  SiVercel,
  SiNetlify,
  SiDocker,
  SiGithubactions,
  SiNginx,
  SiStripe,
  SiRazorpay,
  SiGithub,
  SiGitlab,
  SiPostman,
  SiFigma,
  SiNpm,
  SiEslint,
  SiPrettier,
  SiFirebase,
} from "react-icons/si";

// ── react-icons/fa — AWS not in si ───────────────────────────────────────────
import { FaAws } from "react-icons/fa";

// ── react-icons/vsc — Azure & VS Code not in si ──────────────────────────────
import { VscAzure, VscVscode } from "react-icons/vsc";

// ── lucide-react — concept / abstract icons only ─────────────────────────────
import {
  Network, Shield, Key, Lock, PlayCircle, Timer,
  AlertTriangle, FileText, Globe, Radio, Plug, Database,
  LayoutGrid, TrendingUp, BookOpen, Layers, RefreshCw,
  CheckCircle, Cloud, Rocket, Users, Repeat, CreditCard,
  LayoutDashboard, User, Hash, ShieldCheck, AlertOctagon,
  Ban, Gauge, Eye, Scissors, Image, Activity, Zap, Brain,
  TreePine, Code2, FlaskConical, Link, Lightbulb,
  MessageCircle, Star, PenTool, Shuffle, Terminal,
  Search, Monitor, Bug, Settings, Bell, Mail, Boxes,
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
const skill = (label: string, icon: React.ReactElement, color: string): SkillItem =>
  ({ label, icon, color });

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
      skill("PostgreSQL", <SiPostgresql size={S} />, "#4169E1"),
      skill("MySQL", <SiMysql size={S} />, "#4479A1"),
      skill("Git", <SiGit size={S} />, "#F05032"),
      skill("Linux", <SiLinux size={S} />, "#FCC624"),
    ],
  },
  {
    category: "Frontend Engineering",
    headerIcon: <SiReact size={22} color="#61DAFB" />,
    headerColor: "text-blue-400",
    headerBg: "bg-blue-400/10",
    items: [
      skill("HTML", <SiHtml5 size={S} />, "#E34F26"),
      skill("CSS", <SiCss size={S} />, "#1572B6"),
      skill("Tailwind CSS", <SiTailwindcss size={S} />, "#06B6D4"),
      skill("Material UI", <SiMui size={S} />, "#007FFF"),
      skill("ShadCN UI", <Boxes size={S} />, "#FFFFFF"),
      skill("SEO", <Search size={S} />, "#4CAF50"),
      skill("Redux Toolkit", <SiRedux size={S} />, "#764ABC"),
      skill("Context API", <SiReact size={S} />, "#61DAFB"),
      skill("Zustand", <Code2 size={S} />, "#C67D2A"),
      skill("Framer Motion", <SiFramer size={S} />, "#0055FF"),
      skill("GSAP", <SiGreensock size={S} />, "#88CE02"),
      skill("Three.js", <SiThreedotjs size={S} />, "#FFFFFF"),
      skill("Chart.js", <SiChartdotjs size={S} />, "#FF6384"),
      skill("PWA", <Globe size={S} />, "#5A0FC8"),
    ],
  },
  {
    category: "Backend Engineering",
    headerIcon: <SiNodedotjs size={22} color="#339933" />,
    headerColor: "text-green-400",
    headerBg: "bg-green-400/10",
    items: [
      skill("REST API Design", <Network size={S} />, "#6BA539"),
      skill("GraphQL", <SiGraphql size={S} />, "#E10098"),
      skill("WebSockets", <Radio size={S} />, "#848484"),
      skill("API Integration", <Plug size={S} />, "#FF9800"),
      skill("Authentication", <Lock size={S} />, "#607D8B"),
      skill("Authorization", <Shield size={S} />, "#607D8B"),
      skill("JWT", <Key size={S} />, "#D63AFF"),
      skill("OAuth", <Key size={S} />, "#4285F4"),
      skill("Streaming", <PlayCircle size={S} />, "#FF5722"),
      skill("Webhooks", <Bell size={S} />, "#FF9800"),
      skill("Email Services", <Mail size={S} />, "#EA4335"),
      skill("Cron Jobs", <Timer size={S} />, "#607D8B"),
      skill("Error Handling", <AlertTriangle size={S} />, "#FFC107"),
      skill("Logging", <FileText size={S} />, "#9E9E9E"),
    ],
  },
  {
    category: "Cloud & DevOps",
    headerIcon: <SiDocker size={22} color="#2496ED" />,
    headerColor: "text-cyan-400",
    headerBg: "bg-cyan-400/10",
    items: [
      skill("AWS", <FaAws size={S} />, "#FF9900"),
      skill("Google Cloud", <SiGooglecloud size={S} />, "#4285F4"),
      skill("Azure", <VscAzure size={S} />, "#0078D4"),
      skill("Vercel", <SiVercel size={S} />, "#FFFFFF"),
      skill("Netlify", <SiNetlify size={S} />, "#00C7B7"),
      skill("Docker", <SiDocker size={S} />, "#2496ED"),
      skill("CI/CD", <SiGithubactions size={S} />, "#2088FF"),
      skill("GitHub Actions", <SiGithubactions size={S} />, "#2088FF"),
      skill("Nginx", <SiNginx size={S} />, "#009639"),
      skill("SSL", <Lock size={S} />, "#4CAF50"),
      skill("DNS", <Network size={S} />, "#607D8B"),
    ],
  },
  {
    category: "Databases",
    headerIcon: <Database size={22} />,
    headerColor: "text-indigo-400",
    headerBg: "bg-indigo-400/10",
    items: [
      skill("Firebase", <SiFirebase size={S} />, "#FFCA28"),
      skill("Redis", <SiRedis size={S} />, "#FF4438"),
      skill("Database Design", <LayoutGrid size={S} />, "#5C6BC0"),
      skill("Database Optimization", <Gauge size={S} />, "#FF7043"),
    ],
  },
  {
    category: "System Design",
    headerIcon: <Layers size={22} />,
    headerColor: "text-purple-400",
    headerBg: "bg-purple-400/10",
    items: [
      skill("MVC", <Layers size={S} />, "#78909C"),
      skill("Clean Architecture", <CheckCircle size={S} />, "#66BB6A"),
      skill("Microservices", <LayoutGrid size={S} />, "#26C6DA"),
      skill("Event Driven Architecture", <Zap size={S} />, "#FFA726"),
      skill("RESTful Architecture", <Network size={S} />, "#6BA539"),
      skill("Scalable Systems", <TrendingUp size={S} />, "#42A5F5"),
      skill("System Design", <PenTool size={S} />, "#AB47BC"),
      skill("Design Patterns", <BookOpen size={S} />, "#8D6E63"),
      skill("State Management", <RefreshCw size={S} />, "#764ABC"),
    ],
  },
  {
    category: "SaaS Development",
    headerIcon: <SiStripe size={22} color="#635BFF" />,
    headerColor: "text-orange-400",
    headerBg: "bg-orange-400/10",
    items: [
      skill("SaaS Architecture", <Cloud size={S} />, "#4FC3F7"),
      skill("Multi Tenant Systems", <Users size={S} />, "#7E57C2"),
      skill("Subscription Systems", <Repeat size={S} />, "#26A69A"),
      skill("Payment Integration", <CreditCard size={S} />, "#00BCD4"),
      skill("Stripe", <SiStripe size={S} />, "#635BFF"),
      skill("Razorpay", <SiRazorpay size={S} />, "#0D9ED9"),
      skill("Admin Dashboards", <LayoutDashboard size={S} />, "#FF7043"),
      skill("User Dashboards", <User size={S} />, "#66BB6A"),
    ],
  },
  {
    category: "Security",
    headerIcon: <Shield size={22} />,
    headerColor: "text-red-400",
    headerBg: "bg-red-400/10",
    items: [
      skill("Web Security", <Shield size={S} />, "#EF5350"),
      skill("HTTPS", <Lock size={S} />, "#4CAF50"),
      skill("CORS", <Globe size={S} />, "#42A5F5"),
      skill("Encryption", <Lock size={S} />, "#AB47BC"),
      skill("Hashing", <Hash size={S} />, "#78909C"),
      skill("Secure APIs", <ShieldCheck size={S} />, "#66BB6A"),
      skill("Input Validation", <CheckCircle size={S} />, "#29B6F6"),
      skill("XSS Protection", <AlertOctagon size={S} />, "#FFA726"),
      skill("CSRF Protection", <Ban size={S} />, "#EF5350"),
      skill("Password Security", <Key size={S} />, "#8D6E63"),
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
      skill("Fast Rendering", <Zap size={S} />, "#FFCA28"),
      skill("Core Web Vitals", <Activity size={S} />, "#4285F4"),
      skill("CDN Optimization", <Network size={S} />, "#00C7B7"),
    ],
  },
  {
    category: "Developer Tools",
    headerIcon: <Settings size={22} />,
    headerColor: "text-teal-400",
    headerBg: "bg-teal-400/10",
    items: [
      skill("GitHub", <SiGithub size={S} />, "#FFFFFF"),
      skill("GitLab", <SiGitlab size={S} />, "#FC6D26"),
      skill("VS Code", <VscVscode size={S} />, "#007ACC"),
      skill("Postman", <SiPostman size={S} />, "#FF6C37"),
      skill("Figma", <SiFigma size={S} />, "#F24E1E"),
      skill("Chrome DevTools", <Monitor size={S} />, "#4285F4"),
      skill("NPM", <SiNpm size={S} />, "#CB3837"),
      skill("ESLint", <SiEslint size={S} />, "#4B32C3"),
      skill("Prettier", <SiPrettier size={S} />, "#F7B93E"),
      skill("Debugging", <Bug size={S} />, "#EF5350"),
      skill("Terminal", <Terminal size={S} />, "#4CAF50"),
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
      skill("Agile", <RefreshCw size={S} />, "#29B6F6"),
      skill("Code Reviews", <Eye size={S} />, "#78909C"),
      skill("Documentation", <BookOpen size={S} />, "#8D6E63"),
      skill("Unit Testing", <FlaskConical size={S} />, "#4CAF50"),
      skill("Integration Testing", <Link size={S} />, "#FF9800"),
    ],
  },
  {
    category: "Soft Skills",
    headerIcon: <Users size={22} />,
    headerColor: "text-teal-400",
    headerBg: "bg-teal-400/10",
    items: [
      skill("Problem Solving", <Lightbulb size={S} />, "#FFCA28"),
      skill("Critical Thinking", <Brain size={S} />, "#AB47BC"),
      skill("Teamwork", <Users size={S} />, "#42A5F5"),
      skill("Communication", <MessageCircle size={S} />, "#26C6DA"),
      skill("Leadership", <Star size={S} />, "#FFA726"),
      skill("Time Management", <Gauge size={S} />, "#EF5350"),
      skill("Creativity", <PenTool size={S} />, "#EC407A"),
      skill("Adaptability", <Shuffle size={S} />, "#66BB6A"),
      skill("Decision Making", <CheckCircle size={S} />, "#29B6F6"),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

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
    if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
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

const SkillItemRow = memo(({ item, delay }: { item: SkillItem; delay: number }) => (
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
));
SkillItemRow.displayName = "SkillItemRow";

const SkillCard = memo(({ category, index }: { category: SkillCategory; index: number }) => (
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
      <h3 id={`skill-cat-${index}`} className="text-base font-bold text-foreground">
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
));
SkillCard.displayName = "SkillCard";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const Skills = memo(() => (
  <section className="mt-16" aria-label="Skills">
    <SectionTitle />
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {SKILLS.map((category, i) => (
        <SkillCard key={category.category} category={category} index={i} />
      ))}
    </div>
  </section>
));

Skills.displayName = "Skills";
export default Skills;