'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useCallback } from 'react'
import { getSiteInfo, updateSiteInfo } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Settings, Loader2 } from 'lucide-react'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import { BasicInfoTab } from '@/components/admin/settings/BasicInfoTab'
import { ContactInfoTab } from '@/components/admin/settings/ContactInfoTab'
import { ImagesTab } from '@/components/admin/settings/ImagesTab'
import type { DefaultSiteData } from '@/types'

type SiteInfoData = DefaultSiteData['siteInfo']
type TabKey = 'basic' | 'contact' | 'images'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // 폼 검증 함수
  const validateSiteInfo = (data: SiteInfoData): string[] => {
    const errors = []
    
    if (!data.name.trim()) errors.push('사이트명은 필수입니다.')
    if (!data.enName.trim()) errors.push('영문명은 필수입니다.')
    if (!data.establishedDate.trim()) errors.push('설립일은 필수입니다.')
    if (!data.contact.address.trim()) errors.push('주소는 필수입니다.')
    if (!data.contact.phone.trim()) errors.push('전화번호는 필수입니다.')
    if (!data.contact.email.trim()) errors.push('이메일은 필수입니다.')
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (data.contact.email && !emailRegex.test(data.contact.email)) {
      errors.push('올바른 이메일 형식을 입력해주세요.')
    }
    
    
    return errors
  }

  // 데이터 정리 함수 (필요시 확장 가능)
  const cleanSiteInfo = (data: SiteInfoData): SiteInfoData => {
    return data
  }

  // 각 탭별 저장 성공 콜백 관리
  const [tabCallbacks] = useState<{[key in TabKey]?: () => void}>({})
  const [tabCleanupCallbacks] = useState<{[key in TabKey]?: () => Promise<void>}>({})

  // 탭별 저장 성공 콜백 등록
  const registerTabCallback = useCallback((tabKey: TabKey, callback: () => void) => {
    tabCallbacks[tabKey] = callback
  }, [tabCallbacks])

  // 탭별 정리 콜백 등록
  const registerTabCleanupCallback = useCallback((tabKey: TabKey, callback: () => Promise<void>) => {
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

  // fetchData 함수를 메모이제이션하여 불필요한 리렌더링 방지
  const fetchData = useCallback(async () => {
    return getSiteInfo() as Promise<SiteInfoData>
  }, [])

  // useAdminForm 훅 사용
  const {
    data: siteInfo,
    setData: setSiteInfo,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: updateSiteInfo,
    defaultData: defaultSiteData.siteInfo,
    validate: validateSiteInfo,
    cleanData: cleanSiteInfo,
    onSaveSuccess: handleSaveSuccess
  })

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(hasChanges)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  // hasChanges 상태가 변경될 때마다 네비게이션 컨텍스트 업데이트
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges, setHasUnsavedChanges])

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: TabKey) => {
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

  // 탭 정의
  const tabs: TabItem<TabKey>[] = [
    { key: 'basic', label: '기본 정보', icon: Settings },
    { key: 'contact', label: '연락처 정보', icon: Settings },
    { key: 'images', label: '이미지 설정', icon: Settings },
  ]

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
      case 'basic':
        return <BasicInfoTab siteInfo={siteInfo} onUpdate={setSiteInfo} />
      case 'contact':
        return <ContactInfoTab siteInfo={siteInfo} onUpdate={setSiteInfo} />
      case 'images':
        return (
          <ImagesTab 
            siteInfo={siteInfo} 
            onUpdate={setSiteInfo} 
            onRegisterCallback={(callback) => registerTabCallback('images', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('images', callback)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="사이트 설정"
        description="사이트 기본 정보를 관리합니다"
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