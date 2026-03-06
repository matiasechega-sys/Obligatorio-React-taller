/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 1. Captura CUALQUIER ruta que empiece con /api/
        source: '/api/:path*',
        
        // 2. La redirige manteniendo la carpeta final (:path*)
        // IMPORTANTE: Quitamos "/locals" y ponemos "/api/:path*"
        destination: "https://api-react-taller-production.up.railway.app/api/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;