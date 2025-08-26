import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 다시 확인해 주세요.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>문제가 지속되면 관리자에게 문의해 주세요.</p>
        </div>
      </div>
    </div>
  )
}
