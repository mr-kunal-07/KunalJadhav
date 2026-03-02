import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, Layers, Calendar, Coffee } from "lucide-react";

const useCounter = (end: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [start, end, duration]);

  return count;
};

const STATS = [
  { icon: <Code2 size={24} />, value: 7000, suffix: "+", label: "Hours of Coding" },
  { icon: <Layers size={24} />, value: 40, suffix: "+", label: "Technologies" },
  { icon: <Calendar size={24} />, value: 5, suffix: "+", label: "Year Experience" },
  { icon: <Coffee size={24} />, value: 550, suffix: "+", label: "LeetCode Solved" },
];

const StatItem = ({ icon, value, suffix, label, delay, inView }: { icon: React.ReactNode; value: number; suffix: string; label: string; delay: number; inView: boolean }) => {
  const count = useCounter(value, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center group"
    >
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3 text-foreground group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const StatsCounter = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 py-10 px-6 rounded-2xl bg-card border border-border">
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} {...stat} delay={i * 0.1} inView={inView} />
      ))}
    </div>
  );
};

export default StatsCounter;
