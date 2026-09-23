import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Product images carry a content hash in the file name
        // (e.g. chatgpt-plus.cc904557.webp), so a changed image always gets a
        // new URL and browsers can keep these forever instead of re-checking
        // on every visit (public/ files default to max-age=0).
        source: "/products/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
