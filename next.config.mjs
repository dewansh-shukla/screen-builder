/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
    typescript: {
        // Synced components from main app may reference missing providers
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
