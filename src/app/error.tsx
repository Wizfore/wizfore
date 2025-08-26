'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러를 로깅 서비스에 전송할 수 있습니다
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h1>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed">
            예상치 못한 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
          
          {error.digest && (
            <p className="mt-4 text-xs text-gray-500 font-mono">
              오류 ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>문제가 지속되면 관리자에게 문의해 주세요.</p>
        </div>
      </div>
    </div>
  )
}
