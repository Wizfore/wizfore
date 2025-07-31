'use client'

import React, { useState, useCallback } from 'react'
import { User, Calendar, Users, MapPin, Loader2 } from 'lucide-react'
import { getAboutInfo } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import DirectorManagementTab from '@/components/admin/about/DirectorManagementTab'
import HistoryManagementTab from '@/components/admin/about/HistoryManagementTab'
import AdvisorsManagementTab from '@/components/admin/about/AdvisorsManagementTab'
import LocationManagementTab from '@/components/admin/about/LocationManagementTab'
import type { AboutData } from '@/types/about'

type AboutTab = 'director' | 'history' | 'advisors' | 'location'

// defaultData를 컴포넌트 외부로 이동하여 재생성 방지
const DEFAULT_ABOUT_DATA: AboutData = {
  director: {
    name: '',
    position: [],
    education: [],
    career: [],
    committees: [],
    certifications: []
  },
  history: {
    hero: { title: '', description: '' },
    milestones: []
  },
  advisors: {
    aboutMessage: { title: '', description: '' },
    hero: { title: '', description: '' },
    list: []
  },
  location: {
    hero: { title: '', description: '' },
    aboutMessage: { title: '', description: '' },
    transportation: []
  }
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>('director')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<AboutTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // fetchData 함수를 메모이제이션하여 불필요한 리렌더링 방지
  const fetchData = useCallback(async (): Promise<AboutData> => {
    const data = await getAboutInfo()
    return {
      director: data.director,
      history: data.history,
      advisors: data.advisors,
      location: data.location
    }
  }, [])

  // useAdminForm 훅 사용
  const {
    data: aboutData,
    setData: setAboutData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: async (data: AboutData) => {
      // 각 섹션별로 개별 저장 (기존 API 구조 유지)
      const { updateDirectorInfo, updateHistoryInfo, updateAdvisorsInfo, updateLocationInfo } = await import('@/lib/services/dataService')
      await Promise.all([
        updateDirectorInfo(data.director),
        updateHistoryInfo(data.history),
        updateAdvisorsInfo(data.advisors),
        updateLocationInfo(data.location)
      ])
    },
    defaultData: DEFAULT_ABOUT_DATA
  })

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(hasChanges)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges, setHasUnsavedChanges])

  // 탭 정의
  const tabs: TabItem<AboutTab>[] = [
    {
      key: 'director' as const,
      label: '센터장 소개',
      icon: User
    },
    {
      key: 'history' as const,
      label: '센터 발자취',
      icon: Calendar
    },
    {
      key: 'advisors' as const,
      label: '전문 자문위원',
      icon: Users
    },
    {
      key: 'location' as const,
      label: '오시는 길',
      icon: MapPin
    }
  ]

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: AboutTab) => {
    if (hasChanges) {
      setPendingTab(nextTab)
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(nextTab)
    }
  }

  // 다이얼로그 핸들러
  const handleDialogSave = async () => {
    try {
      setDialogSaving(true)
      await handleSave()
      setShowUnsavedDialog(false)
      if (pendingTab) {
        setActiveTab(pendingTab)
        setPendingTab(null)
      }
    } catch (error) {
      console.error('저장 실패:', error)
    } finally {
      setDialogSaving(false)
    }
  }

  const handleDialogDiscard = () => {
    handleReset()
    setShowUnsavedDialog(false)
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
  }

  const handleDialogCancel = () => {
    setShowUnsavedDialog(false)
    setPendingTab(null)
  }

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'director':
        return (
          <DirectorManagementTab 
            data={aboutData.director} 
            onUpdate={(directorData) => setAboutData(prev => ({ ...prev, director: directorData }))} 
          />
        )
      case 'history':
        return (
          <HistoryManagementTab 
            data={aboutData.history} 
            onUpdate={(historyData) => setAboutData(prev => ({ ...prev, history: historyData }))} 
          />
        )
      case 'advisors':
        return (
          <AdvisorsManagementTab 
            data={aboutData.advisors} 
            onUpdate={(advisorsData) => setAboutData(prev => ({ ...prev, advisors: advisorsData }))} 
          />
        )
      case 'location':
        return (
          <LocationManagementTab 
            data={aboutData.location} 
            onUpdate={(locationData) => setAboutData(prev => ({ ...prev, location: locationData }))} 
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="센터 소개 관리"
        description="센터에 대한 정보와 소개 콘텐츠를 관리합니다"
        error={error}
        saveStatus={saveStatus}
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={hasChanges}
        showUnsavedDialog={showUnsavedDialog}
        onDialogSave={handleDialogSave}
        onDialogDiscard={handleDialogDiscard}
        onDialogCancel={handleDialogCancel}
        saving={dialogSaving}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}