import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma: avoid bundling the query engine into serverless traces incorrectly
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      {
        source: "/dashboard/content",
        destination: "/dashboard/content-intelligence",
        permanent: true,
      },
      {
        source: "/dashboard/next",
        destination: "/dashboard/recommendations",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
