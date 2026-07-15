"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Bell, LogOut, Menu, X, ChevronDown,
  TrendingUp, Award,
} from "lucide-react";

interface NavItem {
  href:   string;
  label:  string;
  icon:   React.ReactNode;
  badge?: number | string;
}

interface DashboardLayoutProps {
  children:   React.ReactNode;
  navItems:   NavItem[];
  role:       "ADMIN" | "FARMER" | "BUYER";
  userName:   string;
  userPoints: number;
}

const ROLE_CONFIG = {
  ADMIN:  { label: "Admin",   gradient: "from-purple-600 to-purple-800", accent: "text-purple-400" },
  FARMER: { label: "Petani",  gradient: "from-emerald-600 to-emerald-800", accent: "text-emerald-400" },
  BUYER:  { label: "Pembeli", gradient: "from-blue-600 to-blue-800",    accent: "text-blue-400"   },
};

export function DashboardLayout({
  children, navItems, role, userName, userPoints,
}: DashboardLayoutProps) {
  const pathname                    = usePathname();
  const router                      = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount]                  = useState(3);
  const cfg                         = ROLE_CONFIG[role];

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("tanipro_user");
    localStorage.removeItem("tanipro_token");
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/8">
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center flex-shrink-0 shadow-emerald-sm`}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm font-display">TaniPro</p>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.accent}`}>
              {cfg.label} Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <div className={`nav-item ${isActive ? "active" : ""}`}>
                <span className={isActive ? cfg.accent : ""}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="badge-emerald text-[10px] min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-white/8 space-y-3">
        {/* Tani Points */}
        <div className="glass rounded-xl px-3 py-2.5 glass-emerald">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Tani Point</span>
          </div>
          <p className="text-lg font-bold text-gradient-emerald leading-none">
            {userPoints.toLocaleString("id-ID")}
          </p>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{ width: `${Math.min(100, (userPoints % 5000) / 50)}%` }} />
          </div>
        </div>

        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className={`text-[10px] ${cfg.accent}`}>{cfg.label}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-600 hover:text-red-400 transition-colors p-1"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen app-bg overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-white/8">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden border-r border-white/8"
              style={{ background: "rgba(11,20,16,0.98)", backdropFilter: "blur(20px)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-slate-400 font-medium">TaniPro</span>
              <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              <span className={cfg.accent}>{cfg.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Trend indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Mobile avatar */}
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-xs font-bold lg:hidden`}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
