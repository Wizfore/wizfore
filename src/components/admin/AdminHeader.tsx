'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, User, LogOut, Loader2, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/lib/services/authService'

export default function AdminHeader() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setLogoutLoading(false)
      setShowUserMenu(false)
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'staff': return '직원'
      case 'viewer': return '조회자'
      default: return '사용자'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 페이지 제목 영역 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">위즈포레 관리자 시스템에 오신 것을 환영합니다</p>
        </div>

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center space-x-4">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="검색..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 알림 */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5" />
            {/* 알림 배지 */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* 설정 */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">
                  {userProfile?.displayName || '사용자'}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(userProfile?.role || '')}`}>
                    {getRoleText(userProfile?.role || '')}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.displayName || '사용자'}
                  </p>
                  <p className="text-xs text-gray-500">{userProfile?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/admin/settings/profile')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>프로필 설정</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/admin/settings')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>시스템 설정</span>
                </button>
                
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {logoutLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>{logoutLoading ? '로그아웃 중...' : '로그아웃'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 드롭다운 메뉴 외부 클릭 시 닫기 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}