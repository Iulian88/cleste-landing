import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60,
  },
  async rewrites() {
    return [
      {
        source: '/formular-contabilitate',
        destination: 'https://formular-contabilitate-8iba7c8lc-denysucdeny-8859s-projects.vercel.app/formular-contabilitate',
      },
      {
        source: '/formular-contabilitate/:path*',
        destination: 'https://formular-contabilitate-8iba7c8lc-denysucdeny-8859s-projects.vercel.app/formular-contabilitate/:path*',
      },
    ]
  },
};

export default nextConfig;
