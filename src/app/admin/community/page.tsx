'use client'

import { useState } from 'react'
import { Newspaper, Share } from 'lucide-react'
import { AdminTabs } from '@/components/admin/common/AdminTabs'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import NewsManagementTab from '@/components/admin/community/NewsManagementTab'
import SnsManagementTab from '@/components/admin/community/SnsManagementTab'

type CommunityTab = 'news' | 'sns'

export default function CommunityManagePage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('news')

  const tabs = [
    {
      key: 'news' as const,
      label: '공지사항 관리',
      icon: Newspaper,
      description: '공지사항, 협약, 소식 등 뉴스 콘텐츠를 관리합니다'
    },
    {
      key: 'sns' as const,
      label: 'SNS 관리',
      icon: Share,
      description: '소셜 미디어 콘텐츠와 연동을 관리합니다'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsManagementTab />
      case 'sns':
        return <SnsManagementTab />
      default:
        return <NewsManagementTab />
    }
  }

  return (
    <div className="p-6">
      <AdminPageHeader 
        title="커뮤니티 관리"
        description="센터소식과 SNS 콘텐츠를 관리하고 운영할 수 있습니다."
      />

      <AdminTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  )
}