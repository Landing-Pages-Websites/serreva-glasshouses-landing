import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/design",
        destination: "/design.html",
      },
    ];
  },
};

export default nextConfig;
