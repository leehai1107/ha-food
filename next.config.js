/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [process.env.NEXT_PUBLIC_API_URL || "", 'photos.google.com','i.ibb.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1gb'
    }
  }
};

module.exports = nextConfig;
