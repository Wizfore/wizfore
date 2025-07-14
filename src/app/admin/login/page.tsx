'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Building2, Loader2, AlertCircle, Database } from 'lucide-react'
import { loginWithEmail } from '@/lib/services/authService'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 입력 시 에러 메시지 초기화
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const userProfile = await loginWithEmail(formData)
      
      console.log('로그인 성공:', userProfile)
      
      // 관리자 대시보드로 리다이렉트
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      console.error('로그인 실패:', err)
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 및 제목 */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">위즈포레</h2>
          <p className="mt-2 text-gray-600">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
                disabled={loading}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>

          {/* 임시 테스트 계정 안내 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">테스트 계정</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>이메일: admin@wizfore.com</p>
              <p>비밀번호: wizfore123</p>
            </div>
          </div>

          {/* 계정 생성 안내 */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">계정이 없으신가요?</h3>
            </div>
            <p className="text-xs text-yellow-700 mb-2">
              먼저 테스트 계정을 생성해야 로그인할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => router.push('/admin/dev-tools')}
              className="text-xs text-yellow-800 underline hover:text-yellow-900"
            >
              개발자 도구에서 계정 생성하기
            </button>
          </div>
        </form>

        {/* 하단 링크 */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            홈페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}