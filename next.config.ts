import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/hafiz-odyssey",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

