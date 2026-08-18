/** @type {import('next').NextConfig} */
// Force Vercel rebuild & CDN purge: 2026-08-18T20:04:15
const nextConfig = {
  serverExternalPackages: ['pdf-lib', 'qrcode'],
  devIndicators: false,
  async rewrites() {
    return [
      { source: '/REGISTRATION/index.html', destination: '/registration' },
      { source: '/REGISTRATION', destination: '/registration' },
      { source: '/HOME%20PAGE/index.html', destination: '/' },
      { source: '/HOME PAGE/index.html', destination: '/' },
      { source: '/UPCOMIG%20EVENTS/index.html', destination: '/events' },
      { source: '/UPCOMIG EVENTS/index.html', destination: '/events' },
      { source: '/MEET%20THE%20CORRDINATES/index.html', destination: '/coordinators' },
      { source: '/MEET THE CORRDINATES/index.html', destination: '/coordinators' },
      { source: '/REGISTRATION/why_not', destination: '/registration/why_not' },
      { source: '/REGISTRATION/why_not/', destination: '/registration/why_not' }
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
        ],
      },
    ];
  },
};

export default nextConfig;
