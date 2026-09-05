import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
