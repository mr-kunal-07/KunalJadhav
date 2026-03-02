import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  useEffect(() => { if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } }); }, [controls, inView]);
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls} className={className}>{children}</motion.div>;
};

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:dev.kunaljadhav@gmail.com?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.name} (${form.email})`;
    window.open(mailtoLink);
    toast({ title: "Opening mail client!", description: "Your message is ready to send." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-container">
      <AnimatedSection>
        <h2 className="section-title"><span className="gradient-text">Get In Touch</span></h2>
        <motion.div
          className="w-24 h-0.5 bg-gradient-to-r from-foreground/50 to-transparent mb-2 mt-2"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }} style={{ transformOrigin: "left" }}
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Contact Info */}
        <AnimatedSection>
          <div className="glass-card h-full">
            <h3 className="text-lg font-bold text-foreground mb-2">Contact Information</h3>
            <p className="text-sm text-muted-foreground mb-6">Feel free to reach out through any of these channels.</p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={18} />, label: "Mail", href: "mailto:dev.kunaljadhav@gmail.com" },
                { icon: <Github size={18} />, label: "GitHub", href: "https://github.com/mr-kunal-07/" },
                { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://www.linkedin.com/in/kunaljadhav4295" },
                { icon: <Phone size={18} />, label: "+91 9920655685" },
                { icon: <MapPin size={18} />, label: "Mumbai, India" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="text-sm text-foreground hover:underline">{item.label}</a>
                  ) : (
                    <span className="text-sm text-foreground">{item.label}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection>
          <div className="glass-card h-full">
            <h3 className="text-lg font-bold text-foreground mb-2">Send a Message</h3>
            <p className="text-sm text-muted-foreground mb-6">I'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-foreground text-background text-sm font-medium transition-opacity hover:opacity-90"
              >
                <Mail size={16} />
                Send Message
              </motion.button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Contact;
