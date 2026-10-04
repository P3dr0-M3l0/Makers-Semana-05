const staticExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = staticExport
  ? {
      // Site estatico para o Firebase Hosting (gera a pasta out/)
      output: "export",
    }
  : {
      // Modo da Semana 5 (Docker): servidor Node standalone + proxy para o Django
      allowedDevOrigins: ["*.app.github.dev"],
      async rewrites() {
        const backend = process.env.BACKEND_INTERNAL_URL || "http://backend:8000";
        return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
      },
      output: "standalone",
    };

export default nextConfig;
