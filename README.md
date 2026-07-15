# 🌾 TaniPro — B2B Agricultural Logistics Platform

**Indonesia's premier full-stack B2B agritech platform**, connecting farmers, buyers, and logistics in one intelligent ecosystem.

---

## ✨ Feature Overview

| Feature | Description |
|---|---|
| 🔐 **Auth & Roles** | Glassmorphism login, ADMIN / FARMER / BUYER role routing |
| 🧑‍🌾 **Petani Workspace** | Dashboard, product management, escrow tracking, AI consultant |
| 🛒 **Pembeli Workspace** | B2B catalog, smart cart, VMS checkout, ESG reporting |
| 🎛️ **Admin Command Center** | Revenue analytics, live VMS map, Tani Point leaderboard |
| 🚛 **VMS Optimization** | Smart vehicle recommendation (CDE/CDD/Fuso) via `/api/checkout/optimize` |
| 🌿 **ESG Tracking** | CO₂e savings dashboard with CSV export |
| 🏆 **Tani Point** | Gamification: 1,000 pts/buyer transaction, 100 pts/farmer shipment |
| 🤖 **AI Consultant** | Elegant chat UI with mocked data-driven agricultural insights |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# 3. Generate Prisma client + push schema
npm run db:generate
npm run db:push

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Redirect |
|---|---|---|---|
| **Admin** | `admin@tanipro.id` | `admin123` | `/admin` |
| **Petani (Farmer)** | `budi@petani.id` | `petani123` | `/petani` |
| **Pembeli (Buyer)** | `andi@pembeli.id` | `pembeli123` | `/pembeli` |

---

## 🏗️ Architecture

```
tanipro/
├── prisma/
│   └── schema.prisma          # PostgreSQL/SQLite schema
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # → redirect to /login
│   │   ├── globals.css         # Premium dark theme, glassmorphism utilities
│   │   ├── login/
│   │   │   └── page.tsx        # Animated glassmorphism login
│   │   ├── api/
│   │   │   ├── auth/route.ts            # POST: login, GET: session check
│   │   │   ├── products/route.ts        # GET: list+filter, POST: create
│   │   │   └── checkout/optimize/route.ts  # POST: VMS Smart Load Optimization
│   │   ├── admin/
│   │   │   └── page.tsx        # Command center, VMS map, gamification
│   │   ├── petani/
│   │   │   ├── page.tsx        # Farmer dashboard
│   │   │   └── ai-consultant/
│   │   │       └── page.tsx    # AI chat interface
│   │   └── pembeli/
│   │       └── page.tsx        # Buyer catalog + cart + ESG
│   ├── components/
│   │   └── ui/
│   │       └── DashboardLayout.tsx  # Shared sidebar/header layout
│   ├── lib/
│   │   └── mockData.ts         # Mock products, orders, shipments, analytics
│   └── store/
│       └── useStore.ts         # Zustand: auth + cart + UI state
├── tailwind.config.ts          # TaniPro premium theme tokens
├── next.config.ts
└── package.json
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Emerald 500** | `#10b981` | Primary accent, buttons, highlights |
| **Emerald 700** | `#047857` | Button hover, dark accents |
| **Emerald 400** | `#34d399` | Text gradient, icons |
| **Slate 50** | `#f8fafc` | Primary text |
| **Slate 400** | `#94a3b8` | Secondary text |
| **Glass bg** | `rgba(255,255,255,0.05)` | Cards, containers |
| **App bg** | `radial-gradient(top-right, #0f2a1a, #0B1410, #000)` | Page background |

### Utility Classes (globals.css)

```css
.glass             /* Glassmorphism: bg, blur, border, shadow */
.glass-hover       /* Hover elevation + emerald border tint */
.glass-emerald     /* Emerald-tinted glass card */
.text-gradient-emerald  /* Green text shimmer */
.text-gradient-hero     /* White → emerald heading gradient */
.btn-emerald       /* Gradient button with glow shadow */
.badge-emerald     /* Green pill badge */
.badge-amber       /* Amber pill badge */
.badge-blue        /* Blue pill badge */
.badge-red         /* Red pill badge */
.app-bg            /* Full page radial dark-green gradient */
.tani-input        /* Styled form input with glass effect */
.nav-item          /* Sidebar nav item */
.chat-bubble-ai    /* AI chat message bubble */
.chat-bubble-user  /* User chat message bubble */
.progress-bar      /* Progress container */
.progress-fill     /* Animated emerald fill */
```

---

## 🔌 API Reference

### `POST /api/auth`
```json
// Request
{ "email": "budi@petani.id", "password": "petani123", "role": "FARMER" }

// Response
{ "success": true, "user": { "id": "...", "name": "...", "role": "FARMER" }, "redirect": "/petani", "token": "mock_jwt_..." }
```

### `GET /api/products`
Query params: `category`, `farmerId`, `search`, `minPrice`, `maxPrice`, `inStock`, `organic`, `page`, `limit`

### `POST /api/checkout/optimize`
```json
// Request
{
  "items": [{ "productId": "...", "quantity": 500, "weightPerUnit": 1, "volumePerUnit": 0.0015 }],
  "distanceKm": 300,
  "originProvince": "Jawa Barat",
  "destProvince": "DKI Jakarta"
}

// Response — recommendation + alternatives + breakdown
{
  "success": true,
  "data": {
    "recommendation": {
      "vehicleType": "CDD",
      "totalActualWeightKg": 500,
      "loadEfficiency": 72,
      "estimatedCostIDR": 3050000,
      "carbonSavedKgCO2e": 60
    },
    "alternatives": [...],
    "breakdown": [...]
  }
}
```

---

## 🗃️ Database (Prisma)

Switch between SQLite (local dev) and PostgreSQL (production) in `prisma/schema.prisma`:

```prisma
// Local dev
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Production
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Models:** `User`, `Product`, `Order`, `OrderItem`, `Shipment`, `PointLedger`

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `next@14` | App Router, API Routes, SSR |
| `@prisma/client` | Database ORM |
| `framer-motion` | Page/card/drawer animations |
| `zustand` | Cart + auth global state |
| `recharts` | Revenue and ESG charts |
| `lucide-react` | Icon system |
| `tailwindcss` | Utility-first styling |
| `tailwindcss-animate` | CSS animation utilities |

---

## 🚀 Production Deployment

```bash
# Build
npm run build

# Environment variables (Vercel / Railway / Render)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://your-domain.com"
```

---

## 📋 Roadmap

- [ ] Real NextAuth.js session management  
- [ ] Prisma DB seeding script (`prisma/seed.ts`)  
- [ ] Real-time notifications with Server-Sent Events  
- [ ] Google Maps integration for VMS tracking  
- [ ] Stripe/Xendit payment gateway for escrow  
- [ ] PDF report generation for ESG dashboard  
- [ ] Push notifications via Firebase FCM  
- [ ] Mobile app (React Native / Expo)

---

*Built with ❤️ for Indonesian agriculture · TaniPro © 2024*
