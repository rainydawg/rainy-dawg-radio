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
          destination: "https://stream.rainydawg.org/stream",
        },
      ];
    },
};

export default nextConfig;
