/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',            // enables static export
    images: { unoptimized: true }, // required if using next/image
    trailingSlash: true,       // optional, helps on some Apache hosts
};

export default nextConfig;
