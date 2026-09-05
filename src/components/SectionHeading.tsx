import AnimatedSection from "./AnimatedSection";
export default function SectionHeading({
  title,
  subtitle,
  className = "mb-8",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <AnimatedSection className={className}>
      <h2 className="section-title">
        <span className="gradient-text">{title}</span>
      </h2>
      <div className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mt-2" />
      {subtitle && <p className="section-subtitle mt-2 mb-0">{subtitle}</p>}
    </AnimatedSection>
  );
}
