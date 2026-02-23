import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hachi/ui", "@hachi/schemas", "@hachi/auth"],
  turbopack: {
    root: "../..",
  },
};

export default nextConfig;
