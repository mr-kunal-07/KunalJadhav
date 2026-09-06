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
import ArticlesPage from "./pages/Articles";
import { lazy, Suspense } from "react";
const Admin = lazy(() => import("./pages/Admin"));
const ArticlePage = lazy(() => import("./pages/Article"));

function AppRoutes() {
  return (
    <>
      <PageSeo />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/kunal-resume" element={<Resume />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<Suspense fallback={<p role="status" className="p-10">Loading article…</p>}><ArticlePage /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<p role="status" className="p-10">Loading admin…</p>}><Admin /></Suspense>} />
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
