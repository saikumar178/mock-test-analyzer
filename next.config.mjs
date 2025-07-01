/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
   experimental: {
    serverActions: {}, 
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  }
};

export default nextConfig;