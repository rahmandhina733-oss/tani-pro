"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Bot,
  TrendingUp, TrendingDown, Plus, Edit2, Trash2,
  Toggle, ToggleLeft, Star, Leaf, CheckCircle2,
  Clock, AlertCircle, Truck, BarChart3, ChevronRight,
  MapPin, DollarSign, Archive, Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import {
  mockProducts, mockOrders, mockRevenueData, formatIDR, categoryLabel, statusLabel,
} from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Nav items ────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/petani",               label: "Dashboard",       icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/petani/produk",        label: "Produk Saya",     icon: <Package className="w-4 h-4" />, badge: 5 },
  { href: "/petani/pesanan",       label: "Pesanan",         icon: <ShoppingBag className="w-4 h-4" />, badge: 2 },
  { href: "/petani/ai-consultant", label: "AI Konsultan",    icon: <Bot className="w-4 h-4" /> },
  { href: "/petani/analitik",      label: "Analitik",        icon: <BarChart3 className="w-4 h-4" /> },
];

// ── Stat card ────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, trend, delay = 0, accentClass = "text-emerald-400",
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  trend?: { value: string; up: boolean }; delay?: number; accentClass?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-5 glass-hover stat-glow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClass} bg-current/10`}
             style={{ background: "rgba(16,185,129,0.12)" }}>
          <span className={accentClass}>{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
            {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
    </motion.div>
  );
}

// ── Product Row ──────────────────────────────────────────────

function ProductRow({ product, idx }: { product: (typeof mockProducts)[0]; idx: number }) {
  const [isPreOrder, setIsPreOrder] = useState(product.isPreOrder);
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="border-b border-white/5 hover:bg-white/3 transition-colors"
    >
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium text-white">{product.name}</p>
          <p className="text-xs text-slate-500">{categoryLabel[product.category]}</p>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-300">{formatIDR(product.price)}/kg</td>
      <td className="py-3 px-4">
        <span className={product.stock > 0 ? "badge-emerald" : "badge-red"}>
          {product.stock > 0 ? `${product.stock.toLocaleString("id-ID")} kg` : "Habis"}
        </span>
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => setIsPreOrder(!isPreOrder)}
          className={`flex items-center gap-1.5 text-xs transition-colors ${isPreOrder ? "text-amber-400" : "text-slate-600"}`}
        >
          {isPreOrder ? <Toggle className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {isPreOrder ? "Pre-Order" : "Normal"}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-slate-300">{product.rating}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/10">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Order Card ───────────────────────────────────────────────

function OrderCard({ order, idx }: { order: (typeof mockOrders)[0]; idx: number }) {
  const s = statusLabel[order.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="glass rounded-xl p-4 glass-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 font-mono">{order.id}</p>
          <p className="text-sm font-semibold text-white mt-0.5">{order.buyerName}</p>
        </div>
        <span className={s.color}>{s.label}</span>
      </div>
      <div className="space-y-1 mb-3">
        {order.items.map((item, i) => (
          <p key={i} className="text-xs text-slate-400">
            {item.name} · {item.qty.toLocaleString("id-ID")} {item.unit}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/8">
        <div>
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-sm font-bold text-white">{formatIDR(order.totalAmount)}</p>
        </div>
        {/* Escrow indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${
          order.status === "COMPLETED" ? "text-emerald-400" :
          order.status === "ESCROW_HELD" ? "text-amber-400" : "text-blue-400"
        }`}>
          {order.status === "COMPLETED"
            ? <CheckCircle2 className="w-3.5 h-3.5" />
            : order.status === "ESCROW_HELD"
            ? <AlertCircle className="w-3.5 h-3.5" />
            : <Clock className="w-3.5 h-3.5" />
          }
          <span>
            {order.status === "COMPLETED" ? "Dana dicairkan" :
             order.status === "ESCROW_HELD" ? "Dana di-escrow" : "Dikirim"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Custom Chart Tooltip ─────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-emerald-400 font-bold">Rp {payload[0]?.value}M</p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function PetaniDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");

  const farmerProducts = mockProducts.filter((p) => p.farmerId === "user_farmer_001");
  const farmerOrders   = mockOrders.filter((o) => o.farmerId === "user_farmer_001");
  const totalRevenue   = farmerOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalSold      = farmerProducts.reduce((s, p) => s + p.sold, 0);

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      role="FARMER"
      userName="Budi Santoso"
      userPoints={1840}
    >
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

        {/* ── Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-6 lg:p-8"
          style={{
            background: "linear-gradient(135deg, #0f2a1a 0%, #0a3d20 50%, #052e16 100%)",
            border: "1px solid rgba(16,185,129,0.20)",
            boxShadow: "0 0 60px rgba(16,185,129,0.08)",
          }}
        >
          {/* decorative orb */}
          <div
            className="absolute -right-20 -top-20 w-60 h-60 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #10b981, transparent 70%)", filter: "blur(40px)" }}
          />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">
                  Petani Dashboard
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold font-display text-gradient-hero mb-2">
                Selamat Datang, Budi! 🌾
              </h1>
              <p className="text-slate-400 text-sm max-w-md">
                Platform Anda berjalan dengan baik. Hari ini ada{" "}
                <span className="text-emerald-400 font-semibold">2 pesanan baru</span> menunggu konfirmasi.
              </p>
            </div>
            <Link
              href="/petani/ai-consultant"
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white btn-emerald"
            >
              <Zap className="w-4 h-4" />
              AI Konsultan
            </Link>
          </div>
          <div className="relative z-10 flex gap-4 mt-5 flex-wrap">
            {[
              { icon: <MapPin className="w-3.5 h-3.5" />, label: "Jawa Barat" },
              { icon: <Star className="w-3.5 h-3.5" />,   label: "Rating 4.9" },
              { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Terverifikasi" },
            ].map((tag) => (
              <div key={tag.label} className="flex items-center gap-1.5 text-xs text-emerald-300/80">
                {tag.icon}
                {tag.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<Package className="w-5 h-5" />}  label="Total Komoditas" value={String(farmerProducts.length)}        trend={{ value: "+1 bulan ini", up: true }}  delay={0.05} />
          <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Pesanan Aktif"  value={String(farmerOrders.length)}         trend={{ value: "2 menunggu",  up: true }}  delay={0.10} />
          <StatCard icon={<DollarSign className="w-5 h-5" />}  label="Total Pendapatan" value={`Rp ${(totalRevenue / 1e6).toFixed(0)}M`} trend={{ value: "+18% bulan ini", up: true }} delay={0.15} />
          <StatCard icon={<Archive className="w-5 h-5" />}   label="Total Terjual"   value={`${totalSold.toLocaleString("id-ID")} kg`} trend={{ value: "+340 kg", up: true }}       delay={0.20} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit">
          {(["overview", "products", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-emerald-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "overview" ? "Ikhtisar" : tab === "products" ? "Produk" : "Pesanan"}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 lg:col-span-3"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">Grafik Pendapatan</h3>
                  <p className="text-xs text-slate-500">6 bulan terakhir</p>
                </div>
                <div className="badge-emerald">+18%</div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="farmRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#10b981" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#farmRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick stats */}
            <div className="lg:col-span-2 space-y-3">
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-4">Produk Teratas</h3>
                {farmerProducts.slice(0, 3).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{p.name}</p>
                      <div className="progress-bar mt-1">
                        <div className="progress-fill" style={{ width: `${(p.sold / 2100) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{p.sold}kg</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-5 glass-emerald">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-white text-sm">Escrow Status</h3>
                </div>
                <div className="space-y-2">
                  {farmerOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate max-w-[100px]">{o.buyerName}</span>
                      <span className={statusLabel[o.status].color}>
                        {statusLabel[o.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h3 className="font-semibold text-white">Manajemen Produk</h3>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white btn-emerald">
                <Plus className="w-3.5 h-3.5" /> Tambah Produk
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Produk", "Harga", "Stok", "Status", "Rating", "Aksi"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map((p, i) => (
                    <ProductRow key={p.id} product={p} idx={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Pesanan Masuk</h3>
              <Link href="/petani/pesanan" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Lihat semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockOrders.map((o, i) => (
                <OrderCard key={o.id} order={o} idx={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
