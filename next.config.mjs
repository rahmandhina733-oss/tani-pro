/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
    ],
  },
  // Allow framer-motion to work with server components
  transpilePackages: ["framer-motion"],
};

export default nextConfig;