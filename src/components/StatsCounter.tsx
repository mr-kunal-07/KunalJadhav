import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { STATS } from "@/data/about";
function Stat({ value, suffix, label }: (typeof STATS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCount(value);
      return;
    }
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1600, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, visible, reduced]);
  return (
    <div ref={ref} className="text-center">
      <div
        className="text-2xl font-bold text-foreground tabular-nums"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {count}
        {suffix}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
export default function StatsCounter({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`grid ${compact ? "grid-cols-2 mt-auto pt-4" : "grid-cols-2 sm:grid-cols-4 pt-4"} gap-3 border-t border-border`}
    >
      {(compact ? STATS.slice(0, 2) : STATS).map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </div>
  );
}
