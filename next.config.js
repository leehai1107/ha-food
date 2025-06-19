/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['ha-food-hazel.vercel.app'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1gb'
    }
  }
};

module.exports = nextConfig;
