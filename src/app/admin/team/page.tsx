'use client'

import { useState, useCallback } from 'react'
import { Users, UserCheck, Loader2 } from 'lucide-react'
import { getTherapists, getTeachers } from '@/lib/services/dataService'
import { useAdminForm } from '@/hooks/useAdminForm'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import TherapistsManagementTab from '@/components/admin/team/TherapistsManagementTab'
import TeachersManagementTab from '@/components/admin/team/TeachersManagementTab'
import type { TeamData } from '@/types/expert'

type TeamTab = 'therapists' | 'teachers'

// defaultData를 컴포넌트 외부로 이동하여 재생성 방지
const DEFAULT_TEAM_DATA: TeamData = {
  therapists: {
    id: 'therapists',
    members: [],
    order: 1
  },
  teachers: {
    id: 'teachers', 
    members: [],
    order: 2
  }
}

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<TeamTab>('therapists')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<TeamTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // fetchData 함수를 메모이제이션하여 불필요한 리렌더링 방지
  const fetchData = useCallback(async (): Promise<TeamData> => {
    const [therapistsData, teachersData] = await Promise.all([
      getTherapists(),
      getTeachers()
    ])
    return {
      therapists: {
        ...therapistsData,
        id: 'therapists',
        order: 1
      },
      teachers: {
        ...teachersData,
        id: 'teachers',
        order: 2
      }
    }
  }, [])

  // useAdminForm 훅 사용
  const {
    data: teamData,
    setData: setTeamData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm({
    fetchData,
    saveData: async (data: TeamData) => {
      // 현재 활성 탭에 해당하는 데이터만 저장
      const { updateTherapists, updateTeachers } = await import('@/lib/services/dataService')
      
      if (activeTab === 'therapists') {
        await updateTherapists(data.therapists)
      } else if (activeTab === 'teachers') {
        await updateTeachers(data.teachers)
      }
    },
    defaultData: DEFAULT_TEAM_DATA
  })

  // 탭 정의
  const tabs: TabItem<TeamTab>[] = [
    {
      key: 'therapists' as const,
      label: '치료·상담사 관리',
      icon: UserCheck
    },
    {
      key: 'teachers' as const,
      label: '주간·방과후 교사 관리',
      icon: Users
    }
  ]

  // 탭 전환 핸들러
  const handleTabChange = (nextTab: TeamTab) => {
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
      case 'therapists':
        return (
          <TherapistsManagementTab 
            data={teamData.therapists} 
            onUpdate={(therapistsData) => setTeamData(prev => ({ ...prev, therapists: therapistsData }))} 
          />
        )
      case 'teachers':
        return (
          <TeachersManagementTab 
            data={teamData.teachers} 
            onUpdate={(teachersData) => setTeamData(prev => ({ ...prev, teachers: teachersData }))} 
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="전문가 소개 관리"
        description="치료·상담사와 주간·방과후 교사진의 정보를 관리합니다"
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