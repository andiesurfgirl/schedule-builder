/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'blobs.vercel-storage.com', // If using Vercel Blob
        'images.unsplash.com',      // For default avatars
      ],
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'nginx_max_header_size',
              value: '32768'  // 32KB
            }
          ],
        },
      ]
    },
    serverOptions: {
      maxHeaderSize: 32768, // 32KB
    }
  }
  
  module.exports = nextConfig