import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import Resume from "./pages/Resume";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import PageSeo from "./components/PageSeo";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  return (
    <>
      <PageSeo />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/kunal-resume" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = ({ url }: { url?: string }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <MotionConfig reducedMotion="user">
      <Sonner />
      {url ? (
        <MemoryRouter
          initialEntries={[url]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRoutes />
        </MemoryRouter>
      ) : (
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRoutes />
        </BrowserRouter>
      )}
      <Analytics />
      <SpeedInsights />
    </MotionConfig>
  </ThemeProvider>
);

export default App;
