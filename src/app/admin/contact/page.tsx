'use client'

import React, { useState, useCallback } from 'react'
import { MessageSquare, Settings, Loader2 } from 'lucide-react'
import { getInquiryInfo, updateInquiry } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import InquiryListTab from '@/components/admin/contact/InquiryListTab'
import InquiryManagementTab from '@/components/admin/community/InquiryManagementTab'
import type { InquiryInfo } from '@/types/about'

type ContactTab = 'list' | 'settings'

const DEFAULT_INQUIRY_DATA: InquiryInfo = {
  hero: { title: '', description: '', imageUrl: '' },
  aboutMessage: { title: '', description: '' },
  categories: []
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<ContactTab>('list')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<ContactTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // 각 탭별 저장 성공 콜백 관리 (settings 탭만 필요)
  const [tabCallbacks] = useState<{[key in ContactTab]?: () => void}>({})
  const [tabCleanupCallbacks] = useState<{[key in ContactTab]?: () => Promise<void>}>({})

  // 탭별 저장 성공 콜백 등록
  const registerTabCallback = useCallback((tabKey: ContactTab, callback: () => void) => {
    tabCallbacks[tabKey] = callback
  }, [tabCallbacks])

  // 탭별 정리 콜백 등록
  const registerTabCleanupCallback = useCallback((tabKey: ContactTab, callback: () => Promise<void>) => {
    tabCleanupCallbacks[tabKey] = callback
  }, [tabCleanupCallbacks])

  // 저장 성공 시 현재 활성 탭의 콜백 실행
  const handleSaveSuccess = useCallback(async () => {
    const callback = tabCallbacks[activeTab]
    if (callback) {
      await callback()
    }
  }, [activeTab, tabCallbacks])

  // 변경사항 폐기 시 현재 활성 탭의 정리 콜백 실행
  const handleDiscardChanges = useCallback(async () => {
    const cleanupCallback = tabCleanupCallbacks[activeTab]
    if (cleanupCallback) {
      await cleanupCallback()
    }
  }, [activeTab, tabCleanupCallbacks])

  // fetchData 함수
  const fetchData = useCallback(async (): Promise<InquiryInfo> => {
    try {
      return await getInquiryInfo()
    } catch (error) {
      return DEFAULT_INQUIRY_DATA
    }
  }, [])

  // useAdminForm 훅 (settings 탭만 사용)
  const {
    data: inquiryData,
    setData: setInquiryData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: updateInquiry,
    defaultData: DEFAULT_INQUIRY_DATA,
    onSaveSuccess: handleSaveSuccess
  })

  // 브라우저 이탈 경고 훅 사용 (settings 탭에서만)
  useUnsavedChangesWarning(hasChanges && activeTab === 'settings')
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges && activeTab === 'settings')
  }, [hasChanges, activeTab, setHasUnsavedChanges])

  // 탭 정의
  const tabs: TabItem<ContactTab>[] = [
    {
      key: 'list' as const,
      label: '문의 목록',
      icon: MessageSquare
    },
    {
      key: 'settings' as const,
      label: '문의 설정',
      icon: Settings
    }
  ]

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: ContactTab) => {
    // settings 탭에서 변경사항이 있을 때만 확인
    if (hasChanges && activeTab === 'settings') {
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
    // 현재 활성 탭의 정리 콜백 실행
    await handleDiscardChanges()
    
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

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return <InquiryListTab />
      case 'settings':
        if (loading) {
          return (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>설정을 불러오는 중...</span>
              </div>
            </div>
          )
        }
        return (
          <InquiryManagementTab 
            data={inquiryData} 
            onUpdate={setInquiryData}
            onRegisterCallback={(callback) => registerTabCallback('settings', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('settings', callback)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="1:1 문의 관리"
        description="고객 문의를 확인하고 관리하며, 문의 페이지 설정을 관리합니다"
        error={activeTab === 'settings' ? error : null}
        saveStatus={activeTab === 'settings' ? saveStatus : null}
        hasChanges={activeTab === 'settings' ? hasChanges : false}
        saving={activeTab === 'settings' ? saving : false}
        onSave={activeTab === 'settings' ? handleSave : undefined}
        onReset={activeTab === 'settings' ? handleReset : undefined}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={hasChanges && activeTab === 'settings'}
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
