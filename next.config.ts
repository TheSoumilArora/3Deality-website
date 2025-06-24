// next.config.ts
import path from "path";
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  webpack(config: Configuration) {
    // 1) Make sure .resolve and .resolve.alias actually exist
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      // preserve anything already there
      ...(config.resolve.alias as Record<string, string> ?? {}),
      // add our @ → src alias
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },
  images: { unoptimized: true },
};

export default nextConfig;