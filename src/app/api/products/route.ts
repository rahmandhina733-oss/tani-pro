// ─────────────────────────────────────────────────────────────
//  TaniPro — Products API Route
//  GET  /api/products  — list products (with filters)
//  POST /api/products  — create product (farmer only)
// ─────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category  = searchParams.get("category");
    const farmerId  = searchParams.get("farmerId");
    const search    = searchParams.get("search");
    const minPrice  = searchParams.get("minPrice");
    const maxPrice  = searchParams.get("maxPrice");
    const inStock   = searchParams.get("inStock");
    const organic   = searchParams.get("organic");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "12");

    let products = [...mockProducts];

    // ── Filters ───────────────────────────────────────────────
    if (category)  products = products.filter((p) => p.category === category);
    if (farmerId)  products = products.filter((p) => p.farmerId === farmerId);
    if (inStock === "true") products = products.filter((p) => p.stock > 0);
    if (organic === "true") products = products.filter((p) => p.organicCert);

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.farmerProvince.toLowerCase().includes(q)
      );
    }

    if (minPrice) products = products.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) products = products.filter((p) => p.price <= parseFloat(maxPrice));

    // ── Pagination ────────────────────────────────────────────
    const total  = products.length;
    const offset = (page - 1) * limit;
    const data   = products.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[PRODUCTS GET]", err);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      farmerId, name, description, price, stock,
      isPreOrder, preOrderDays, category,
      weightPerUnit, volumePerUnit,
      lengthCm, widthCm, heightCm,
      organicCert,
    } = body;

    // Basic validation
    if (!farmerId || !name || !price || !category || !weightPerUnit) {
      return NextResponse.json(
        { success: false, error: "Field wajib tidak lengkap." },
        { status: 400 }
      );
    }

    // In production: save to DB via Prisma
    const newProduct = {
      id: `prod_${Date.now()}`,
      farmerId,
      farmerName: "Farmer Name", // fetch from DB in production
      farmerProvince: "Jawa Barat",
      name,
      description: description ?? "",
      price: parseFloat(price),
      stock: parseFloat(stock ?? "0"),
      isPreOrder: isPreOrder ?? false,
      preOrderDays: preOrderDays ?? null,
      category,
      weightPerUnit: parseFloat(weightPerUnit),
      volumePerUnit: volumePerUnit
        ? parseFloat(volumePerUnit)
        : ((parseFloat(lengthCm ?? "0") * parseFloat(widthCm ?? "0") * parseFloat(heightCm ?? "0")) / 1_000_000),
      organicCert: organicCert ?? false,
      harvestDate: null,
      imageUrl: null,
      rating: 0,
      sold: 0,
    };

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (err) {
    console.error("[PRODUCTS POST]", err);
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}
