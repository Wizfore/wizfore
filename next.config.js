/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com'
    ],
  },
  typescript: {
    // 빌드 시 타입 에러가 있어도 빌드를 계속 진행 (개발 초기에만 사용)
    ignoreBuildErrors: false,
  },
  eslint: {
    // 빌드 시 ESLint 에러가 있어도 빌드를 계속 진행 (개발 초기에만 사용)
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
