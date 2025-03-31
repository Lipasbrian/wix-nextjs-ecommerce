// next.config.mjs
import "dotenv/config"  //Loads variables from  .env
const nextConfig = {
  
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.pexels.com',
          pathname: '/photos/**',
        },
        {
          protocol: 'https',
          hostname: 'www.runnersworld.com',
          pathname: '/gear/**',
        },
        {
          protocol: 'https',
          hostname: 'teakwoodleathers.com',
          pathname: '/products/**',
        },
      ],
      // Optional: For development only (removefor production)
      ...(process.env.NODE_ENV === 'development' && {
        unoptimized: true
      })
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI, // ✅ Load MongoDB URI from .env.local
    },
  }
  
  export default nextConfig