'use client'

import { useState } from 'react'
import { User, Calendar, Users, MapPin } from 'lucide-react'
import { AdminTabs } from '@/components/admin/common/AdminTabs'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import DirectorManagementTab from '@/components/admin/about/DirectorManagementTab'
import HistoryManagementTab from '@/components/admin/about/HistoryManagementTab'
import AdvisorsManagementTab from '@/components/admin/about/AdvisorsManagementTab'
import LocationManagementTab from '@/components/admin/about/LocationManagementTab'

type AboutTab = 'director' | 'history' | 'advisors' | 'location'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>('director')

  const tabs = [
    {
      key: 'director' as const,
      label: '센터장 소개',
      icon: User,
      description: '센터장의 학력, 경력, 자격증 정보를 관리합니다'
    },
    {
      key: 'history' as const,
      label: '센터 발자취',
      icon: Calendar,
      description: '2016년부터 현재까지의 주요 연혁을 관리합니다'
    },
    {
      key: 'advisors' as const,
      label: '전문 자문위원',
      icon: Users,
      description: '전문 자문위원 정보를 관리합니다'
    },
    {
      key: 'location' as const,
      label: '오시는 길',
      icon: MapPin,
      description: '위치, 교통편 정보를 관리합니다'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'director':
        return <DirectorManagementTab />
      case 'history':
        return <HistoryManagementTab />
      case 'advisors':
        return <AdvisorsManagementTab />
      case 'location':
        return <LocationManagementTab />
      default:
        return <DirectorManagementTab />
    }
  }

  return (
    <div className="p-6">
      <AdminPageHeader 
        title="센터 소개 관리"
        description="센터에 대한 정보와 소개 콘텐츠를 관리합니다."
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