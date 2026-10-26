import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let React coordinate snapshots with the actual route/Suspense commit.
  experimental: { viewTransition: true },
};

export default nextConfig;
