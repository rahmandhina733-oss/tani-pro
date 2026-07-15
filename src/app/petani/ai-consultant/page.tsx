"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Bot,
  Send, Sparkles, TrendingUp, CloudRain, BarChart3,
  RefreshCw, Zap, Leaf,
} from "lucide-react";
import { DashboardLayout } from "@/components/ui/DashboardLayout";

const NAV_ITEMS = [
  { href: "/petani",               label: "Dashboard",    icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/petani/produk",        label: "Produk Saya",  icon: <Package className="w-4 h-4" /> },
  { href: "/petani/pesanan",       label: "Pesanan",      icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/petani/ai-consultant", label: "AI Konsultan", icon: <Bot className="w-4 h-4" /> },
  { href: "/petani/analitik",      label: "Analitik",     icon: <BarChart3 className="w-4 h-4" /> },
];

// ── Mock AI responses ─────────────────────────────────────────

const AI_RESPONSES: Record<string, string> = {
  harga: `📊 **Analisis Harga Pasar — Beras Pandan Wangi**

Berdasarkan data agregat dari 1.240 transaksi di platform kami bulan ini:

• **Harga pasar saat ini**: Rp 14.200–15.800/kg
• **Harga Anda**: Rp 14.500/kg (✅ Kompetitif, dalam rentang optimal)
• **Tren 30 hari**: +3,2% (naik, dipengaruhi musim panen yang pendek di Cianjur)

💡 **Rekomendasi**: Pertahankan harga di Rp 14.500–15.200/kg untuk 2 minggu ke depan. Kurangi diskon bundling agar margin tetap di atas 22%.`,

  cuaca: `🌦️ **Prakiraan Cuaca & Dampak Pertanian — Jawa Barat**

Data BMKG terakhir (diperbarui 6 jam lalu):

• **Minggu ini**: Hujan ringan-sedang, 180–240 mm curah hujan
• **Suhu rata-rata**: 24–29°C (kondusif untuk padi)
• **Kelembaban**: 78–85% — ⚠️ Waspadai serangan blast dan BLB

🌾 **Rekomendasi Agronomi**:
1. Percepat jadwal panen blok C (estimasi 12–14 hari lagi)
2. Tambah drainase di petak sawah bagian barat
3. Aplikasi fungisida preventif dalam 3 hari ke depan

📈 Panen pada periode ini berpotensi memberi **harga premium +8%** karena stok nasional menipis.`,

  logistik: `🚛 **Optimasi Logistik — Pengiriman ke Jabodetabek**

Berdasarkan volume stok Anda saat ini (5.000 kg Beras Pandan Wangi):

| Kendaraan | Kapasitas | Estimasi Biaya | Efisiensi |
|-----------|-----------|----------------|-----------|
| CDE       | 2.000 kg  | Rp 1,7 juta    | 72%       |
| **CDD**   | **5.000 kg** | **Rp 2,8 juta** | **🔥 96%** |
| Fuso      | 12.000 kg | Rp 5,1 juta    | 42%       |

✅ **Rekomendasi**: Gunakan **1× CDD** untuk menghemat Rp 900.000 vs 2× CDE.
🌿 Penghematan emisi: **42 kg CO₂e** dibanding pengiriman konvensional.`,

  default: `🤖 **TaniPro AI Konsultan**

Halo, Budi! Saya siap membantu mengoptimalkan usaha pertanian Anda dengan data pasar real-time.

Topik yang bisa saya bantu:
• 📊 **Analisis harga** pasar komoditas
• 🌦️ **Cuaca & agronomi** — kapan waktu tanam/panen terbaik
• 🚛 **Optimasi logistik** — rekomendasi kendaraan & rute
• 💰 **Strategi penjualan** — bundling & pricing dinamis
• 🌿 **ESG & sertifikasi** — panduan organik

Tanyakan sesuatu, atau klik salah satu topik cepat di bawah!`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("harga") || lower.includes("price") || lower.includes("jual")) return AI_RESPONSES.harga;
  if (lower.includes("cuaca") || lower.includes("hujan") || lower.includes("panen")) return AI_RESPONSES.cuaca;
  if (lower.includes("logistik") || lower.includes("kirim") || lower.includes("truck") || lower.includes("kendaraan")) return AI_RESPONSES.logistik;
  return `💬 Pertanyaan Anda: "${input}"\n\nSaat ini saya sedang menganalisis data pasar untuk memberi jawaban terbaik. Berdasarkan tren terkini, kondisi pertanian di Jawa Barat menunjukkan **peluang positif** dengan kenaikan permintaan komoditas hortikultura +12% bulan ini. Apakah Anda ingin saya menggali lebih detail tentang komoditas tertentu?`;
}

interface Message {
  id:      string;
  role:    "user" | "ai";
  content: string;
  ts:      string;
}

const QUICK_TOPICS = [
  { label: "📊 Analisis Harga",      prompt: "Bagaimana harga beras pandan wangi saat ini?" },
  { label: "🌦️ Prakiraan Cuaca",    prompt: "Bagaimana cuaca untuk pertanian minggu ini?" },
  { label: "🚛 Optimasi Pengiriman", prompt: "Kendaraan apa yang terbaik untuk pengiriman 5 ton beras?" },
  { label: "💰 Strategi Harga",      prompt: "Strategi pricing terbaik untuk komoditas saya?" },
];

export default function AIConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "ai", content: AI_RESPONSES.default, ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: getAIResponse(content),
      ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} role="FARMER" userName="Budi Santoso" userPoints={1840}>
      <div className="h-full flex flex-col max-w-4xl mx-auto p-4 lg:p-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #10b981, #047857)",
                boxShadow: "0 0 25px rgba(16,185,129,0.40)",
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base font-display">TaniPro AI Konsultan</h1>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Powered by TaniPro Intelligence
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([{ id: "0", role: "ai", content: AI_RESPONSES.default, ts: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }])}
              className="p-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/10"
              title="Mulai percakapan baru"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ── Chat area ── */}
        <div
          className="flex-1 overflow-y-auto space-y-4 mb-4 rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(16,185,129,0.12)",
            boxShadow: "0 0 40px rgba(16,185,129,0.05)",
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {msg.role === "ai" ? (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #10b981, #047857)", boxShadow: "0 0 15px rgba(16,185,129,0.30)" }}
                  >
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold">
                    B
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-slate-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-600 px-1">{msg.ts}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex gap-3"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #10b981, #047857)", boxShadow: "0 0 15px rgba(16,185,129,0.30)" }}
                >
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* ── Quick topic chips ── */}
        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK_TOPICS.map((t) => (
            <button
              key={t.label}
              onClick={() => sendMessage(t.prompt)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400
                         hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/8
                         transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div
          className="flex gap-3 items-end p-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(16,185,129,0.20)",
            boxShadow: "0 0 30px rgba(16,185,129,0.08)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            placeholder="Tanyakan tentang harga pasar, cuaca, logistik, atau strategi pertanian..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600
                       resize-none outline-none min-h-[44px] max-h-[120px] leading-relaxed"
            rows={1}
            disabled={isTyping}
          />
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            whileHover={!isTyping && input.trim() ? { scale: 1.05 } : {}}
            whileTap={!isTyping && input.trim() ? { scale: 0.95 } : {}}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${input.trim() && !isTyping
                ? "btn-emerald text-white"
                : "bg-white/5 text-slate-600 cursor-not-allowed"
              }
            `}
          >
            {isTyping ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-2">
          TaniPro AI menggunakan data pasar dan agronomi dari 10.000+ transaksi. Bukan pengganti konsultan profesional.
        </p>
      </div>
    </DashboardLayout>
  );
}
