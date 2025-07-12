'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { withAuth } from '@/components/auth/withAuth'

interface AdminLayoutContentProps {
  children: ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 사이드바 */}
        <AdminSidebar />
        
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 ml-64">
          {/* 헤더 */}
          <AdminHeader />
          
          {/* 페이지 콘텐츠 */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

// 인증이 필요한 레이아웃 컴포넌트
const AuthenticatedAdminLayout = withAuth(AdminLayoutContent, { requireAdmin: false })

// 메인 컴포넌트 - 페이지에 따라 다른 레이아웃 적용
export default function AdminLayoutWrapper({ children }: AdminLayoutContentProps) {
  const pathname = usePathname()
  
  // 인증이 필요하지 않은 페이지들
  const publicPages = ['/admin/login', '/admin/unauthorized', '/admin/dev-tools']
  
  if (publicPages.includes(pathname)) {
    return <>{children}</>
  }

  // 나머지 관리자 페이지는 인증 필요
  return <AuthenticatedAdminLayout>{children}</AuthenticatedAdminLayout>
}