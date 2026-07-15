// ─────────────────────────────────────────────────────────────
//  TaniPro — Smart Load Optimization API
//  POST /api/checkout/optimize
//  Calculates volumetric + gravimetric weight and recommends
//  the most efficient vehicle from CDE / CDD / Fuso fleet.
// ─────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

// ── Vehicle Fleet Specs ───────────────────────────────────────
const VEHICLES = {
  CDE: {
    name:            "CDE (Cold Diesel Express)",
    maxWeightKg:     2000,
    maxVolumeM3:     8,
    baseCostIDR:     850_000,
    costPerKmIDR:    3_500,
    co2PerKmGrams:   180,    // g CO₂/km
    avgCo2Baseline:  300,    // g CO₂/km (conventional truck baseline)
    icon:            "🚐",
  },
  CDD: {
    name:            "CDD (Cold Diesel Double)",
    maxWeightKg:     5000,
    maxVolumeM3:     20,
    baseCostIDR:     1_400_000,
    costPerKmIDR:    5_500,
    co2PerKmGrams:   280,
    avgCo2Baseline:  480,
    icon:            "🚛",
  },
  FUSO: {
    name:            "Fuso (Heavy Cargo)",
    maxWeightKg:     12000,
    maxVolumeM3:     50,
    baseCostIDR:     2_800_000,
    costPerKmIDR:    9_000,
    co2PerKmGrams:   400,
    avgCo2Baseline:  700,
    icon:            "🏗️",
  },
};

// Volumetric divisor for agricultural freight (IATA-equivalent)
const VOLUMETRIC_DIVISOR = 200; // kg/m³ → convert volume to equivalent weight

interface CartItem {
  productId:     string;
  quantity:      number;   // kg
  weightPerUnit: number;   // kg
  volumePerUnit: number;   // m³
}

interface OptimizeRequest {
  items:            CartItem[];
  distanceKm:       number;
  originProvince:   string;
  destProvince:     string;
}

export async function POST(req: NextRequest) {
  try {
    const body: OptimizeRequest = await req.json();
    const { items, distanceKm = 250, originProvince = "Jawa Barat", destProvince = "DKI Jakarta" } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Keranjang belanja kosong." },
        { status: 400 }
      );
    }

    // ── 1. Calculate total actual weight & volume ─────────────
    let totalActualWeightKg = 0;
    let totalVolumeM3       = 0;

    for (const item of items) {
      totalActualWeightKg += item.weightPerUnit * item.quantity;
      totalVolumeM3       += item.volumePerUnit * item.quantity;
    }

    // ── 2. Volumetric weight (freight calculation) ────────────
    const volumetricWeightKg = totalVolumeM3 * 1000 * VOLUMETRIC_DIVISOR / 1000;
    // Chargeable weight = max(actual, volumetric) — standard logistics rule
    const chargeableWeightKg = Math.max(totalActualWeightKg, volumetricWeightKg);

    // ── 3. Select optimal vehicle ─────────────────────────────
    type VehicleKey = keyof typeof VEHICLES;
    const vehicleOrder: VehicleKey[] = ["CDE", "CDD", "FUSO"];

    let selectedVehicleKey: VehicleKey = "FUSO";
    for (const key of vehicleOrder) {
      const v = VEHICLES[key];
      if (chargeableWeightKg <= v.maxWeightKg && totalVolumeM3 <= v.maxVolumeM3) {
        selectedVehicleKey = key;
        break;
      }
    }

    const vehicle        = VEHICLES[selectedVehicleKey];
    const loadEfficiency = Math.min(
      100,
      Math.round(
        Math.max(
          (chargeableWeightKg / vehicle.maxWeightKg) * 100,
          (totalVolumeM3    / vehicle.maxVolumeM3 ) * 100
        )
      )
    );

    // ── 4. Cost calculation ───────────────────────────────────
    const estimatedCostIDR = Math.round(
      vehicle.baseCostIDR + vehicle.costPerKmIDR * distanceKm
    );

    // ── 5. ESG carbon saving vs. conventional baseline ────────
    const emissionsKgCO2 = (vehicle.co2PerKmGrams * distanceKm) / 1000;
    const baselineKgCO2  = (vehicle.avgCo2Baseline * distanceKm) / 1000;
    const carbonSavedKgCO2e = parseFloat(
      Math.max(0, baselineKgCO2 - emissionsKgCO2).toFixed(2)
    );

    // ── 6. Build response ─────────────────────────────────────
    const result = {
      recommendation: {
        vehicleType:        selectedVehicleKey,
        vehicleName:        vehicle.name,
        icon:               vehicle.icon,
        totalActualWeightKg: parseFloat(totalActualWeightKg.toFixed(2)),
        volumetricWeightKg:  parseFloat(volumetricWeightKg.toFixed(2)),
        chargeableWeightKg:  parseFloat(chargeableWeightKg.toFixed(2)),
        totalVolumeM3:       parseFloat(totalVolumeM3.toFixed(4)),
        loadEfficiency,
        estimatedCostIDR,
        carbonSavedKgCO2e,
        distanceKm,
        originProvince,
        destProvince,
      },
      alternatives: vehicleOrder
        .filter((k) => k !== selectedVehicleKey)
        .map((k) => {
          const v = VEHICLES[k];
          const feasible = chargeableWeightKg <= v.maxWeightKg && totalVolumeM3 <= v.maxVolumeM3;
          return {
            vehicleType:     k,
            vehicleName:     v.name,
            icon:            v.icon,
            feasible,
            estimatedCostIDR: Math.round(v.baseCostIDR + v.costPerKmIDR * distanceKm),
            reason: !feasible
              ? chargeableWeightKg > v.maxWeightKg
                ? `Melebihi kapasitas berat (${v.maxWeightKg.toLocaleString()} kg)`
                : `Melebihi kapasitas volume (${v.maxVolumeM3} m³)`
              : "Tersedia sebagai alternatif",
          };
        }),
      breakdown: items.map((item) => ({
        productId:      item.productId,
        quantity:       item.quantity,
        actualWeightKg: parseFloat((item.weightPerUnit * item.quantity).toFixed(2)),
        volumeM3:       parseFloat((item.volumePerUnit * item.quantity).toFixed(4)),
      })),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[OPTIMIZE] Error:", err);
    return NextResponse.json({ success: false, error: "Gagal mengoptimasi muatan." }, { status: 500 });
  }
}
