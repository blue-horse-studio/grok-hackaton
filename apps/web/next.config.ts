import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@forja/brand", "@forja/data", "@forja/tools"],
  async headers() {
    return [
      {
        source: "/api/mcp",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, DELETE, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "content-type, accept, authorization, mcp-protocol-version, mcp-session-id",
          },
          { key: "Access-Control-Expose-Headers", value: "mcp-session-id, mcp-protocol-version" },
        ],
      },
    ];
  },
};

export default nextConfig;
