import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import {
  CONTACT_FIELDS,
  ContactField,
  ContactValues,
  sendContact,
  validateContact,
} from "@/lib/contact";
const EMPTY: ContactValues = { name: "", email: "", message: "" };
const INFO = [
  {
    Icon: Mail,
    label: "dev.kunaljadhav@gmail.com",
    href: "mailto:dev.kunaljadhav@gmail.com",
    aria: "Email Kunal Jadhav",
  },
  {
    Icon: Github,
    label: "GitHub",
    href: "https://github.com/mr-kunal-07/",
    aria: "Kunal Jadhav on GitHub",
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kunaltech",
    aria: "Kunal Jadhav on LinkedIn",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/the.mr_kunal",
    aria: "Kunal Jadhav on Instagram",
  },
  {
    Icon: Phone,
    label: "+91 9920655685",
    href: "tel:+919920655685",
    aria: "Call Kunal Jadhav",
  },
  { Icon: MapPin, label: "Mumbai, India", href: null, aria: null },
];
export default function Contact() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<ContactField, boolean>>
  >({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const lastSent = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const errors = Object.fromEntries(
    CONTACT_FIELDS.map((key) => [
      key,
      touched[key] ? validateContact(key, values[key]) : "",
    ]),
  ) as Record<ContactField, string>;
  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setError("");
    setSent(false);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending || controller.current) return;
    setTouched({ name: true, email: true, message: true });
    const invalid = CONTACT_FIELDS.find((key) =>
      validateContact(key, values[key]),
    );
    if (invalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${invalid}"]`)
        ?.focus();
      return;
    }
    const remaining = 60000 - (Date.now() - lastSent.current);
    if (remaining > 0) {
      toast.warning(
        `Please wait ${Math.ceil(remaining / 1000)}s before sending another message.`,
      );
      return;
    }
    const request = new AbortController();
    controller.current = request;
    setSending(true);
    setError("");
    const timeout = window.setTimeout(() => request.abort(), 12000);
    try {
      await sendContact(values, request.signal);
      lastSent.current = Date.now();
      setSent(true);
      setValues(EMPTY);
      setTouched({});
      toast.success("Message sent successfully!");
    } catch (failure) {
      const message = request.signal.aborted
        ? "Request timed out. Please try again."
        : failure instanceof Error
          ? failure.message
          : "Unable to send your message. Please try again.";
      setError(message);
    } finally {
      window.clearTimeout(timeout);
      controller.current = null;
      setSending(false);
    }
  };
  return (
    <section id="contact" className="section-container">
      <SectionHeading title="Get In Touch" />
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <AnimatedSection>
          <div className="glass-card h-full">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Contact Information
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Feel free to reach out through any of these channels.
            </p>
            <div className="space-y-5">
              {INFO.map(({ Icon, label, href, aria }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 group hover:translate-x-1 transition-transform"
                >
                  <Icon size={18} className="text-muted-foreground shrink-0" />
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      aria-label={aria || undefined}
                      className="text-sm hover:underline break-all"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm">{label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="glass-card h-full">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Send a Message
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              I'll get back to you as soon as possible.
            </p>
            {sent ? (
              <div
                className="flex flex-col items-center justify-center gap-4 py-8 text-center"
                role="status"
              >
                <span className="rounded-full bg-green-500/10 p-4">
                  <CheckCircle2 className="text-green-500" size={32} />
                </span>
                <div>
                  <h4 className="text-base font-semibold">Message sent!</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    I'll get back to you within 24–48 hours.
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="mt-2 text-xs text-muted-foreground underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={submit}
                noValidate
                aria-label="Contact form"
                className="space-y-4"
              >
                {CONTACT_FIELDS.map((field) => {
                  const label =
                    field === "name"
                      ? "Your Name"
                      : field === "email"
                        ? "Your Email"
                        : "Your Message";
                  const props = {
                    id: `contact-${field}`,
                    name: field,
                    value: values[field],
                    placeholder: label,
                    required: true,
                    disabled: sending,
                    onChange: (
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >,
                    ) => setValues((v) => ({ ...v, [field]: e.target.value })),
                    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
                    "aria-invalid": !!errors[field],
                    "aria-describedby": errors[field]
                      ? `error-${field}`
                      : undefined,
                    className: `w-full px-4 py-3 rounded-md bg-secondary border ${errors[field] ? "border-red-500" : "border-border"} text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors disabled:opacity-50`,
                  };
                  return (
                    <div key={field}>
                      <label htmlFor={props.id} className="sr-only">
                        {label}
                      </label>
                      {field === "message" ? (
                        <textarea
                          {...props}
                          rows={5}
                          maxLength={2000}
                          className={props.className + " resize-none"}
                        />
                      ) : (
                        <input
                          {...props}
                          type={field === "email" ? "email" : "text"}
                          autoComplete={field}
                          maxLength={field === "name" ? 80 : 254}
                        />
                      )}
                      {errors[field] && (
                        <p
                          id={`error-${field}`}
                          role="alert"
                          className="mt-1.5 text-xs text-red-500"
                        >
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-end">
                  <span
                    className={`text-xs tabular-nums ${values.message.length >= 1800 ? "text-yellow-500" : "text-muted-foreground"}`}
                    aria-live="polite"
                  >
                    {2000 - values.message.length} remaining
                  </span>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-500">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {sending ? "Sending…" : "Send Message"}
                </button>
                {Object.values(values).some(Boolean) && !sending && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="text-xs text-muted-foreground underline underline-offset-4"
                    >
                      Clear form
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
