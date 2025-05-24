/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://crowdfunding-server-ly0w.onrender.com/api/:path*', // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
