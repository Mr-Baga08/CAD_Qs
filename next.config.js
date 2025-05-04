/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // We'll output a single-page React application
    output: 'export',
    distDir: '.next',
    // Disable image optimization for static export
    images: {
      unoptimized: true,
    },
    // Configure API routes to work with Vercel
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
  }
  
  module.exports = nextConfig;