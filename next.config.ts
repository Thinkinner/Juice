import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma: avoid bundling the query engine into serverless traces incorrectly
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
