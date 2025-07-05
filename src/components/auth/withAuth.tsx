'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface WithAuthProps {
  requireAdmin?: boolean
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requireAdmin = false }: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, userProfile, loading, isAuthenticated, isAdmin } = useAuth()
    const router = useRouter()
    const [redirecting, setRedirecting] = useState(false)

    useEffect(() => {
      // 로딩이 완료된 후에만 체크
      if (!loading) {
        if (!isAuthenticated) {
          console.log('인증되지 않음, 로그인 페이지로 리다이렉트')
          setRedirecting(true)
          router.push('/admin/login')
          return
        }

        if (requireAdmin && !isAdmin) {
          console.log('관리자 권한 없음, 권한 없음 페이지로 리다이렉트')
          setRedirecting(true)
          router.push('/admin/unauthorized')
          return
        }

        // 인증 성공
        setRedirecting(false)
      }
    }, [loading, isAuthenticated, isAdmin, router])

    // 로딩 중일 때
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">인증 상태 확인 중...</p>
            <p className="text-xs text-gray-400 mt-2">
              User: {user ? '로그인됨' : '미로그인'} | 
              Profile: {userProfile ? '있음' : '없음'}
            </p>
          </div>
        </div>
      )
    }

    // 리다이렉트 중일 때
    if (redirecting) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">페이지 이동 중...</p>
          </div>
        </div>
      )
    }

    // 인증되지 않았지만 아직 리다이렉트되지 않은 경우
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">인증이 필요합니다.</p>
            <button
              onClick={() => router.push('/admin/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      )
    }

    // 권한이 부족한 경우
    if (requireAdmin && !isAdmin) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">관리자 권한이 필요합니다.</p>
            <p className="text-xs text-gray-400 mt-2">
              현재 역할: {userProfile?.role || '없음'}
            </p>
          </div>
        </div>
      )
    }

    // 모든 검증 통과 - 원래 컴포넌트 렌더링
    return <WrappedComponent {...props} />
  }
}

// 관리자 전용 HOC
export function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return withAuth(WrappedComponent, { requireAdmin: true })
}