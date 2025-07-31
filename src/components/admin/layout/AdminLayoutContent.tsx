'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import { withAuth } from '@/components/auth/withAuth'
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import { NavigationConfirmDialog } from '@/components/admin/common/NavigationConfirmDialog'

interface AdminLayoutContentProps {
  children: ReactNode
}

function AdminLayoutInner({ children }: AdminLayoutContentProps) {
  const { showNavigationDialog, confirmNavigation, cancelNavigation } = useNavigation()
  
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* 사이드바 */}
          <AdminSidebar />
          
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 ml-64">
            {/* 페이지 콘텐츠 */}
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
      
      {/* 네비게이션 확인 다이얼로그 */}
      <NavigationConfirmDialog
        isOpen={showNavigationDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  )
}

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  return (
    <NavigationProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </NavigationProvider>
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