import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hachi/ui", "@hachi/schemas"],
  turbopack: {
    root: "../..",
  },
};

export default nextConfig;
