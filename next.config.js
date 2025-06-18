/** @type {import('next').NextConfig} */
const nextConfig = {
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
