import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/railway_calendar',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
