/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = config.externals || [];
        config.externals.push("backend"); // Exclude backend from Next.js bundle
        return config;
    }
};

export default nextConfig;
