import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, FileText, ChevronLeft, ChevronRight } from "lucide-react";
const SLIDES = [
  { image: "/hero/developer-768.webp", small: "/hero/developer-384.webp", title: "I am a Developer", alt: "Kunal Jadhav, Full Stack Developer, in a white suit" },
  { image: "/hero/office-768.webp", small: "/hero/office-384.webp", title: "Me In the Office", alt: "Kunal Jadhav working on a laptop in the office" },
  { image: "/hero/bike-768.webp", small: "/hero/bike-384.webp", title: "My 1st Love", alt: "Kunal Jadhav’s coding desk with a laptop and monitor" },
];
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);
  const touchStart = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const changeSlide = (direction: number) =>
    setCurrent((c) => (c + direction + SLIDES.length) % SLIDES.length);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (!paused.current && !document.hidden)
        setCurrent((c) => (c + 1) % SLIDES.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return (
    <section
      id="home"
      className="hero-shine section-container py-40 sm:py-52 flex items-center relative overflow-hidden isolate"
    >
      <div className="hero-wave-field" aria-hidden="true">
        {[0, 1].map((wave) => (
          <svg
            key={wave}
            className={`hero-wave${wave === 1 ? " hero-wave-secondary" : ""}`}
            viewBox="0 0 1200 600"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path
              className="hero-wave-halo"
              d="M-150 440 C150 440 240 90 530 240 S890 540 1350 160"
            />
            <path
              className="hero-wave-light"
              d="M-150 440 C150 440 240 90 530 240 S890 540 1350 160"
            />
            <path
              className="hero-wave-edge"
              d="M-150 440 C150 440 240 90 530 240 S890 540 1350 160"
            />
          </svg>
        ))}
      </div>
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
          className="flex flex-col"
        >
          <p className="text-muted-foreground text-sm uppercase mb-2">
            Hi, I'm
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="hero-name-shine">Kunal Jadhav</span>
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-muted-foreground">I am a</span>Full Stack
            Developer
          </div>
          <p className="text-muted-foreground max-w-md mb-6">
            I’m Kunal, a Full-Stack Developer building thoughtful web
            experiences. Currently crafting frontends at IDSSPL.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#projects" className="hero-button-primary">
              <ArrowDown size={16} />
              View my work
            </a>
            <a
              href="/kunal-resume"
              target="_blank"
              rel="noreferrer"
              className="hero-button-outline"
            >
              <FileText size={16} />
              My Resume
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
          className="flex justify-center"
        >
          <div
            className="hero-photo-shine relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border shadow-lg group"
            aria-label="Portfolio photos"
            aria-roledescription="carousel"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
            onFocusCapture={() => {
              paused.current = true;
            }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                paused.current = false;
            }}
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStart.current !== null) {
                const delta = touchStart.current - e.changedTouches[0].clientX;
                if (Math.abs(delta) > 40) changeSlide(delta > 0 ? 1 : -1);
                touchStart.current = null;
              }
            }}
          >
            {SLIDES.map((slide, index) => (
              <div
                key={slide.image}
                aria-hidden={index !== current}
                className={`absolute inset-0 transition-opacity duration-500 ${current === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {/* React 18 requires the lowercase browser attribute for fetch priority. */}
                <img
                  src={slide.image}
                  srcSet={`${slide.small} 384w, ${slide.image.replace("-768.webp", "-512.webp")} 512w, ${slide.image} 768w`}
                  sizes="(min-width: 768px) 384px, 288px"
                  alt={slide.alt}
                  {...{ fetchpriority: index === 0 ? "high" : "low" }}
                  decoding="async"
                  width={384}
                  height={384}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
              <span className="text-xs bg-foreground text-background px-2 py-1 rounded">
                {SLIDES[current].title}
              </span>
            </div>
            <button
              onClick={() => changeSlide(-1)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => changeSlide(1)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.image}
                  onClick={() => setCurrent(index)}
                  aria-label={`Show ${slide.title}`}
                  aria-pressed={current === index}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-full transition-all ${current === index ? "w-6 bg-foreground" : "w-2 bg-foreground/40"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
