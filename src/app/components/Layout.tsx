import { Outlet, useLocation } from "react-router";
import { Menu, X, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Animated Mesh Background ── */}
      <div className="bit-mesh-bg" aria-hidden="true" />

      {/* Sidebar - Desktop (Floating Spatial Design) */}
      <div className="hidden md:block relative z-10 shrink-0 p-4 pb-4">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 p-4 pl-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 mb-4 rounded-[2.5rem] sticky top-4 mx-4 z-30"
          style={{ background: "var(--bento-bg-strong)", border: "1px solid var(--bento-border)", backdropFilter: "blur(40px)", boxShadow: "var(--bento-shadow)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #5540DE, #2e2378)" }}>
              <span className="text-white text-[12px]" style={{ fontWeight: 800, fontFamily: "Georgia, serif" }}>BIT</span>
            </div>
            <span className="text-[16px] text-foreground" style={{ fontWeight: 800 }}>BIT Sathy</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-muted/50 transition-colors relative">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 bg-background z-50 md:hidden shadow-2xl"
                style={{ width: "280px" }}
              >
                <div className="absolute top-3 right-3 z-50">
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1.5 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <Sidebar onClose={() => setMobileNavOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth rounded-[2.5rem]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="max-w-7xl mx-auto min-h-full pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Chatbot */}
        <ChatbotWidget />
      </div>
    </div>
  );
}