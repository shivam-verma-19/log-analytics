/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone', // Ensures Vercel deploys correctly
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "/index.html",
            },
        ];
    },
};
