"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, ShoppingBag, Map,
  Award, Settings, TrendingUp, TrendingDown,
  DollarSign, Truck, Leaf, Activity, Zap,
  Star, ChevronRight, BarChart3, Radio,
  Globe, Package, AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import {
  mockFarmers, mockBuyers, mockRevenueData, mockShipments, formatIDR,
} from "@/lib/mockData";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

// ── Nav ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/admin",              label: "Command Center", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/farmers",      label: "Petani",         icon: <Users className="w-4 h-4" />, badge: 5 },
  { href: "/admin/buyers",       label: "Pembeli",        icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/admin/vms",          label: "VMS Live Map",   icon: <Map className="w-4 h-4" /> },
  { href: "/admin/gamification", label: "Tani Point",     icon: <Award className="w-4 h-4" /> },
  { href: "/admin/settings",     label: "Pengaturan",     icon: <Settings className="w-4 h-4" /> },
];

// ── Animated counter ──────────────────────────────────────────

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end       = value;
    const duration  = 1200;
    const stepTime  = 16;
    const steps     = duration / stepTime;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("id-ID")}{suffix}</span>;
}

// ── VMS Live Map (SVG mock) ───────────────────────────────────

function VMSLiveMap() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  // Animated vehicle positions
  const vehicles = [
    { id: "V01", type: "FUSO", driver: "Eko Prasetyo",  x: 45 + Math.sin(tick * 0.3) * 3,     y: 38 + Math.cos(tick * 0.2) * 2,     status: "IN_TRANSIT",       color: "#10b981" },
    { id: "V02", type: "CDD",  driver: "Joko Susanto",  x: 62 + Math.cos(tick * 0.25) * 4,    y: 55 + Math.sin(tick * 0.35) * 3,    status: "OUT_FOR_DELIVERY", color: "#3b82f6" },
    { id: "V03", type: "FUSO", driver: "Rendi Saputra", x: 71 + Math.sin(tick * 0.4 + 1) * 3, y: 68 + Math.cos(tick * 0.3 + 2) * 2, status: "DELIVERED",        color: "#8b5cf6" },
  ];

  return (
    <div className="vms-map h-64 lg:h-72 relative">
      <svg width="100%" height="100%" viewBox="0 0 200 120">
        {/* Grid dots */}
        {Array.from({ length: 12 }, (_, x) =>
          Array.from({ length: 8 }, (_, y) => (
            <circle key={`${x}-${y}`} cx={x * 18 + 8} cy={y * 16 + 8} r="0.5" fill="rgba(16,185,129,0.15)" />
          ))
        )}

        {/* Road network */}
        <path d="M 10 60 Q 60 40 110 60 Q 150 75 190 55" className="vms-road" strokeDashoffset={tick * 2} />
        <path d="M 30 10 Q 50 45 45 80 Q 45 100 60 115" className="vms-road" strokeDashoffset={-tick * 1.5} />
        <path d="M 80 5 Q 100 40 110 60 Q 120 80 160 100" className="vms-road" strokeDashoffset={tick * 1.8} />
        <path d="M 140 10 Q 155 45 162 60 Q 170 80 175 110" className="vms-road" strokeDashoffset={-tick * 2} />

        {/* City markers */}
        {[
          { x: 15,  y: 58, label: "Bdg" },
          { x: 108, y: 58, label: "Jkt" },
          { x: 160, y: 98, label: "Sby" },
        ].map((city) => (
          <g key={city.label}>
            <circle cx={city.x} cy={city.y} r="4" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.50)" strokeWidth="1" />
            <text x={city.x} y={city.y + 9} textAnchor="middle" fontSize="4" fill="rgba(255,255,255,0.50)">{city.label}</text>
          </g>
        ))}

        {/* Vehicles */}
        {vehicles.map((v) => (
          <g key={v.id} className="vms-vehicle" style={{ animationDelay: `${v.id === "V01" ? 0 : v.id === "V02" ? 0.5 : 1}s` }}>
            <circle cx={v.x} cy={v.y} r="5" fill={v.color} fillOpacity="0.20" />
            <circle cx={v.x} cy={v.y} r="3" fill={v.color} />
            <text x={v.x} y={v.y - 6} textAnchor="middle" fontSize="3.5" fill={v.color}>{v.id}</text>
          </g>
        ))}

        {/* Pulse rings on vehicles */}
        {vehicles.map((v) => (
          <circle
            key={`ring-${v.id}`}
            cx={v.x} cy={v.y} r="7"
            fill="none"
            stroke={v.color}
            strokeWidth="0.5"
            strokeOpacity={0.4 + Math.sin(tick * 0.5) * 0.3}
          />
        ))}
      </svg>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 flex gap-3">
        {[
          { color: "#10b981", label: "Dalam Perjalanan" },
          { color: "#3b82f6", label: "Menuju Tujuan" },
          { color: "#8b5cf6", label: "Terkirim" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[9px] text-white/60">
            <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        Live
      </div>
    </div>
  );
}

// ── Gamification Table ────────────────────────────────────────

function GamificationTable() {
  const allUsers = [
    ...mockFarmers.map((f) => ({ ...f, type: "Petani",  pointsAction: "100 pts / komoditas" })),
    ...mockBuyers.map((b)  => ({ ...b, type: "Pembeli", pointsAction: "1000 pts / transaksi" })),
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/8">
            {["Rank", "Pengguna", "Tipe", "Poin", "Aksi Poin", ""].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allUsers.map((u, i) => (
            <motion.tr
              key={u.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors"
            >
              <td className="py-3 px-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-400" :
                  i === 1 ? "bg-slate-400/15 text-slate-300" :
                  i === 2 ? "bg-orange-600/20 text-orange-400" : "bg-white/5 text-slate-500"
                }`}>
                  {i + 1}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${
                    u.type === "Petani" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                  } flex items-center justify-center text-xs font-bold`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{"province" in u ? u.province : u.company}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={u.type === "Petani" ? "badge-emerald" : "badge-blue"}>
                  {u.type}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-bold text-gradient-emerald">
                  {u.points.toLocaleString("id-ID")}
                </span>
              </td>
              <td className="py-3 px-4 text-xs text-slate-500">{u.pointsAction}</td>
              <td className="py-3 px-4">
                <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  +Beri Poin <ChevronRight className="w-3 h-3" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Real-time traffic mock ────────────────────────────────────

function TrafficWidget() {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ t: i, req: 120 + Math.random() * 80 }))
  );
  useEffect(() => {
    const t = setInterval(() => {
      setData((prev) => [
        ...prev.slice(-19),
        { t: prev[prev.length - 1].t + 1, req: 120 + Math.random() * 100 },
      ]);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="req" stroke="#10b981" strokeWidth={1.5} fill="url(#trafficGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "vms" | "gamification">("overview");

  const platformRevenue = mockRevenueData.reduce((s, d) => s + d.revenue * 1e6 * 0.07, 0);

  return (
    <DashboardLayout navItems={NAV_ITEMS} role="ADMIN" userName="Admin TaniPro" userPoints={0}>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-6 lg:p-8"
          style={{
            background: "linear-gradient(135deg, #1a0a2e 0%, #0e0620 50%, #0a0410 100%)",
            border: "1px solid rgba(139,92,246,0.20)",
            boxShadow: "0 0 60px rgba(139,92,246,0.06)",
          }}
        >
          <div
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", filter: "blur(50px)" }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-semibold uppercase tracking-widest">Admin Command Center</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-gradient-white mb-2">
              TaniPro Platform Overview
            </h1>
            <div className="flex flex-wrap gap-4 mt-3 text-xs">
              {[
                { icon: <Radio className="w-3 h-3" />,  label: "Platform Status", value: "Operasional",     color: "text-emerald-400" },
                { icon: <Globe className="w-3 h-3" />,  label: "Uptime",          value: "99.97%",          color: "text-blue-400"    },
                { icon: <Zap className="w-3 h-3" />,    label: "API Latency",     value: "< 42ms",          color: "text-amber-400"   },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-slate-400">
                  <span className={s.color}>{s.icon}</span>
                  <span>{s.label}:</span>
                  <span className={`font-semibold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: <DollarSign className="w-5 h-5" />,
              label: "Revenue Platform (7%)",
              value: <AnimatedNumber value={Math.round(platformRevenue / 1e6)} prefix="Rp " suffix="M" />,
              sub: "6 bulan terakhir",
              trend: "+22%",
              up: true,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
            {
              icon: <Users className="w-5 h-5" />,
              label: "Petani Aktif",
              value: <AnimatedNumber value={mockFarmers.filter(f => f.status === "ACTIVE").length} />,
              sub: `${mockFarmers.length} total terdaftar`,
              trend: "+3 bulan ini",
              up: true,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              icon: <ShoppingBag className="w-5 h-5" />,
              label: "Pembeli Aktif",
              value: <AnimatedNumber value={mockBuyers.length} />,
              sub: "B2B terverifikasi",
              trend: "+1 minggu ini",
              up: true,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              icon: <Truck className="w-5 h-5" />,
              label: "Pengiriman Live",
              value: <AnimatedNumber value={3} />,
              sub: "kendaraan di jalan",
              trend: "2 on-time",
              up: true,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-5 glass-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.trend}
                </div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              {s.sub && <p className="text-[10px] text-slate-600 mt-0.5">{s.sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit">
          {([
            { key: "overview",      label: "Ikhtisar"     },
            { key: "vms",           label: "VMS Live Map" },
            { key: "gamification",  label: "Tani Point"   },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Revenue chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">Gross Merchandise Value (GMV)</h3>
                  <p className="text-xs text-slate-500">Volume transaksi platform (Rp juta)</p>
                </div>
                <span className="badge-emerald">+18% QoQ</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "rgba(15,5,35,0.95)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "0.75rem" }}
                    labelStyle={{ color: "#94a3b8", fontSize: 10 }}
                    itemStyle={{ color: "#a78bfa", fontSize: 11 }}
                  />
                  <Bar dataKey="revenue" fill="url(#adminBarGrad)" radius={[4, 4, 0, 0]} name="GMV (Rp juta)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Right column */}
            <div className="space-y-3">
              {/* Live traffic */}
              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm">API Traffic (Live)</h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                  </span>
                </div>
                <TrafficWidget />
                <p className="text-[10px] text-slate-600 mt-1">Req/sec — auto-refresh 1.5s</p>
              </motion.div>

              {/* Top Farmers */}
              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="font-semibold text-white text-sm mb-3">Top Petani</h3>
                {mockFarmers.slice(0, 3).map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
                    <span className="text-[10px] text-slate-600 w-4 text-right">{i + 1}</span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold flex-shrink-0">
                      {f.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{f.name}</p>
                      <p className="text-[9px] text-slate-500">{f.province}</p>
                    </div>
                    <p className="text-xs font-medium text-white">Rp {(f.revenue / 1e6).toFixed(0)}M</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Platform fee tracker */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 lg:col-span-3"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">Platform Fee (7%) per Transaksi</h3>
                  <p className="text-xs text-slate-500">Breakdown berdasarkan bulan</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-emerald">Total: Rp {(platformRevenue / 1e6).toFixed(1)}M</span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {mockRevenueData.map((d, i) => (
                  <div key={d.month} className="text-center">
                    <div
                      className="w-full rounded-lg mb-1.5 mx-auto"
                      style={{
                        height: `${(d.revenue / 600) * 80}px`,
                        background: `linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)`,
                        opacity: 0.7 + (i / mockRevenueData.length) * 0.3,
                        boxShadow: "0 0 10px rgba(139,92,246,0.20)",
                      }}
                    />
                    <p className="text-[9px] text-slate-500">{d.month}</p>
                    <p className="text-[10px] text-purple-400 font-bold">
                      Rp {(d.revenue * 0.07).toFixed(0)}M
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── VMS Tab ── */}
        {activeTab === "vms" && (
          <div className="grid lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="lg:col-span-2 glass rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-white text-sm">VMS Live Tracking Map</h3>
                </div>
                <span className="badge-emerald">3 Kendaraan Aktif</span>
              </div>
              <VMSLiveMap />
            </motion.div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white text-sm">Status Armada</h3>
              {mockShipments.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-4 glass-hover"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{s.id}</p>
                      <p className="text-sm font-semibold text-white">{s.driverName}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      s.trackingStatus === "DELIVERED"        ? "bg-emerald-500/15 text-emerald-400" :
                      s.trackingStatus === "OUT_FOR_DELIVERY" ? "bg-blue-500/15 text-blue-400" :
                                                                "bg-amber-500/15 text-amber-400"
                    }`}>
                      {s.trackingStatus === "DELIVERED" ? "Terkirim" :
                       s.trackingStatus === "OUT_FOR_DELIVERY" ? "Menuju Tujuan" : "Dalam Perjalanan"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Tipe",      value: s.vehicleType },
                      { label: "Muatan",    value: `${s.totalWeightKg.toLocaleString("id-ID")} kg` },
                      { label: "Efisiensi", value: `${s.loadEfficiency}%` },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/4 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold text-white">{stat.value}</p>
                        <p className="text-[9px] text-slate-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.loadEfficiency}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gamification Tab ── */}
        {activeTab === "gamification" && (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  icon: <Award className="w-5 h-5" />,
                  label: "Total Poin Beredar",
                  value: [...mockFarmers, ...mockBuyers].reduce((s, u) => s + u.points, 0).toLocaleString("id-ID"),
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Pengguna Berpartisipasi",
                  value: String(mockFarmers.length + mockBuyers.length),
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  label: "Poin Diberikan Hari Ini",
                  value: "4.350",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-xl p-4"
                >
                  <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Points rule cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  icon: <ShoppingBag className="w-4 h-4" />,
                  title: "Pembeli — 1.000 poin",
                  desc: "Setiap transaksi berhasil diselesaikan",
                  color: "text-blue-400",
                  border: "border-blue-500/20",
                  bg: "bg-blue-500/8",
                },
                {
                  icon: <Package className="w-4 h-4" />,
                  title: "Petani — 100 poin",
                  desc: "Setiap komoditas berhasil dikirim",
                  color: "text-emerald-400",
                  border: "border-emerald-500/20",
                  bg: "bg-emerald-500/8",
                },
              ].map((r) => (
                <div key={r.title} className={`glass rounded-xl p-4 border ${r.border} ${r.bg}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${r.color}`}>
                    {r.icon}
                    <span className="text-sm font-semibold">{r.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Leaderboard table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/8 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Tani Point Leaderboard
                </h3>
                <button className="text-xs text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors">
                  + Beri Poin Manual
                </button>
              </div>
              <GamificationTable />
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
