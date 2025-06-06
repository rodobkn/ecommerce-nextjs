/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // reactStrictMode: false, // esto es para que el useEffect no se corra dos veces rapido en local cuando se termina de renderizar el componente
};

export default nextConfig;
