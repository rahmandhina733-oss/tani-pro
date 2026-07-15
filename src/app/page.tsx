"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, ShieldCheck, ShoppingCart, ChevronRight,
  Eye, EyeOff, Loader2, Sprout, BarChart3, Truck,
} from "lucide-react";

// ── Role definitions ─────────────────────────────────────────

type RoleKey = "ADMIN" | "FARMER" | "BUYER";

const ROLES: {
  key:         RoleKey;
  label:       string;
  sublabel:    string;
  icon:        React.ReactNode;
  email:       string;
  password:    string;
  color:       string;
  borderColor: string;
  bgColor:     string;
}[] = [
  {
    key:         "BUYER",
    label:       "Pembeli",
    sublabel:    "B2B Buyer Workspace",
    icon:        <ShoppingCart className="w-5 h-5" />,
    email:       "andi@pembeli.id",
    password:    "pembeli123",
    color:       "text-blue-400",
    borderColor: "border-blue-500/40",
    bgColor:     "bg-blue-500/10",
  },
  {
    key:         "FARMER",
    label:       "Petani",
    sublabel:    "Farmer Dashboard",
    icon:        <Sprout className="w-5 h-5" />,
    email:       "budi@petani.id",
    password:    "petani123",
    color:       "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgColor:     "bg-emerald-500/10",
  },
  {
    key:         "ADMIN",
    label:       "Admin",
    sublabel:    "Command Center",
    icon:        <BarChart3 className="w-5 h-5" />,
    email:       "admin@tanipro.id",
    password:    "admin123",
    color:       "text-purple-400",
    borderColor: "border-purple-500/40",
    bgColor:     "bg-purple-500/10",
  },
];

// ── Floating orbs background ─────────────────────────────────

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute -bottom-20 -left-40 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #047857 0%, transparent 70%)", filter: "blur(50px)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 60%)", filter: "blur(80px)" }}
      />
    </div>
  );
}

// ── Grid pattern overlay ──────────────────────────────────────

function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// ── Main Login Page ───────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<RoleKey>("BUYER");
  const [email, setEmail]               = useState("andi@pembeli.id");
  const [password, setPassword]         = useState("pembeli123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");

  const handleRoleSelect = (role: typeof ROLES[0]) => {
    setSelectedRole(role.key);
    setEmail(role.email);
    setPassword(role.password);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res  = await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();

      if (data.success) {
        // Store user in localStorage (replace with proper auth in production)
        localStorage.setItem("tanipro_user",  JSON.stringify(data.user));
        localStorage.setItem("tanipro_token", data.token);
        router.push(data.redirect);
      } else {
        setError(data.error ?? "Login gagal.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeRole = ROLES.find((r) => r.key === selectedRole)!;

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingOrbs />
      <GridPattern />

      <div className="w-full max-w-md relative z-10">
        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-emerald-md"
               style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display text-gradient-hero mb-1">
            TaniPro
          </h1>
          <p className="text-sm text-slate-400">
            Platform Agrilogistik B2B Indonesia
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          {/* Role selector */}
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
            Masuk sebagai
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map((role) => (
              <motion.button
                key={role.key}
                type="button"
                onClick={() => handleRoleSelect(role)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center
                  transition-all duration-200 cursor-pointer
                  ${selectedRole === role.key
                    ? `${role.bgColor} ${role.borderColor} ${role.color}`
                    : "border-white/8 text-slate-500 hover:border-white/15 hover:text-slate-300"
                  }
                `}
              >
                <span>{role.icon}</span>
                <span className="text-xs font-semibold">{role.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Selected role info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-6 text-xs ${activeRole.bgColor} ${activeRole.color} border ${activeRole.borderColor}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Demo akun: <span className="font-mono">{activeRole.email}</span></span>
            </motion.div>
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tani-input"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tani-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-sm text-white
                flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 mt-2
                ${isLoading ? "bg-emerald-700" : "btn-emerald"}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke {activeRole.label} Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              VMS Logistics
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Escrow Payment
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              ESG Tracking
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-700">
            © 2024 TaniPro · Menghubungkan Petani & Pembeli Indonesia
          </p>
        </motion.div>
      </div>
    </div>
  );
}
