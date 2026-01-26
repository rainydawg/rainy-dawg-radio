/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: '**.mzstatic.com'
        }
      ],
      domains: ['cdn.sanity.io', 'spinitron.com'],
    },
    async redirects() {
      return [
        {
          source: '/admin/:path*',
          destination: 'https://rainydawg.sanity.studio',
          permanent: true,
        },
      ]
    },
    async rewrites() {
      return [
        {
          source: "/api/audio",
          destination: "http://128.95.18.72:8000/stream",
        },
      ];
    },
};

export default nextConfig;
