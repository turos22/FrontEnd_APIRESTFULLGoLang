import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Qualquer host https: a URL da imagem do produto vem de onde o
    // vendedor colar (campo livre no painel), nao de um catalogo fixo.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
