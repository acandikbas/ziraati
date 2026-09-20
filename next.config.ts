import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark iyzipay as external to prevent bundling issues with dynamic requires
      config.externals = config.externals || [];
      config.externals.push('iyzipay');
    }
    
    // Ignore dynamic requires in iyzipay
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      module: /iyzipay/,
    });
    
    return config;
  },
};

export default nextConfig;
