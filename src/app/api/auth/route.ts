// ─────────────────────────────────────────────────────────────
//  TaniPro — Auth API Route
//  POST /api/auth
// ─────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

// Mock user database — replace with Prisma in production
const MOCK_USERS = [
  {
    id: "user_admin_001",
    name: "Admin TaniPro",
    email: "admin@tanipro.id",
    password: "admin123",
    role: "ADMIN",
    points: 0,
    avatarUrl: null,
    company: "TaniPro Platform",
  },
  {
    id: "user_farmer_001",
    name: "Budi Santoso",
    email: "budi@petani.id",
    password: "petani123",
    role: "FARMER",
    points: 1840,
    avatarUrl: null,
    company: "Tani Jaya Farm",
  },
  {
    id: "user_buyer_001",
    name: "Pak Andi",
    email: "andi@pembeli.id",
    password: "pembeli123",
    role: "BUYER",
    points: 3450,
    avatarUrl: null,
    company: "PT. Sumber Makmur",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Find matching user
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Optionally verify role matches selection
    if (role && user.role !== role) {
      return NextResponse.json(
        { success: false, error: "Role tidak sesuai dengan akun Anda." },
        { status: 403 }
      );
    }

    // Determine redirect path based on role
    const redirectMap: Record<string, string> = {
      ADMIN:  "/admin",
      FARMER: "/petani",
      BUYER:  "/pembeli",
    };

    const redirect = redirectMap[user.role] ?? "/login";

    // Return user data (omit password)
    const { password: _pw, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      redirect,
      token: `mock_jwt_${user.id}_${Date.now()}`, // Replace with real JWT
    });
  } catch (err) {
    console.error("[AUTH] Error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

// GET /api/auth — session check (mock)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer mock_jwt_")) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
