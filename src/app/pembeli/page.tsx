"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  TrendingUp, TrendingDown, Plus, Minus, Trash2,
  Download, Leaf, Star, ChevronRight, Search, Filter,
  Truck, CheckCircle2, DollarSign, Globe, ShoppingBag,
  Zap, X, AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import {
  mockProducts, mockESGData, formatIDR, categoryLabel,
} from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ── Nav ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/pembeli",        label: "Dashboard",   icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/pembeli/katalog", label: "Katalog B2B",  icon: <Package className="w-4 h-4" /> },
  { href: "/pembeli/pesanan", label: "Pesanan Saya", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/pembeli/esg",     label: "Laporan ESG",  icon: <Leaf className="w-4 h-4" /> },
];

// ── Cart item type ────────────────────────────────────────────

interface CartItemLocal {
  productId:    string;
  name:         string;
  price:        number;
  quantity:     number;
  weightPerUnit: number;
  volumePerUnit: number;
  farmerName:   string;
}

// ── Product Card ──────────────────────────────────────────────

function ProductCard({
  product, onAddToCart, inCart,
}: {
  product: (typeof mockProducts)[0];
  onAddToCart: (p: (typeof mockProducts)[0]) => void;
  inCart: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl overflow-hidden glass-hover group"
    >
      {/* Image placeholder */}
      <div
        className="h-36 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            hsl(${(product.name.charCodeAt(0) * 7) % 360}, 30%, 12%) 0%,
            hsl(${(product.name.charCodeAt(0) * 7 + 60) % 360}, 25%, 8%) 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">
          {product.category === "GRAINS" ? "🌾" :
           product.category === "VEGETABLES" ? "🥬" :
           product.category === "FRUITS" ? "🍋" :
           product.category === "SPICES" ? "🌶️" : "📦"}
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {product.organicCert && (
            <span className="badge-emerald text-[9px]">🌿 Organik</span>
          )}
          {product.isPreOrder && (
            <span className="badge-amber text-[9px]">⏳ Pre-Order</span>
          )}
          {product.stock === 0 && (
            <span className="badge-red text-[9px]">Habis</span>
          )}
        </div>
        {/* Province */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] text-white/60 bg-black/40 px-2 py-0.5 rounded-full">
            📍 {product.farmerProvince}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[9px] text-slate-500 uppercase tracking-wide font-semibold mb-1">
          {categoryLabel[product.category]}
        </p>
        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-500 mb-3">oleh {product.farmerName}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-slate-300 font-medium">{product.rating}</span>
          <span className="text-[10px] text-slate-600">({product.sold.toLocaleString("id-ID")} kg terjual)</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-base font-bold text-white">
              {formatIDR(product.price)}
            </p>
            <p className="text-[10px] text-slate-500">/kg · Min. 100 kg</p>
          </div>
          <motion.button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
              ${product.stock === 0
                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                : inCart
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                : "btn-emerald text-white"
              }
            `}
          >
            {product.stock === 0 ? (
              <>Pre-Order</>
            ) : inCart ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> Ditambahkan</>
            ) : (
              <><Plus className="w-3.5 h-3.5" /> Tambah</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────

function CartDrawer({
  items, onRemove, onQtyChange, onClose, onOptimize, isOptimizing, recommendation,
}: {
  items: CartItemLocal[];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onClose: () => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  recommendation: any;
}) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col border-l border-white/10"
      style={{ background: "rgba(11,20,16,0.97)", backdropFilter: "blur(20px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/8">
        <h3 className="font-bold text-white">Keranjang Belanja</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Keranjang kosong</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="glass rounded-xl p-3">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-white leading-snug">{item.name}</p>
                <button
                  onClick={() => onRemove(item.productId)}
                  className="text-slate-600 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-2">oleh {item.farmerName}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQtyChange(item.productId, item.quantity - 100)}
                    className="w-6 h-6 rounded-lg bg-white/8 text-white flex items-center justify-center hover:bg-white/15 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm text-white font-medium w-16 text-center">
                    {item.quantity.toLocaleString("id-ID")} kg
                  </span>
                  <button
                    onClick={() => onQtyChange(item.productId, item.quantity + 100)}
                    className="w-6 h-6 rounded-lg bg-white/8 text-white flex items-center justify-center hover:bg-white/15 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-bold text-white">{formatIDR(item.price * item.quantity)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VMS Recommendation */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-3 glass-emerald rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">VMS Rekomendasi</span>
            <span className="badge-emerald text-[9px]">Smart Load</span>
          </div>
          <p className="text-lg font-bold text-white mb-1">
            {recommendation.recommendation.vehicleName}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            {[
              { label: "Berat",    value: `${recommendation.recommendation.totalActualWeightKg} kg` },
              { label: "Efisiensi", value: `${recommendation.recommendation.loadEfficiency}%` },
              { label: "CO₂ Saved", value: `${recommendation.recommendation.carbonSavedKgCO2e} kg` },
            ].map((s) => (
              <div key={s.label} className="bg-emerald-500/10 rounded-lg p-2">
                <p className="text-xs font-bold text-emerald-400">{s.value}</p>
                <p className="text-[9px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-white mt-2">
            Est. Biaya: {formatIDR(recommendation.recommendation.estimatedCostIDR)}
          </p>
        </motion.div>
      )}

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-white/8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="font-bold text-white">{formatIDR(total)}</span>
          </div>

          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="w-full py-3 rounded-xl text-sm font-semibold border border-emerald-500/30 text-emerald-400
                       hover:bg-emerald-500/10 transition-all duration-200 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <><Zap className="w-4 h-4 animate-pulse" /> Mengoptimasi muatan...</>
            ) : (
              <><Truck className="w-4 h-4" /> Optimalkan Muatan (VMS)</>
            )}
          </button>

          <button className="w-full py-3 rounded-xl text-sm font-semibold text-white btn-emerald
                             flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Lanjutkan Pembayaran
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── ESG Chart ─────────────────────────────────────────────────

function ESGDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: "🌿", label: "Total CO₂ Dihemat",  value: "1.053 kg CO₂e", sub: "Jan 2024",       color: "text-emerald-400" },
          { icon: "🛣️", label: "Jarak Dioptimasi",   value: "34.600 km",      sub: "rute TaniPro",   color: "text-blue-400"    },
          { icon: "🏆", label: "Skor ESG Anda",       value: "87 / 100",       sub: "Top 15% pembeli", color: "text-amber-400"   },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-[10px] text-slate-600">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Jejak Karbon Dihemat</h3>
            <p className="text-xs text-slate-500">vs. Pengiriman Konvensional</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={mockESGData}>
            <defs>
              <linearGradient id="esgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "rgba(11,20,16,0.95)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0.75rem" }}
              labelStyle={{ color: "#94a3b8", fontSize: 10 }}
              itemStyle={{ color: "#10b981", fontSize: 11 }}
            />
            <Area type="monotone" dataKey="co2Saved" stroke="#10b981" strokeWidth={2} fill="url(#esgGrad)" name="CO₂ Dihemat (kg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function PembelijDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "esg">("dashboard");
  const [cart, setCart]             = useState<CartItemLocal[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("ALL");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const addToCart = (product: (typeof mockProducts)[0]) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) return prev;
      return [...prev, {
        productId:    product.id,
        name:         product.name,
        price:        product.price,
        quantity:     500,
        weightPerUnit: product.weightPerUnit,
        volumePerUnit: product.volumePerUnit,
        farmerName:   product.farmerName,
      }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== id));

  const changeQty = (id: string, qty: number) =>
    setCart((prev) =>
      qty < 100
        ? prev.filter((i) => i.productId !== id)
        : prev.map((i) => i.productId === id ? { ...i, quantity: qty } : i)
    );

  const optimizeLoad = async () => {
    setIsOptimizing(true);
    try {
      const res  = await fetch("/api/checkout/optimize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          items: cart.map((i) => ({
            productId:    i.productId,
            quantity:     i.quantity,
            weightPerUnit: i.weightPerUnit,
            volumePerUnit: i.volumePerUnit,
          })),
          distanceKm: 300,
          originProvince: "Jawa Barat",
          destProvince:   "DKI Jakarta",
        }),
      });
      const data = await res.json();
      if (data.success) setRecommendation(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const filteredProducts = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.farmerName.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "ALL" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalSpent   = 534_000_000;
  const activeOrders = 3;
  const savedCO2     = 124.1;

  return (
    <DashboardLayout navItems={NAV_ITEMS} role="BUYER" userName="Pak Andi" userPoints={3450}>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

        {/* ── Top bar with cart button ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-display text-gradient-white">
              Buyer Workspace
            </h1>
            <p className="text-xs text-slate-500">PT. Sumber Makmur · Jakarta</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                       border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/30
                       hover:bg-emerald-500/8 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Keranjang</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit">
          {([
            { key: "dashboard", label: "Dashboard" },
            { key: "catalog",   label: "Katalog B2B" },
            { key: "esg",       label: "Laporan ESG" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Dashboard Tab ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: <Package className="w-5 h-5" />,    label: "Komoditas Tersedia", value: `${mockProducts.filter(p => p.stock > 0).length}`, trend: "+3 baru",   up: true  },
                { icon: <ShoppingBag className="w-5 h-5" />, label: "Pesanan Aktif",      value: String(activeOrders), trend: "2 dalam perjalanan", up: true  },
                { icon: <DollarSign className="w-5 h-5" />,  label: "Total Pembelian",    value: `Rp ${(totalSpent/1e6).toFixed(0)}M`, trend: "+22% MoM",  up: true  },
                { icon: <Globe className="w-5 h-5" />,       label: "CO₂ Dihemat",        value: `${savedCO2} kg`,    trend: "bulan ini",         up: true  },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl p-5 glass-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {s.icon}
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                      {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.trend}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent and quick access */}
            <div className="grid lg:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-2 glass rounded-2xl p-5"
              >
                <h3 className="font-semibold text-white text-sm mb-4">Produk Populer Minggu Ini</h3>
                <div className="space-y-2">
                  {mockProducts.slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <span className="text-xs text-slate-600 w-5 text-right">{i + 1}</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg flex-shrink-0">
                        {p.category === "GRAINS" ? "🌾" : p.category === "VEGETABLES" ? "🥬" : p.category === "FRUITS" ? "🍋" : "🌶️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.farmerProvince}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-white">{formatIDR(p.price)}/kg</p>
                        <div className="flex items-center justify-end gap-0.5">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] text-slate-400">{p.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="text-slate-600 hover:text-emerald-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="space-y-3"
              >
                {/* ESG preview */}
                <div className="glass glass-emerald rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-semibold text-white text-sm">ESG Bulan Ini</h3>
                  </div>
                  <p className="text-3xl font-bold text-gradient-emerald mb-1">241 kg</p>
                  <p className="text-xs text-slate-500 mb-3">CO₂e dihemat vs konvensional</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "72%" }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1.5">Target: 335 kg CO₂e / bulan</p>
                  <button
                    onClick={() => setActiveTab("esg")}
                    className="mt-3 w-full text-xs text-emerald-400 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/8 transition-colors flex items-center justify-center gap-1"
                  >
                    Lihat Laporan <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Escrow info */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-white text-sm">Escrow Aktif</h3>
                  </div>
                  <p className="text-xl font-bold text-white mb-0.5">Rp 30,4 juta</p>
                  <p className="text-xs text-slate-500">1 pembayaran ditahan</p>
                  <p className="text-[10px] text-slate-600 mt-1">Dana akan dicairkan setelah konfirmasi penerimaan</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ── Catalog Tab ── */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari komoditas, petani, provinsi..."
                  className="tani-input pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {["ALL", "GRAINS", "VEGETABLES", "FRUITS", "SPICES"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      catFilter === cat
                        ? "bg-blue-600 text-white"
                        : "glass text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat === "ALL" ? "Semua" : categoryLabel[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProductCard
                    product={p}
                    onAddToCart={addToCart}
                    inCart={cart.some((c) => c.productId === p.id)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">Tidak ada produk ditemukan</p>
              </div>
            )}
          </div>
        )}

        {/* ── ESG Tab ── */}
        {activeTab === "esg" && <ESGDashboard />}
      </div>

      {/* ── Cart Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <CartDrawer
              items={cart}
              onRemove={removeFromCart}
              onQtyChange={changeQty}
              onClose={() => setCartOpen(false)}
              onOptimize={optimizeLoad}
              isOptimizing={isOptimizing}
              recommendation={recommendation}
            />
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
