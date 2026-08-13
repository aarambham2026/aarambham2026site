/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-lib', 'qrcode'],
  devIndicators: false,
};

export default nextConfig;
