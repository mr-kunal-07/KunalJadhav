import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Briefcase, Calendar, TrendingUp, FileText, ZoomIn } from "lucide-react";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => { if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } }); }, [controls, inView]);
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls} className={className}>{children}</motion.div>;
};

type Role = { role: string; duration: string; description: string; skills: string[] };

type ExperienceEntry =
  | {
    type: "single";
    role: string;
    company: string;
    duration: string;
    description: string;
    skills: string[];
    offerLetterImage?: string; // e.g. "/exp/oohpoint.png"
  }
  | {
    type: "grouped";
    company: string;
    totalDuration: string;
    roles: Role[];
    offerLetterImage?: string;
  };

const EXPERIENCE: ExperienceEntry[] = [
  {
    type: "grouped",
    company: "Oohpoint",
    totalDuration: "Jan 2025 - Present · 1 yr 3 mos · Mumbai (On-site)",
    offerLetterImage: "/exp/oohpoint.png",
    roles: [
      {
        role: "Founding Engineer",
        duration: "Oct 2025 - Present · 6 mos",
        description:
          "Leading development of next-gen OOH/DOOH AdTech platform. Building scalable full-stack features, interactive campaign modules, and performance-driven web applications for real-world transit and retail media use cases.",
        skills: [],
      },
      {
        role: "Junior Software Engineer",
        duration: "Jan 2025 - Oct 2025 · 9 mos",
        description:
          "Developing and optimizing full-stack web features, dashboards, and campaign tools. Contributing to production-ready scalable systems and improving UI performance and API efficiency.",
        skills: ["Next.Js", "Node.Js", "Express.Js", "Superbase", "Tailwind CSS", "REST APIs"],
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
    skills: ["React.js", "Tailwind CSS", "Responsive Design", "Client Projects"],
    offerLetterImage: "/exp/nestcraft.png",
  },
  {
    type: "single",
    role: "GDG Technical Lead",
    company: "Google Developer Groups On Campus, CSMU · Full-time",
    duration: "Sep 2024 - Jun 2025 · 10 mos · Navi Mumbai (On-site)",
    description:
      "Contributing to the planning and execution of Tech Events. Collaborating within the Developers community and supporting initiatives focused on Web Development and Innovation.",
    skills: ["Leadership", "Workshops", "Community Building", "Web Development"],
    offerLetterImage: "/exp/gdg.png",
  },
  {
    type: "single",
    role: "Freelance Full Stack Developer",
    company: "Floship Services · Freelance",
    duration: "Jan 2025 - Mar 2025 · 3 mos · Remote",
    description:
      "Designed and developed a responsive, modern website for Floship using React.js, Tailwind CSS, and React Router. Translated client requirements into clean UI/UX with smooth navigation and optimized performance. Managed the full development cycle from planning to deployment.",
    skills: ["React.js", "Tailwind CSS", "React Router", "UI/UX", "Deployment"],
    offerLetterImage: "/exp/freelance.png",
  },
  {
    type: "single",
    role: "Open Source Contributor",
    company: "GirlScript Summer of Code · Full-time",
    duration: "Oct 2024 - Nov 2024 · 2 mos · Remote",
    description:
      "Contributed to open-source web development projects, fixed issues, and collaborated with developers to improve code quality and features.",
    skills: ["Open Source", "GitHub", "JavaScript", "Collaboration"],
    offerLetterImage: "/exp/gssoc.png",
  },
];

/* ─── Offer Letter Image Popup ─── */
const OfferLetterPopup = ({
  imageSrc,
  company,
  side,
}: {
  imageSrc: string;
  company: string;
  side: "left" | "right";
}) => {
  const [zoomed, setZoomed] = useState(false);
  const popupLeft = side === "left"; // card is left → popup appears on right

  return (
    <>
      {/* Inline popup next to card */}
      <motion.div
        initial={{ opacity: 0, x: popupLeft ? 16 : -16, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: popupLeft ? 16 : -16, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`absolute top-0 z-30 w-64 pointer-events-auto hidden md:block ${popupLeft ? "left-[calc(100%+2rem)]" : "right-[calc(100%+2rem)]"
          }`}
      >
        {/* Paper stack depth layers */}
        <div className="relative">
          <div className="absolute inset-0 translate-y-2 translate-x-2 rounded-lg bg-foreground/8 blur-[1px]" />
          <div className="absolute inset-0 translate-y-1 translate-x-1 rounded-lg bg-foreground/5" />

          {/* Document wrapper */}
          <div className="relative rounded-lg overflow-hidden border border-border/60 shadow-2xl bg-background">

            {/* Top label bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-foreground">
              <div className="flex items-center gap-1.5">
                <FileText size={11} className="text-background/70" />
                <span className="text-[10px] font-bold text-background/90 uppercase tracking-widest">Offer Letter</span>
              </div>
              <span className="text-[9px] text-background/50 truncate max-w-[100px]">{company}</span>
            </div>

            {/* Image */}
            <div className="relative group/img cursor-zoom-in" onClick={() => setZoomed(true)}>
              <img
                src={imageSrc}
                alt={`${company} offer letter`}
                className="w-full object-cover object-top max-h-80"
                style={{ imageRendering: "crisp-edges" }}
              />
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover/img:bg-foreground/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-full p-2">
                  <ZoomIn size={16} className="text-foreground" />
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="px-3 py-2 bg-foreground/[0.03] border-t border-border/40 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-emerald-500 font-semibold">Official Document</span>
              <span className="text-[9px] text-muted-foreground ml-auto">click to zoom</span>
            </div>
          </div>
        </div>

        {/* Connector arrow */}
        <div
          className={`absolute top-8 w-3 h-3 rotate-45 border bg-background border-border/60 ${popupLeft
            ? "-left-1.5 border-t-0 border-r-0"
            : "-right-1.5 border-b-0 border-l-0"
            }`}
        />
      </motion.div>

      {/* Fullscreen zoom lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-8 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox header */}
              <div className="flex items-center justify-between px-4 py-3 bg-foreground">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-background/70" />
                  <span className="text-xs font-bold text-background/90 uppercase tracking-widest">Offer Letter</span>
                  <span className="text-xs text-background/50">· {company}</span>
                </div>
                <button
                  onClick={() => setZoomed(false)}
                  className="text-background/60 hover:text-background text-lg font-light leading-none"
                >
                  ✕
                </button>
              </div>
              <img
                src={imageSrc}
                alt={`${company} offer letter`}
                className="w-full object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Card wrapper — handles hover + popup ─── */
const CardWithOfferLetter = ({
  offerLetterImage,
  company,
  side,
  children,
}: {
  offerLetterImage?: string;
  company: string;
  side: "left" | "right";
  children: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => window.innerWidth >= 768 && setHovered(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setHovered(false)}    >
      <AnimatePresence>
        {hovered && offerLetterImage && (
          <OfferLetterPopup
            key="popup"
            imageSrc={offerLetterImage}
            company={company}
            side={side}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

/* ─── Grouped Card ─── */
const GroupedCard = ({ entry }: { entry: Extract<ExperienceEntry, { type: "grouped" }> }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)" }}
    transition={{ duration: 0.2 }}
    className="glass-card group cursor-default"
  >
    <div className="flex items-center gap-2 mb-1">
      <Briefcase size={16} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{entry.company}</span>
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
              {idx === 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  <TrendingUp size={10} /> Promoted
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Calendar size={11} />
              {r.duration}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{r.description}</p>
            {r.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {r.skills.map((s) => <span key={s} className="tag-pill">{s}</span>)}
              </div>
            )}
            {idx < entry.roles.length - 1 && <div className="mt-5 border-t border-border/50" />}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─── Single Card ─── */
const SingleCard = ({ entry }: { entry: Extract<ExperienceEntry, { type: "single" }> }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)" }}
    transition={{ duration: 0.2 }}
    className="glass-card group"
  >
    <div className="flex items-center gap-2 mb-2">
      <Briefcase size={16} className="text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{entry.company}</span>
    </div>
    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-foreground/90">{entry.role}</h3>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <Calendar size={12} />
      {entry.duration}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{entry.description}</p>
    {entry.skills.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {entry.skills.map((s) => <span key={s} className="tag-pill">{s}</span>)}
      </div>
    )}
  </motion.div>
);

/* ─── Main Section ─── */
const Experience = () => (
  <section id="experience" className="section-container">
    <AnimatedSection>
      <h2 className="section-title"><span className="gradient-text">Experience</span></h2>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-2 mt-2"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      />
      <p className="section-subtitle">My journey so far in tech and development.</p>
    </AnimatedSection>

    <div className="relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      <div className="space-y-12">
        {EXPERIENCE.map((entry, i) => {
          const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
          const company = entry.type === "grouped" ? entry.company : entry.company;
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: typeof window !== "undefined" && window.innerWidth < 768
                  ? 0
                  : side === "left"
                    ? -40
                    : 40,
                y: 20,
              }} whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex flex-col md:flex-row items-start gap-6 ${side === "left" ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background -translate-x-1.5 md:-translate-x-1.5 mt-8 z-10" />

              <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${side === "left" ? "md:pr-4" : "md:pl-4"}`}>
                <CardWithOfferLetter
                  offerLetterImage={entry.offerLetterImage}
                  company={company}
                  side={side}
                >
                  {entry.type === "grouped"
                    ? <GroupedCard entry={entry} />
                    : <SingleCard entry={entry} />
                  }
                </CardWithOfferLetter>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Experience;