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
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 에러가 있어도 빌드를 계속 진행 (개발 초기에만 사용)
    ignoreDuringBuilds: true,
  },
  experimental: {
    // SSR 에러 무시
    missingSuspenseWithCSRBailout: false,
  },
  // 정적 내보내기 중 오류 무시
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // 빌드 에러 무시 설정
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
