'use client'

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

  // fetchData 함수
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

      const newsData = communityData?.news || {}
      const normalizedNewsData = {
        hero: newsData.hero || { title: '', description: '', imageUrl: '' },
        aboutMessage: newsData.aboutMessage || { title: '', description: '' },
        articles: newsData.articles || []
      }
      
      console.log('정규화된 커뮤니티 데이터:', { sns: normalizedSnsData, news: normalizedNewsData })
      
      return {
        sns: normalizedSnsData,
        news: normalizedNewsData
      }
    } catch (error) {
      console.error('커뮤니티 데이터 로딩 실패:', error)
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
    hasChanges: hasFormChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: async (data: CommunityData) => {
      await updateCommunity(data)
    },
    defaultData: DEFAULT_COMMUNITY_DATA
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
    // SNS 탭에서만 변경사항 확인
    if (activeTab === 'sns' && hasChanges) {
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
      case 'news':
        return (
          <NewsManagementTab 
            data={communityData.news} 
            onUpdate={(newsData: NewsInfo) => {
              console.log('News onUpdate 호출됨 (설정 변경), 새 데이터:', newsData)
              setCommunityData(prev => {
                const newData = { ...prev, news: newsData }
                console.log('setCommunityData 호출 (설정 변경), 새 커뮤니티 데이터:', newData)
                return newData
              })
            }}
            onArticleChange={(newsData: NewsInfo) => {
              console.log('News onArticleChange 호출됨 (게시글 실시간 변경), 새 데이터:', newsData)
              // 게시글 실시간 변경은 단순히 현재 데이터만 업데이트
              // 변경사항 경고는 카테고리 등 설정 변경에만 적용
              setCommunityData(prev => {
                const newData = { ...prev, news: newsData }
                console.log('setCommunityData 호출 (게시글 실시간 변경), 새 커뮤니티 데이터:', newData)
                return newData
              })
            }} 
          />
        )
      case 'sns':
        return (
          <SnsManagementTab 
            data={communityData.sns} 
            onUpdate={(snsData: SnsInfo) => {
              console.log('SNS onUpdate 호출됨, 새 데이터:', snsData)
              setCommunityData(prev => {
                const newData = { ...prev, sns: snsData }
                console.log('setCommunityData 호출, 새 커뮤니티 데이터:', newData)
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
        error={activeTab === 'sns' ? error : undefined}
        saveStatus={activeTab === 'sns' ? saveStatus : undefined}
        hasChanges={activeTab === 'sns' ? hasChanges : false}
        saving={activeTab === 'sns' ? saving : false}
        onSave={activeTab === 'sns' ? handleSave : undefined}
        onReset={activeTab === 'sns' ? handleReset : undefined}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={activeTab === 'sns' ? hasChanges : false}
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