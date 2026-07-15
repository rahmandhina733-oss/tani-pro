import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes dimatikan agar Link href tidak perlu route yang benar-benar ada
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
