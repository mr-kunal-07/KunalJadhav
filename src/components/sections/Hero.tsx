import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText, ChevronLeft, ChevronRight } from "lucide-react";

/* ────────────────────────────────────────────── */
/* DATA */
/* ────────────────────────────────────────────── */

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "React Developer",
  "MERN Stack Developer",
];

const SLIDES = [
  { image: "/hero/bgkunal1.webp", title: "Kunal Jadhav" },
  { image: "/hero/bgkunal2.webp", title: "Me In the Office" },
  { image: "/hero/Px.webp", title: "My 1st Love" },
];

/* ────────────────────────────────────────────── */
/* TYPEWRITER (Leak Safe) */
/* ────────────────────────────────────────────── */

const useTypewriter = (words, speed = 100, pause = 2000) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const pauseTimeout = useRef(null);

  useEffect(() => {
    const current = words[wordIndex];

    const tick = setTimeout(() => {
      if (!isDeleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);

        if (next === current) {
          pauseTimeout.current = setTimeout(
            () => setIsDeleting(true),
            pause
          );
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);

        if (next === "") {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => {
      clearTimeout(tick);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
};

/* ────────────────────────────────────────────── */
/* HERO COMPONENT */
/* ────────────────────────────────────────────── */

const Hero = () => {
  const typed = useTypewriter(ROLES);
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // Auto-slide (safe interval)
  useEffect(() => {
    const timer = setInterval(next, 1900);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="home"
      className="section-container py-40 sm:py-52 flex items-center relative overflow-hidden"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">

        {/* ───────── LEFT TEXT ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground text-lg mb-2">
            Hi, I'm
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-foreground">
            Kunal Jadhav
          </h1>

          <p className="text-xl md:text-2xl mb-4 text-muted-foreground">
            I am a{" "}
            <span className="text-foreground font-semibold">
              {typed}
            </span>
            <span className="animate-pulse text-foreground">|</span>
          </p>

          <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl text-base">
            Full Stack Developer focused on building{" "}
            <span className="text-foreground font-medium">
              scalable, high-performance, AI-powered
            </span>{" "}
            software solutions. Startup enthusiast driven to take ideas from 0 → 1.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="hero-button-primary group">
              <ArrowDown
                size={16}
                className="group-hover:translate-y-0.5 transition-transform"
              />
              View my work
            </a>

            <a
              href="/Kunal.pdf"
              target="_blank"
              rel="noreferrer"
              className="hero-button-outline group"
            >
              <FileText
                size={16}
                className="group-hover:rotate-3 transition-transform"
              />
              My Resume
            </a>
          </div>
        </motion.div>

        {/* ───────── RIGHT IMAGE (LCP OPTIMIZED) ───────── */}
        <div className="flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border shadow-lg group">

            {/* 🔥 LCP OPTIMIZED IMAGE (NO SCALE ANIMATION) */}
            <img
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              loading={current === 0 ? "eager" : "lazy"}
              fetchPriority={current === 0 ? "high" : "auto"}
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 flex items-end justify-center p-4 pointer-events-none">
              <p className="text-background text-xs tracking-wider bg-foreground rounded px-1.5 py-0.5 font-semibold">
                {SLIDES[current].title}
              </p>
            </div>

            {/* Dots */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                    ? "w-5 bg-foreground opacity-100"
                    : "w-1.5 bg-foreground opacity-40"
                    }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
            >
              <ChevronRight size={16} />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;