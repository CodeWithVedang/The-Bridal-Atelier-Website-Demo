import type { NextConfig } from 'next';

/**
 * Implements docs/SECURITY_SPEC.md §6 and docs/PERFORMANCE_SPEC.md §5.
 *
 * The CSP allows 'unsafe-inline' for scripts. That is a documented, accepted
 * tradeoff, not an oversight: a nonce-based policy requires generating the
 * nonce per request in a proxy, which would force every page out of static
 * rendering. This site loads no third-party script and renders no
 * user-submitted string into the DOM, so there is no injection sink.
 * Reasoning: docs/SECURITY_SPEC.md §6 · upgrade path: docs/DEVOPS_SPEC.md §7.
 */

const isDev = process.env.NODE_ENV === 'development';

const csp = [
  "default-src 'self'",
  // 'unsafe-eval' is development-only: Turbopack's HMR runtime needs it.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
      'interest-cohort=()',
    ].join(', '),
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // HSTS is meaningless over http://localhost and is only sent in production.
  ...(isDev
    ? []
    : [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // Six device widths matching docs/UX_SPEC.md §7, so no oversized variant
    // is ever generated. SVG optimisation stays OFF: the generated art is
    // served as-is by <EditorialImage>, and enabling dangerouslyAllowSVG
    // would make the optimiser a vector for hostile SVG.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 160, 240, 320, 420],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Generated art is content-addressed by filename; safe to cache hard.
        source: '/atelier/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Route handlers also set these themselves; this is defence in depth
        // so a future handler cannot forget.
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default nextConfig;
