import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from using the parent ~/package-lock.json as workspace root
    root: process.cwd(),
  },
};

export default nextConfig;
