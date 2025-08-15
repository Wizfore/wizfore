'use client'

import React, { useState, useCallback } from 'react'
import { Activity, Brain, Users, Trophy, Calendar, Loader2 } from 'lucide-react'
import { getPrograms, updatePrograms } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import { TherapyManagementTab } from '@/components/admin/programs/TherapyManagementTab'
import { CounselingManagementTab } from '@/components/admin/programs/CounselingManagementTab'
import { AfterschoolManagementTab } from '@/components/admin/programs/AfterschoolManagementTab'
import { SportsManagementTab } from '@/components/admin/programs/SportsManagementTab'
import { AdultDayManagementTab } from '@/components/admin/programs/AdultDayManagementTab'
import type { ProgramCategory } from '@/types/program'

type ProgramTab = 'therapy' | 'counseling' | 'afterschool' | 'sports' | 'adult-day'

interface ProgramsData {
  [key: string]: ProgramCategory
}

// 기본 데이터 구조
const DEFAULT_PROGRAMS_DATA: ProgramsData = {
  therapy: {
    id: 'therapy',
    programs: [],
    order: 1
  },
  counseling: {
    id: 'counseling',
    programs: [],
    order: 2
  },
  afterschool: {
    id: 'afterschool',
    programs: [],
    order: 3
  },
  sports: {
    id: 'special-sports',
    programs: [],
    order: 4
  },
  'adult-day': {
    id: 'adult-day',
    programs: [],
    order: 5
  }
}

export default function ProgramsManagementPage() {
  const [activeTab, setActiveTab] = useState<ProgramTab>('therapy')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<ProgramTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // 각 탭별 저장 성공 콜백 관리
  const [tabCallbacks] = useState<{[key in ProgramTab]?: () => void}>({})
  const [tabCleanupCallbacks] = useState<{[key in ProgramTab]?: () => Promise<void>}>({})

  // 탭별 저장 성공 콜백 등록
  const registerTabCallback = useCallback((tabKey: ProgramTab, callback: () => void) => {
    tabCallbacks[tabKey] = callback
  }, [tabCallbacks])

  // 탭별 정리 콜백 등록
  const registerTabCleanupCallback = useCallback((tabKey: ProgramTab, callback: () => Promise<void>) => {
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
  const fetchData = useCallback(async (): Promise<ProgramsData> => {
    try {
      const categories = await getPrograms()
      const programsData: ProgramsData = { ...DEFAULT_PROGRAMS_DATA }
      
      // API에서 받은 데이터를 구조화
      categories.forEach((category: ProgramCategory) => {
        // special-sports를 sports로 매핑
        const mappedId = category.id === 'special-sports' ? 'sports' : category.id
        
        if (programsData[mappedId]) {
          programsData[mappedId] = {
            id: category.id, // 원본 id 유지
            programs: category.programs || [],
            order: category.order || programsData[mappedId].order,
            hero: category.hero,
            aboutMessage: category.aboutMessage
          }
        }
      })
      
      return programsData
    } catch (error) {
      console.error('Error fetching programs data:', error)
      return DEFAULT_PROGRAMS_DATA
    }
  }, [])

  // saveData 함수
  const saveData = useCallback(async (data: ProgramsData): Promise<void> => {
    // 객체를 배열로 변환하여 저장
    const categoriesArray = Object.values(data)
    await updatePrograms(categoriesArray)
  }, [])

  // useAdminForm 훅 사용
  const {
    data: programsData,
    setData: setProgramsData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData,
    defaultData: DEFAULT_PROGRAMS_DATA,
    onSaveSuccess: handleSaveSuccess
  })

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(hasChanges)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges, setHasUnsavedChanges])

  // 탭 정의
  const tabs: TabItem<ProgramTab>[] = [
    {
      key: 'therapy',
      label: '치료 프로그램',
      icon: Activity
    },
    {
      key: 'counseling',
      label: '상담 프로그램',
      icon: Brain
    },
    {
      key: 'afterschool',
      label: '방과후 프로그램',
      icon: Users
    },
    {
      key: 'sports',
      label: '장애인 스포츠 프로그램',
      icon: Trophy
    },
    {
      key: 'adult-day',
      label: '성인 주간활동 프로그램',
      icon: Calendar
    }
  ]

  // 탭 전환 핸들러
  const handleTabChange = useCallback((newTab: ProgramTab) => {
    if (hasChanges) {
      setPendingTab(newTab)
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(newTab)
    }
  }, [hasChanges])

  const handleDialogSave = async () => {
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

  const handleDialogDiscard = async () => {
    // 현재 활성 탭의 정리 콜백 실행
    await handleDiscardChanges()
    
    handleReset()
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
    setShowUnsavedDialog(false)
  }

  const handleDialogCancel = () => {
    setShowUnsavedDialog(false)
    setPendingTab(null)
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>프로그램 데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 현재 탭의 프로그램 데이터 업데이트 핸들러 (깊은 복사 패턴 적용)
  const updateCurrentTabData = (updatedData: ProgramCategory) => {
    setProgramsData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)) // 깊은 복사
      newData[activeTab] = updatedData
      return newData
    })
  }

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    const currentData = programsData[activeTab]
    
    switch (activeTab) {
      case 'therapy':
        return (
          <TherapyManagementTab
            data={currentData}
            onUpdate={updateCurrentTabData}
            onRegisterCallback={(callback) => registerTabCallback('therapy', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('therapy', callback)}
          />
        )
      
      case 'counseling':
        return (
          <CounselingManagementTab
            data={currentData}
            onUpdate={updateCurrentTabData}
            onRegisterCallback={(callback) => registerTabCallback('counseling', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('counseling', callback)}
          />
        )
      
      case 'afterschool':
        return (
          <AfterschoolManagementTab
            data={currentData}
            onUpdate={updateCurrentTabData}
            onRegisterCallback={(callback) => registerTabCallback('afterschool', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('afterschool', callback)}
          />
        )
      
      case 'sports':
        return (
          <SportsManagementTab
            data={currentData}
            onUpdate={updateCurrentTabData}
            onRegisterCallback={(callback) => registerTabCallback('sports', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('sports', callback)}
          />
        )
      
      case 'adult-day':
        return (
          <AdultDayManagementTab
            data={currentData}
            onUpdate={updateCurrentTabData}
            onRegisterCallback={(callback) => registerTabCallback('adult-day', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('adult-day', callback)}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="프로그램 관리"
        description="다양한 치료 및 교육 프로그램을 관리합니다"
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

