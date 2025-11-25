import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hachi/ui", "@hachi/schemas"],
};

export default nextConfig;
