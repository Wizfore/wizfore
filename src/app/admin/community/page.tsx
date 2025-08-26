'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useCallback, useMemo } from 'react'
import { Newspaper, Share, Loader2 } from 'lucide-react'
import { getCommunity, updateCommunity } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useNavigation } from '@/contexts/NavigationContext'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import NewsManagementTab from '@/components/admin/community/NewsManagementTab'
import SnsManagementTab from '@/components/admin/community/SnsManagementTab'
import type { CommunityData, SnsInfo, NewsInfo } from '@/types/community'

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
  },
  news: {
    hero: { title: '', description: '', imageUrl: '' },
    aboutMessage: { title: '', description: '' },
    articles: []
  }
}

export default function CommunityManagePage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('news')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<CommunityTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // 각 탭별 저장 성공 콜백 관리
  const [tabCallbacks] = useState<{[key in CommunityTab]?: () => void}>({})
  const [tabCleanupCallbacks] = useState<{[key in CommunityTab]?: () => Promise<void>}>({})

  // 탭별 저장 성공 콜백 등록
  const registerTabCallback = useCallback((tabKey: CommunityTab, callback: () => void) => {
    tabCallbacks[tabKey] = callback
  }, [tabCallbacks])

  // 탭별 정리 콜백 등록
  const registerTabCleanupCallback = useCallback((tabKey: CommunityTab, callback: () => Promise<void>) => {
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
  const fetchData = useCallback(async (): Promise<CommunityData> => {
    try {
      const communityData = await getCommunity()
      
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

      const newsData = communityData?.news || {}
      const normalizedNewsData = {
        hero: newsData.hero || { title: '', description: '', imageUrl: '' },
        aboutMessage: newsData.aboutMessage || { title: '', description: '' },
        articles: newsData.articles || []
      }
      
      return {
        sns: normalizedSnsData,
        news: normalizedNewsData
      }
    } catch (error) {
      return DEFAULT_COMMUNITY_DATA
    }
  }, [])

  // useAdminForm 훅
  const {
    data: communityData,
    setData: setCommunityData,
    originalData,
    loading,
    saving,
    saveStatus,
    error,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: updateCommunity,
    defaultData: DEFAULT_COMMUNITY_DATA,
    onSaveSuccess: handleSaveSuccess
  })

  // 커스텀 hasChanges 로직: 게시글 배열 변경은 제외하고 설정 변경만 감지
  const hasChanges = useMemo(() => {
    if (!originalData || !communityData) return false
    
    // 게시글 배열을 제외한 비교를 위해 객체를 복사하고 articles 제거
    const currentWithoutArticles = {
      ...communityData,
      news: {
        ...communityData.news,
        articles: [] // 게시글 배열은 비교에서 제외
      }
    }
    
    const originalWithoutArticles = {
      ...originalData,
      news: {
        ...originalData.news,
        articles: [] // 게시글 배열은 비교에서 제외
      }
    }
    
    return JSON.stringify(currentWithoutArticles) !== JSON.stringify(originalWithoutArticles)
  }, [originalData, communityData])

  // 브라우저 이탈 경고 훅 사용
  useUnsavedChangesWarning(hasChanges)
  
  // 네비게이션 컨텍스트와 동기화
  const { setHasUnsavedChanges } = useNavigation()
  
  React.useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges, setHasUnsavedChanges])

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

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: CommunityTab) => {
    // 변경사항이 있을 때 확인
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
      case 'news':
        return (
          <NewsManagementTab 
            data={communityData.news} 
            onUpdate={(newsData: NewsInfo) => {
              setCommunityData(prev => {
                const newData = { ...prev, news: newsData }
                return newData
              })
            }}
            onArticleChange={(newsData: NewsInfo) => {
              // 게시글 실시간 변경은 단순히 현재 데이터만 업데이트
              // 변경사항 경고는 카테고리 등 설정 변경에만 적용
              setCommunityData(prev => {
                const newData = { ...prev, news: newsData }
                return newData
              })
            }}
            onRegisterCallback={(callback) => registerTabCallback('news', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('news', callback)}
          />
        )
      case 'sns':
        return (
          <SnsManagementTab 
            data={communityData.sns} 
            onUpdate={(snsData: SnsInfo) => {
              setCommunityData(prev => {
                const newData = { ...prev, sns: snsData }
                return newData
              })
            }}
            onRegisterCallback={(callback) => registerTabCallback('sns', callback)}
            onRegisterCleanupCallback={(callback) => registerTabCleanupCallback('sns', callback)}
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