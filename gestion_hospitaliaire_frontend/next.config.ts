import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Désactive ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactive les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/:path*`,
      },
    ];
  },
}

export default nextConfig;
