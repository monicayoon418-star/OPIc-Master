import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs'],
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
}

export default config
