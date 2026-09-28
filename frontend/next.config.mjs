/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL || "http://backend:8000";
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
  output: 'standalone'
};
export default nextConfig;