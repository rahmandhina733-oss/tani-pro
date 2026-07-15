// ─────────────────────────────────────────────────────────────
//  TaniPro — Global Zustand Store
// ─────────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "FARMER" | "BUYER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  avatarUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;          // IDR/kg
  quantity: number;       // kg
  weightPerUnit: number;  // kg
  volumePerUnit: number;  // m³
  farmerId: string;
  farmerName: string;
  imageUrl?: string;
}

export interface VehicleRecommendation {
  vehicleType: "CDE" | "CDD" | "FUSO";
  totalWeightKg: number;
  totalVolumeM3: number;
  loadEfficiency: number;
  estimatedCostIDR: number;
  carbonSavedKgCO2e: number;
}

// ── Auth Slice ────────────────────────────────────────────────

interface AuthSlice {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

// ── Cart Slice ────────────────────────────────────────────────

interface CartSlice {
  items: CartItem[];
  vehicleRecommendation: VehicleRecommendation | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setVehicleRecommendation: (rec: VehicleRecommendation) => void;
  getTotalAmount: () => number;
  getTotalWeight: () => number;
  getTotalVolume: () => number;
  getItemCount: () => number;
}

// ── UI Slice ──────────────────────────────────────────────────

interface UISlice {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

// ── Combined Store ────────────────────────────────────────────

type StoreState = AuthSlice & CartSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),

      // ── Cart ────────────────────────────────────────────────
      items: [],
      vehicleRecommendation: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [], vehicleRecommendation: null }),

      setVehicleRecommendation: (rec) => set({ vehicleRecommendation: rec }),

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getTotalWeight: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.weightPerUnit * i.quantity, 0);
      },

      getTotalVolume: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.volumePerUnit * i.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.quantity, 0);
      },

      // ── UI ──────────────────────────────────────────────────
      sidebarCollapsed: false,
      activeModal: null,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: "tanipro-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        items: state.items,
      }),
    }
  )
);
