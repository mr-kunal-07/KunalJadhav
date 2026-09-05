import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import OfferLetterPreview from "@/components/OfferLetterPreview";
import {
  Briefcase,
  Calendar,
  TrendingUp,
} from "lucide-react";

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => {
    if (inView)
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
  }, [controls, inView]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type Role = {
  role: string;
  duration: string;
  description: string;
  skills: string[];
};

type ExperienceEntry =
  | {
      type: "single";
      role: string;
      company: string;
      duration: string;
      description: string;
      skills: string[];
      offerLetterImage?: string;
      current?: boolean;
      offerLetterRedacted?: boolean;
      offerLetterCompensation?: "salary" | "stipend";
    }
  | {
      type: "grouped";
      company: string;
      totalDuration: string;
      roles: Role[];
      offerLetterImage?: string;
      offerLetterRedacted?: boolean;
    };

const EXPERIENCE: ExperienceEntry[] = [
  {
    type: "single",
    role: "Front-End Developer",
    company: "IDSSPL Technologies Pvt. Ltd.",
    duration: "6 Jul 2026 - Present · Goregaon East, Mumbai",
    description:
      "Working as a Front-End Developer at IDSSPL Technologies Pvt. Ltd. in Goregaon East, Mumbai.",
    skills: ["Frontend Development"],
    current: true,
    offerLetterImage: "/exp/idsspl-redacted.webp",
    offerLetterRedacted: true,
  },
  {
    type: "grouped",
    company: "Oohpoint",
    totalDuration: "Jan 2025 - Dec 2025 · Mumbai (On-site)",
    offerLetterImage: "/exp/oohpoint-redacted.webp",
    offerLetterRedacted: true,
    roles: [
      {
        role: "Junior Software Engineer",
        duration: "Jan 2025 - Dec 2025",
        description:
          "Developing and optimizing full-stack web features, dashboards, and campaign tools. Contributing to production-ready scalable systems and improving UI performance and API efficiency.",
        skills: [
          "Next.Js",
          "Node.Js",
          "Express.Js",
          "Superbase",
          "Tailwind CSS",
          "REST APIs",
        ],
      },
    ],
  },
  {
    type: "single",
    role: "React Developer",
    company: "Nestcraft Design · Internship",
    duration: "May 2025 - Jul 2025 · 3 mos · Remote",
    description:
      "Worked as a full-stack web developer using React.js and related technologies. Collaborated remotely with a dynamic design team, contributed to real-time client projects, and gained hands-on experience in scalable web solutions.",
    skills: [
      "React.js",
      "Tailwind CSS",
      "Responsive Design",
      "Client Projects",
    ],
    offerLetterImage: "/exp/nestcraft-redacted.webp",
    offerLetterRedacted: true,
    offerLetterCompensation: "stipend",
  },
];

/* ─── Grouped Card ─── */
const GroupedCard = ({
  entry,
}: {
  entry: Extract<ExperienceEntry, { type: "grouped" }>;
}) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)" }}
    transition={{ duration: 0.2 }}
    className="glass-card group cursor-default"
  >
    <div className="flex items-center gap-2 mb-1">
      <Briefcase size={16} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {entry.company}
      </span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      <Calendar size={12} />
      {entry.totalDuration}
    </div>
    <div className="relative pl-4">
      <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
      <div className="space-y-5">
        {entry.roles.map((r, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[1.15rem] top-1.5 w-2 h-2 rounded-full bg-foreground/60 border border-background" />
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-foreground">{r.role}</h3>
              {idx === 0 && entry.roles.length > 1 && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  <TrendingUp size={10} /> Promoted
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Calendar size={11} />
              {r.duration}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {r.description}
            </p>
            {r.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {r.skills.map((s) => (
                  <span key={s} className="tag-pill">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {idx < entry.roles.length - 1 && (
              <div className="mt-5 border-t border-border/50" />
            )}
          </div>
        ))}
      </div>
    </div>
    {entry.offerLetterRedacted && entry.offerLetterImage && (
      <OfferLetterPreview
        image={entry.offerLetterImage}
        company={entry.company}
      />
    )}
  </motion.div>
);

/* ─── Single Card ─── */
const SingleCard = ({
  entry,
}: {
  entry: Extract<ExperienceEntry, { type: "single" }>;
}) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)" }}
    transition={{ duration: 0.2 }}
    className="glass-card group"
  >
    <div className="flex items-center gap-2 mb-2">
      <Briefcase size={16} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {entry.company}
      </span>
    </div>
    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-foreground/90">
      {entry.role}
      {entry.current && (
        <span className="ml-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 align-middle text-[10px] font-semibold text-emerald-500">
          Current
        </span>
      )}
    </h3>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <Calendar size={12} />
      {entry.duration}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
      {entry.description}
    </p>
    {entry.skills.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {entry.skills.map((s) => (
          <span key={s} className="tag-pill">
            {s}
          </span>
        ))}
      </div>
    )}
    {entry.offerLetterRedacted && entry.offerLetterImage && (
      <OfferLetterPreview
        image={entry.offerLetterImage}
        company={entry.company}
        compensation={entry.offerLetterCompensation}
      />
    )}
  </motion.div>
);

/* ─── Main Section ─── */
const Experience = () => (
  <section id="experience" className="section-container">
    <AnimatedSection>
      <h2 className="section-title">
        <span className="gradient-text">Experience</span>
      </h2>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-2 mt-2"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      />
      <p className="section-subtitle">
        My journey so far in tech and development.
      </p>
    </AnimatedSection>

    <div className="relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      <div className="space-y-12">
        {EXPERIENCE.map((entry, i) => {
          const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: 0,
                y: 20,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex flex-col md:flex-row items-start gap-6 ${side === "left" ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background -translate-x-1.5 md:-translate-x-1.5 mt-8 z-10" />

              <div
                className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${side === "left" ? "md:pr-4" : "md:pl-4"}`}
              >
                  {entry.type === "grouped" ? (
                    <GroupedCard entry={entry} />
                  ) : (
                    <SingleCard entry={entry} />
                  )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Experience;
