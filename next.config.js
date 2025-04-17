/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        constants: false,
        zlib: false,
      };
    }
    return config;
  },
  serverExternalPackages: ["@nodelib/fs.scandir"],
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
