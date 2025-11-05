import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ui-avatars.com",
      "firebasestorage.googleapis.com",
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        http2: false,
        child_process: false,
      };

      // Ignore node: protocol imports
      config.externals = config.externals || [];
      config.externals.push({
        'node:events': 'commonjs events',
        'node:process': 'commonjs process',
        'node:stream': 'commonjs stream',
        'node:buffer': 'commonjs buffer',
      });
    }
    return config;
  },
};

export default nextConfig;
