'use client'

import React, { useState, useCallback } from 'react'
import { User, Calendar, Users, MapPin, Camera, Loader2 } from 'lucide-react'
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
import FacilityManagementTab from '@/components/admin/about/FacilityManagementTab'
import type { AboutData } from '@/types/about'

type AboutTab = 'director' | 'history' | 'advisors' | 'facilities' | 'location'

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
  facilities: {
    hero: {
      title: '센터 둘러보기',
      description: '다양한 시설과 환경을 만나보세요',
      imageUrl: '',
      defaultImageUrl: '/images/hero/defaultHero.jpg'
    },
    categories: [],
    images: []
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
    const { facilityService } = await import('@/lib/services/facilityService')
    const facilitiesData = await facilityService.getFacilities()
    
    return {
      director: data.director,
      history: data.history,
      advisors: data.advisors,
      facilities: facilitiesData,
      location: data.location
    }
  }, [])

  // useAdminForm 훅 사용
  const {
    data: aboutData,
    setData: setAboutData,
    originalData,
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
      // 각 섹션별로 개별 저장 (facilities는 hero만 저장)
      const { updateDirectorInfo, updateHistoryInfo, updateAdvisorsInfo, updateLocationInfo } = await import('@/lib/services/dataService')
      const { facilityService } = await import('@/lib/services/facilityService')
      
      await Promise.all([
        updateDirectorInfo(data.director),
        updateHistoryInfo(data.history),
        updateAdvisorsInfo(data.advisors),
        facilityService.updateFacilities(data.facilities), // 전체 facilities 데이터 저장
        updateLocationInfo(data.location)
      ])
    },
    defaultData: DEFAULT_ABOUT_DATA
  })

  // 시설 데이터 새로고침 함수
  const refreshFacilitiesData = useCallback(async () => {
    const { facilityService } = await import('@/lib/services/facilityService')
    const facilitiesData = await facilityService.getFacilities()
    setAboutData(prev => ({ 
      ...prev, 
      facilities: {
        ...facilitiesData,
        // hero는 현재 상태 유지 (사용자가 수정 중일 수 있음)
        hero: prev.facilities.hero
      }
    }))
  }, [setAboutData])

  // facility 데이터 변경사항 감지 (모든 탭에서 확인)
  const facilityHasChanges = React.useMemo(() => {
    // 다른 탭의 변경사항 확인
    const otherTabsHaveChanges = activeTab !== 'facilities' ? hasChanges : false
    
    // facility 탭의 변경사항 확인
    const originalFacilities = originalData?.facilities
    const currentFacilities = aboutData.facilities
    
    if (!originalFacilities || !currentFacilities) return otherTabsHaveChanges
    
    const facilityDataChanged = JSON.stringify(originalFacilities) !== JSON.stringify(currentFacilities)
    
    // 어느 탭에서든 변경사항이 있으면 true
    return otherTabsHaveChanges || facilityDataChanged
  }, [activeTab, hasChanges, originalData?.facilities, aboutData.facilities])

  // 클린업 함수 정의
  const handleCleanupBeforeLeave = async () => {
    // facility 데이터에 변경사항이 있으면 클린업 실행 (현재 탭과 관계없이)
    const originalFacilities = originalData?.facilities
    const currentFacilities = aboutData.facilities
    const hasFacilityChanges = originalFacilities && currentFacilities && 
      JSON.stringify(originalFacilities) !== JSON.stringify(currentFacilities)
    
    if (hasFacilityChanges && (window as any).__facilityCleanup) {
      try {
        await (window as any).__facilityCleanup()
        console.log('페이지 이탈 시 이미지 클린업 완료')
      } catch (error) {
        console.warn('페이지 이탈 시 클린업 실패:', error)
      }
    }
  }

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(facilityHasChanges, true, handleCleanupBeforeLeave)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(facilityHasChanges)
  }, [facilityHasChanges, setHasUnsavedChanges])

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
      key: 'facilities' as const,
      label: '센터 둘러보기',
      icon: Camera
    },
    {
      key: 'location' as const,
      label: '오시는 길',
      icon: MapPin
    }
  ]

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: AboutTab) => {
    if (facilityHasChanges) {
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

  const handleDialogDiscard = async () => {
    // facility 데이터에 변경사항이 있으면 클린업 수행 (현재 탭과 관계없이)
    const originalFacilities = originalData?.facilities
    const currentFacilities = aboutData.facilities
    const hasFacilityChanges = originalFacilities && currentFacilities && 
      JSON.stringify(originalFacilities) !== JSON.stringify(currentFacilities)
    
    if (hasFacilityChanges && (window as any).__facilityCleanup) {
      try {
        await (window as any).__facilityCleanup()
        console.log('저장하지 않음 시 이미지 클린업 완료')
      } catch (error) {
        console.warn('클린업 실패:', error)
      }
    }
    
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
      case 'facilities':
        return (
          <FacilityManagementTab 
            data={aboutData.facilities} 
            originalData={originalData?.facilities}
            onHeroUpdate={(heroData) => setAboutData(prev => ({ 
              ...prev, 
              facilities: { ...prev.facilities, hero: heroData } 
            }))} 
            onDataUpdate={(facilitiesData) => setAboutData(prev => ({
              ...prev,
              facilities: facilitiesData
            }))}
            onDataRefresh={refreshFacilitiesData}
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
        hasChanges={facilityHasChanges}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={facilityHasChanges}
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