/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    // enable if you ever use styled-components
    // styledComponents: true,
  },
  webpack(config) {
    // preserve your "@/…" alias
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    // turn off Next’s built-in loader until you wire Cloudinary/S3
    unoptimized: true,
  },
};

module.exports = nextConfig;