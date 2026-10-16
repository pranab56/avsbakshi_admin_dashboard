import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.26.206",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.rizipt.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "humayon5002.binarybards.online",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5010",
        pathname: "/**",
      },
      // Add your specific uploads pattern
      {
        protocol: "http",
        hostname: "10.10.7.65",
        port: "5010",
        pathname: "/uploads/**",  // This specifically allows uploads folder
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/all-salon',
        destination: '/salons',
        permanent: false,
      },
      {
        source: '/all-salons',
        destination: '/salons',
        permanent: false,
      },
      {
        source: '/all-services',
        destination: '/services',
        permanent: false,
      },
      {
        source: '/customer-management',
        destination: '/customers',
        permanent: false,
      },
      {
        source: '/professional-management',
        destination: '/professionals',
        permanent: false,
      },
      {
        source: '/booking-management',
        destination: '/service-bookings',
        permanent: false,
      },
      {
        source: '/service-booking',
        destination: '/service-bookings',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;