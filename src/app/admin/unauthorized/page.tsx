'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 아이콘 */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600" />
        </div>

        {/* 제목 및 메시지 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
        <p className="text-gray-600 mb-8">
          이 페이지에 접근할 수 있는 권한이 없습니다.<br />
          관리자에게 문의하시거나 다른 페이지를 이용해 주세요.
        </p>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전 페이지로</span>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>홈페이지로</span>
          </button>
        </div>

        {/* 연락처 정보 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">문의사항이 있으시면 연락주세요</p>
          <p className="text-sm font-medium text-gray-900">
            이메일: admin@wizfore.com
          </p>
        </div>
      </div>
    </div>
  )
}