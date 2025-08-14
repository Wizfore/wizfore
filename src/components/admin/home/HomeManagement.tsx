'use client'

import React, { useState, useCallback } from 'react'
import { Monitor, Grid3X3, Settings, Briefcase, User, Loader2 } from 'lucide-react'
import { getHomeConfig, updateHomeConfig } from '@/lib/services/dataService'
import { defaultHomeConfig } from '@/lib/data/defaultHomeConfig'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import type { HomeConfig } from '@/types'

// 타입 정의
type HomeTab = 'hero' | 'categories' | 'programs' | 'mainservices' | 'about'

export interface TabComponentProps {
  data: HomeConfig
  setData: React.Dispatch<React.SetStateAction<HomeConfig>>
}

// 탭 컴포넌트들
import { HeroTab } from './HeroTab'
import { CategoryCardsTab } from './CategoryCardsTab'
import { AboutTab } from './AboutTab'
import { ProgramGridTab } from './ProgramGridTab'
import { MainServicesTab } from './MainServicesTab'

export default function HomeManagement() {
  const [activeTab, setActiveTab] = useState<HomeTab>('hero')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<HomeTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // 각 탭별 저장 성공 콜백 관리
  const [tabCallbacks] = useState<{[key in HomeTab]?: () => void}>({})
  const [tabCleanupCallbacks] = useState<{[key in HomeTab]?: () => Promise<void>}>({})

  // 탭별 저장 성공 콜백 등록
  const registerTabCallback = useCallback((tabKey: HomeTab, callback: () => void) => {
    tabCallbacks[tabKey] = callback
  }, [tabCallbacks])

  // 탭별 정리 콜백 등록
  const registerTabCleanupCallback = useCallback((tabKey: HomeTab, callback: () => Promise<void>) => {
    tabCleanupCallbacks[tabKey] = callback
  }, [tabCleanupCallbacks])

  // 저장 성공 시 현재 활성 탭의 콜백 실행
  const handleSaveSuccess = useCallback(async () => {
    const callback = tabCallbacks[activeTab]
    if (callback) {
      await callback()
      console.log(`${activeTab} 탭 저장 성공 콜백 실행`)
    }
  }, [activeTab, tabCallbacks])

  // 변경사항 폐기 시 현재 활성 탭의 정리 콜백 실행
  const handleDiscardChanges = useCallback(async () => {
    const cleanupCallback = tabCleanupCallbacks[activeTab]
    if (cleanupCallback) {
      await cleanupCallback()
      console.log(`${activeTab} 탭 정리 콜백 실행`)
    }
  }, [activeTab, tabCleanupCallbacks])

  // fetchData 함수
  const fetchData = useCallback(async (): Promise<HomeConfig> => {
    try {
      const data = await getHomeConfig()
      return data as HomeConfig
    } catch (error) {
      console.log('홈 설정을 불러올 수 없어 기본값을 사용합니다:', error)
      return defaultHomeConfig
    }
  }, [])

  // saveData 함수
  const saveData = useCallback(async (data: HomeConfig): Promise<void> => {
    await updateHomeConfig(data)
  }, [])

  // 폼 검증 함수
  const validateHomeConfig = (data: HomeConfig): string[] => {
    const errors = []
    
    // Hero 섹션 검증
    if (data.hero?.enabled) {
      if (!data.hero.slides || data.hero.slides.length === 0) {
        errors.push('활성화된 Hero 섹션에는 최소 1개의 슬라이드가 필요합니다.')
      } else {
        data.hero.slides.forEach((slide, index) => {
          if (!slide.title.trim()) errors.push(`슬라이드 ${index + 1}의 제목은 필수입니다.`)
          if (!slide.description.trim()) errors.push(`슬라이드 ${index + 1}의 설명은 필수입니다.`)
        })
      }
    }

    // CategoryCards 섹션 검증
    if (data.sections?.categoryCards?.enabled) {
      if (!data.sections.categoryCards.title?.trim()) {
        errors.push('카테고리 카드 섹션의 제목은 필수입니다.')
      }
    }

    // ProgramGrid 섹션 검증  
    if (data.sections?.programGrid?.enabled) {
      if (!data.sections.programGrid.title?.trim()) {
        errors.push('프로그램 그리드 섹션의 제목은 필수입니다.')
      }
    }

    // MainServices 섹션 검증
    if (data.sections?.mainServices?.enabled) {
      if (!data.sections.mainServices.aboutMessage?.title?.trim()) {
        errors.push('주요 사업 분야 소개 메시지의 제목은 필수입니다.')
      }
      if (!data.sections.mainServices.aboutMessage?.description?.trim()) {
        errors.push('주요 사업 분야 소개 메시지의 설명은 필수입니다.')
      }
      
      // 서비스 목록 검증 (빈 서비스는 제외)
      data.sections.mainServices.services?.forEach((service, index) => {
        // 모든 필드가 비어있는 서비스는 검증에서 제외
        if (!service.title?.trim() && !service.description?.trim() && !service.startYear?.trim()) {
          return
        }
        
        // 하나라도 필드가 있으면 모든 필드 검증
        if (!service.title?.trim()) errors.push(`서비스 ${index + 1}의 제목은 필수입니다.`)
        if (!service.description?.trim()) errors.push(`서비스 ${index + 1}의 설명은 필수입니다.`)
        if (!service.startYear?.trim()) errors.push(`서비스 ${index + 1}의 시작년도는 필수입니다.`)
      })
    }

    return errors
  }

  const {
    data,
    setData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm<HomeConfig>({
    fetchData,
    saveData,
    defaultData: defaultHomeConfig,
    validate: validateHomeConfig,
    onSaveSuccess: handleSaveSuccess
  })

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(hasChanges)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges, setHasUnsavedChanges])

  const handleTabChange = useCallback((newTab: HomeTab) => {
    if (hasChanges) {
      setPendingTab(newTab)
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(newTab)
    }
  }, [hasChanges])

  const handleSaveAndSwitch = async () => {
    setDialogSaving(true)
    try {
      await handleSave()
      if (pendingTab) {
        setActiveTab(pendingTab)
        setPendingTab(null)
      }
      setShowUnsavedDialog(false)
    } catch (error) {
      console.error('저장 실패:', error)
    } finally {
      setDialogSaving(false)
    }
  }

  const handleDiscardAndSwitch = async () => {
    // 현재 활성 탭의 정리 콜백 실행
    await handleDiscardChanges()
    
    handleReset()
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
    setShowUnsavedDialog(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>홈페이지 설정을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  const tabs: TabItem<HomeTab>[] = [
    {
      key: 'hero',
      label: '히어로 섹션',
      icon: Monitor
    },
    {
      key: 'categories', 
      label: '카테고리 카드',
      icon: Grid3X3
    },
    {
      key: 'about',
      label: '센터 소개',
      icon: User
    },
    {
      key: 'programs',
      label: '프로그램 그리드',
      icon: Settings
    },
    {
      key: 'mainservices',
      label: '주요 사업 분야',
      icon: Briefcase
    }
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="홈페이지 관리"
        description="메인 페이지의 레이아웃과 섹션 설정을 관리합니다"
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
        onDialogSave={handleSaveAndSwitch}
        onDialogDiscard={handleDiscardAndSwitch}
        onDialogCancel={() => {
          setShowUnsavedDialog(false)
          setPendingTab(null)
        }}
        saving={dialogSaving}
      />

      <div className="bg-white rounded-lg border">
        {activeTab === 'hero' && (
          <HeroTab 
            data={data} 
            setData={setData} 
            onRegisterCallback={(callback) => registerTabCallback('hero', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('hero', callback)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryCardsTab data={data} setData={setData} />
        )}

        {activeTab === 'about' && (
          <AboutTab data={data} setData={setData} />
        )}

        {activeTab === 'programs' && (
          <ProgramGridTab data={data} setData={setData} />
        )}

        {activeTab === 'mainservices' && (
          <MainServicesTab data={data} setData={setData} />
        )}
      </div>
    </div>
  )
}