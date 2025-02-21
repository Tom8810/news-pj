import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // すべてのリクエストに適用
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // クリックジャッキング対策
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';", // 追加のセキュリティ対策
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
};

export default withNextIntl(nextConfig);
