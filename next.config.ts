import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  images: {
    qualities: [75, 100],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
