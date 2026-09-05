import {
  Briefcase,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Trophy,
  User,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import StatsCounter from "@/components/StatsCounter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACHIEVEMENTS, EDUCATION } from "@/data/about";
import Skills from "./Skills";
const DETAILS = [
  { label: "Location", value: "Mumbai, India", Icon: MapPin },
  { label: "Email", value: "dev.kunaljadhav@gmail.com", Icon: Mail },
  { label: "Role", value: "Front-End Developer @ IDSSPL", Icon: Briefcase },
  { label: "Joined", value: "6 July 2026", Icon: Calendar },
];
const SOCIALS = [
  { href: "https://github.com/mr-kunal-07", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/kunaltech", label: "LinkedIn", Icon: Linkedin },
  {
    href: "https://www.instagram.com/the.mr_kunal",
    label: "Instagram",
    Icon: Instagram,
  },
  { href: "https://www.idsspl.com", label: "Website", Icon: Globe },
];
export default function About() {
  return (
    <section id="about" className="section-container">
      <SectionHeading title="About Me" className="mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedSection className="glass-card overflow-hidden p-0 flex flex-col h-full">
          <div className="relative group aspect-square overflow-hidden">
            <div className="absolute inset-2 rounded-xl ring-1 ring-foreground/10 z-10 pointer-events-none" />
            <img
              src="/about-portrait-768.webp"
              srcSet="/about-portrait-384.webp 384w, /about-portrait-768.webp 768w"
              sizes="(min-width: 768px) 352px, calc(100vw - 48px)"
              decoding="async"
              alt="Kunal Jadhav portrait"
              width={768}
              height={768}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
              <h3 className="text-lg font-bold text-foreground leading-tight">
                Kunal Jadhav
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Full Stack Developer
              </p>
              <div className="flex gap-2 mt-3">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="p-1.5 rounded border border-border bg-background/40 text-muted-foreground hover:text-foreground"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <p className="text-foreground/80 text-[13px] leading-relaxed border-l-2 border-border pl-3">
              Startup enthusiast driven to take ideas from{" "}
              <span className="text-foreground font-medium">0 → 1</span>.
              Currently building at{" "}
              <a
                href="https://www.idsspl.com"
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium underline underline-offset-2"
              >
                IDSSPL
              </a>
              .
            </p>
            <StatsCounter compact />
          </div>
        </AnimatedSection>
        <div className="md:col-span-2">
          <AnimatedSection>
            <div className="glass-card h-full flex flex-col">
              <Tabs defaultValue="personal" className="flex flex-col flex-1">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="personal" className="gap-1.5 px-1">
                    <User size={13} />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="education" className="gap-1.5 px-1">
                    <GraduationCap size={13} />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="gap-1.5 px-1">
                    <Trophy size={13} />
                    Achievements
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-0 space-y-5">
                  <p className="text-foreground/80 text-[13.5px] leading-relaxed">
                    I'm a Full Stack Developer with a passion for creating
                    innovative, user-friendly applications. Currently working as
                    a{" "}
                    <span className="text-foreground font-medium">
                      Front-End Developer
                    </span>{" "}
                    at{" "}
                    <a
                      href="https://www.idsspl.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground font-medium underline underline-offset-2"
                    >
                      IDSSPL Technologies Pvt. Ltd.
                    </a>
                    . Previously a Founding Engineer at Oohpoint, I've built web
                    apps, mobile experiences, and APIs — and contributed to open
                    source along the way.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {DETAILS.map(({ label, value, Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <span className="w-10 h-10 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                          <Icon size={15} />
                        </span>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {label}
                          </p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <StatsCounter />
                </TabsContent>
                <TabsContent value="education" className="mt-0">
                  <div className="space-y-6 border-l border-border pl-5 ml-2">
                    {EDUCATION.map((item) => (
                      <div className="relative" key={item.school}>
                        <span className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                        <h4 className="text-sm font-semibold">{item.school}</h4>
                        <p className="text-[13px] text-muted-foreground mt-1">
                          {item.degree}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                          <Calendar size={12} />
                          {item.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="achievements" className="mt-0 space-y-5">
                  {ACHIEVEMENTS.map((item) => (
                    <div
                      key={item.title}
                      className="border-l border-border pl-4"
                    >
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-2">
                        {item.description}
                      </p>
                      <a
                        href={item.certUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.isLive ? "Visit" : "View certificate for"} ${item.title}`}
                        className="inline-flex gap-1 items-center text-xs mt-2 hover:underline"
                      >
                        <ExternalLink size={12} />
                        {item.isLive ? "Live" : "Cert"}
                      </a>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </AnimatedSection>
        </div>
      </div>
      <Skills />
    </section>
  );
}
