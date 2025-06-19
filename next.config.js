/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [''],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1gb'
    }
  }
};

module.exports = nextConfig;
