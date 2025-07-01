/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
   experimental: {
    serverActions: {}, 
     runtime: 'edge',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  }
};

export default nextConfig;