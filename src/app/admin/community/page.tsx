'use client'

import { useState, useRef, useCallback } from 'react'
import { Newspaper, Share, Loader2 } from 'lucide-react'
import { getCommunity, updateSnsData } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import NewsManagementTab from '@/components/admin/community/NewsManagementTab'
import SnsManagementTab from '@/components/admin/community/SnsManagementTab'
import type { CommunityData, SnsInfo } from '@/types/community'

type CommunityTab = 'news' | 'sns'

// defaultData를 컴포넌트 외부로 이동하여 재생성 방지
const DEFAULT_COMMUNITY_DATA: CommunityData = {
  sns: {
    hero: { title: '', description: '', imageUrl: '' },
    aboutMessage: { title: '', description: '' },
    youtube: { link: '', message: { title: '', description: '' } },
    instagram: '',
    facebook: '',
    blog: ''
  }
}

export default function CommunityManagePage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('sns')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<CommunityTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)
  
  // 공지사항 탭용 기존 ref 방식
  const tabRefs = useRef<Record<'news', {
    hasChanges: boolean
    handleSave: () => Promise<void>
    handleReset: () => void
  } | null>>({
    news: null
  })

  // SNS 탭용 fetchData 함수
  const fetchData = useCallback(async (): Promise<CommunityData> => {
    try {
      const communityData = await getCommunity()
      console.log('원본 커뮤니티 데이터:', communityData)
      
      // 데이터 구조 정규화
      const snsData = communityData?.sns || {}
      const normalizedSnsData = {
        hero: snsData.hero || { title: '', description: '', imageUrl: '' },
        aboutMessage: snsData.aboutMessage || { title: '', description: '' },
        youtube: {
          link: snsData.youtube?.link || '',
          message: {
            title: snsData.youtube?.message?.title || '',
            description: snsData.youtube?.message?.description || ''
          }
        },
        instagram: snsData.instagram || '',
        facebook: snsData.facebook || '',
        blog: snsData.blog || ''
      }
      
      console.log('정규화된 SNS 데이터:', normalizedSnsData)
      
      return {
        sns: normalizedSnsData
      }
    } catch (error) {
      console.error('SNS 데이터 로딩 실패:', error)
      return DEFAULT_COMMUNITY_DATA
    }
  }, [])

  // SNS 탭용 useAdminForm 훅
  const {
    data: communityData,
    setData: setCommunityData,
    loading: snsLoading,
    saving: snsSaving,
    saveStatus: snsSaveStatus,
    error: snsError,
    hasChanges: snsHasChanges,
    handleSave: handleSnsSave,
    handleReset: handleSnsReset
  } = useAdminForm({
    fetchData,
    saveData: async (data: CommunityData) => {
      await updateSnsData(data.sns)
    },
    defaultData: DEFAULT_COMMUNITY_DATA
  })

  // 탭 정의
  const tabs: TabItem<CommunityTab>[] = [
    {
      key: 'news' as const,
      label: '공지사항 관리',
      icon: Newspaper
    },
    {
      key: 'sns' as const,
      label: 'SNS 관리',
      icon: Share
    }
  ]

  // 현재 탭의 변경사항 확인 (혼합 방식)
  const getCurrentTabHasChanges = () => {
    if (activeTab === 'sns') {
      console.log('SNS 탭 변경사항:', snsHasChanges)
      return snsHasChanges
    } else {
      const newsTabState = tabRefs.current.news
      return newsTabState?.hasChanges || false
    }
  }

  // 탭 전환 핸들러 (혼합 방식)
  const handleTabChange = (nextTab: CommunityTab) => {
    const hasChanges = getCurrentTabHasChanges()
    
    if (hasChanges) {
      setPendingTab(nextTab)
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(nextTab)
    }
  }

  // 다이얼로그 핸들러 (혼합 방식)
  const handleDialogSave = async () => {
    try {
      setDialogSaving(true)
      if (activeTab === 'sns') {
        await handleSnsSave()
      } else {
        const newsTabState = tabRefs.current.news
        if (newsTabState) {
          await newsTabState.handleSave()
        }
      }
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
    if (activeTab === 'sns') {
      handleSnsReset()
    } else {
      const newsTabState = tabRefs.current.news
      if (newsTabState) {
        newsTabState.handleReset()
      }
    }
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

  // 공지사항 탭 등록 (기존 방식)
  const registerTab = (tab: 'news', methods: {
    hasChanges: boolean
    handleSave: () => Promise<void>
    handleReset: () => void
  }) => {
    tabRefs.current[tab] = methods
  }

  // 로딩 상태 처리 (SNS 탭만)
  if (activeTab === 'sns' && snsLoading) {
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
      case 'news':
        return <NewsManagementTab onRegister={(methods) => registerTab('news', methods)} />
      case 'sns':
        return (
          <SnsManagementTab 
            data={communityData.sns} 
            onUpdate={(snsData: SnsInfo) => {
              console.log('onUpdate 호출됨, 새 SNS 데이터:', snsData)
              setCommunityData(prev => {
                const newData = { ...prev, sns: snsData }
                console.log('setCommunityData 호출, 새 데이터:', newData)
                return newData
              })
            }} 
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="커뮤니티 관리"
        description="센터소식과 SNS 콘텐츠를 관리하고 운영할 수 있습니다"
        error={activeTab === 'sns' ? snsError : undefined}
        saveStatus={activeTab === 'sns' ? snsSaveStatus : undefined}
        hasChanges={getCurrentTabHasChanges()}
        saving={activeTab === 'sns' ? snsSaving : false}
        onSave={activeTab === 'sns' ? handleSnsSave : undefined}
        onReset={activeTab === 'sns' ? handleSnsReset : undefined}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={getCurrentTabHasChanges()}
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