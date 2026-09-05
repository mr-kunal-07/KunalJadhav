import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export default function AnimatedSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
