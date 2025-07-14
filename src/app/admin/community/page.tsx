'use client'

import { useRouter } from 'next/navigation'
import { Newspaper, Share, BarChart3 } from 'lucide-react'

export default function CommunityManagePage() {
  const router = useRouter()

  const menuItems = [
    {
      id: 'news',
      title: '공지사항 관리',
      description: '공지사항, 협약, 소식 등 뉴스 콘텐츠를 관리합니다',
      icon: Newspaper,
      href: '/admin/community/news',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'sns',
      title: 'SNS 관리',
      description: '소셜 미디어 콘텐츠와 연동을 관리합니다',
      icon: Share,
      href: '/admin/community/sns',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ]

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티 관리</h1>
        <p className="text-gray-600">센터소식과 SNS 콘텐츠를 관리하고 운영할 수 있습니다.</p>
      </div>

      {/* 메뉴 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          
          return (
            <div
              key={item.id}
              onClick={() => router.push(item.href)}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${item.color} ${item.hoverColor} transition-colors group-hover:scale-105`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500"></div>
                    
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <span className="text-sm">관리하기</span>
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}