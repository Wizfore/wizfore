'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, BarChart3, Eye, EyeOff } from 'lucide-react'
import { HistoryInfo, Milestone, StatsCard } from '@/types/about'
import { Button } from '@/components/ui/button'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

interface HistoryManagementTabProps {
  data: HistoryInfo
  onUpdate: (data: HistoryInfo) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
}

export default function HistoryManagementTab({ data, onUpdate, onUnsavedChanges }: HistoryManagementTabProps) {
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null)
  const [editingStatsCard, setEditingStatsCard] = useState<string | null>(null)
  
  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, performCleanup } = useImageCleanup()

  // Hero 섹션 업데이트
  const updateHero = (field: string, value: string) => {
    // 이미지 URL이 업데이트될 때 추적 시작
    if (field === 'imageUrl' && value) {
      trackUploadedImage(value)
    }
    
    onUpdate({
      ...data,
      hero: {
        ...data.hero,
        [field]: value
      }
    })
  }

  // 마일스톤 업데이트
  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...(data.milestones || [])]
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value
    }
    onUpdate({
      ...data,
      milestones: newMilestones
    })
  }

  // 마일스톤 추가
  const addMilestone = () => {
    const newMilestone: Milestone = {
      year: new Date().getFullYear().toString(),
      month: '1',
      event: ''
    }
    onUpdate({
      ...data,
      milestones: [...(data.milestones || []), newMilestone]
    })
  }

  // 마일스톤 삭제
  const removeMilestone = (index: number) => {
    const newMilestones = data.milestones?.filter((_, i) => i !== index) || []
    onUpdate({
      ...data,
      milestones: newMilestones
    })
  }

  // 통계 섹션 초기화
  const initializeStats = () => {
    onUpdate({
      ...data,
      stats: {
        title: '',
        description: '',
        cards: []
      }
    })
  }

  // 통계 섹션 업데이트
  const updateStats = (field: string, value: string) => {
    onUpdate({
      ...data,
      stats: {
        title: data.stats?.title || '',
        description: data.stats?.description || '',
        cards: data.stats?.cards || [],
        ...data.stats,
        [field]: value
      }
    })
  }

  // 통계 카드 업데이트
  const updateStatsCard = (cardId: string, field: keyof StatsCard, value: string | number | boolean) => {
    if (!data.stats?.cards) return
    
    // 아이콘 이미지 URL이 업데이트될 때 추적 시작
    if (field === 'iconPath' && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
    const newCards = data.stats.cards.map(card =>
      card.id === cardId ? { ...card, [field]: value } : card
    )
    
    onUpdate({
      ...data,
      stats: {
        ...data.stats,
        cards: newCards
      }
    })
  }



  // 저장 성공 시 모든 이미지 추적 중단
  const handleSaveSuccess = () => {
    stopTrackingAllImages()
    onUnsavedChanges?.(false)
  }

  // 저장하지 않음 선택 시 업로드된 이미지 정리
  const handleDiscardChanges = async () => {
    await performCleanup()
    onUnsavedChanges?.(false)
  }

  // 카드별 카운팅 안내 메시지
  const getCountingGuide = (cardId: string) => {
    switch (cardId) {
      case 'establishment':
        return "연혁에서 '설립', '등록', '지정'이 포함된 항목의 개수로 계산됩니다"
      case 'partnership':
        return "연혁에서 '협약', '협력'이 포함된 항목의 개수로 계산됩니다"
      case 'award':
        return "연혁에서 '수상', '표창'이 포함된 항목의 개수로 계산됩니다"
      case 'duration':
        return "가장 이른 연혁 연도부터 현재까지의 년수로 계산됩니다"
      default:
        return "사용자 정의 통계입니다"
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      <AdminSection title="Hero 섹션" description="연혁 Hero 섹션의 내용을 관리합니다.">
        <AdminInput
          label="제목"
          value={data.hero?.title || ''}
          onChange={(value) => updateHero('title', value)}
          placeholder="Hero 섹션 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={data.hero?.description || ''}
          onChange={(value) => updateHero('description', value)}
          rows={3}
          placeholder="Hero 섹션 설명"
          required
        />
        
        <AdminImageUploadField
          label="배경 이미지"
          value={data.hero?.imageUrl}
          onChange={(url) => updateHero('imageUrl', url)}
          folder="pages/about/history/hero"
          defaultImageUrl={data.hero?.defaultImageUrl}
          helper="Hero 섹션 배경으로 사용할 이미지를 업로드하세요"
        />
      </AdminSection>

      {/* 통계 섹션 */}
      <AdminSection 
        title="통계 섹션" 
        description="연혁 기반 통계 정보를 관리합니다."
        headerActions={
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
          </div>
        }
      >
        {data.stats ? (
          <>
            <AdminInput
              label="통계 섹션 제목"
              value={data.stats.title || ''}
              onChange={(value) => updateStats('title', value)}
              placeholder="통계 섹션 제목"
              required
            />
            
            <AdminTextarea
              label="통계 섹션 설명"
              value={data.stats.description || ''}
              onChange={(value) => updateStats('description', value)}
              rows={3}
              placeholder="통계 섹션 설명"
              required
            />

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">통계 카드</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.stats.cards?.map((card) => (
                  <AdminCard key={card.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">카드 #{card.order}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatsCard(card.id, 'enabled', !card.enabled)}
                        >
                          {card.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <AdminInput
                        label="카드 제목"
                        value={card.title}
                        onChange={(value) => updateStatsCard(card.id, 'title', value)}
                        placeholder="카드 제목"
                      />
                      
                      <AdminTextarea
                        label="카드 설명"
                        value={card.description}
                        onChange={(value) => updateStatsCard(card.id, 'description', value)}
                        rows={2}
                        placeholder="카드 설명"
                      />
                      
                      <AdminImageUploadField
                        label="아이콘 이미지"
                        value={card.iconPath}
                        onChange={(url) => updateStatsCard(card.id, 'iconPath', url)}
                        folder="pages/about/history/stats"
                        defaultImageUrl={card.defaultIconPath}
                        helper="통계 카드 아이콘 (16x16 권장)"
                      />
                    </div>
                    
                    {/* 카운팅 안내 */}
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">통계 계산 방식</div>
                      <div className="text-xs text-gray-600">
                        {getCountingGuide(card.id)}
                      </div>
                    </div>
                  </AdminCard>
                ))}
                
                {(!data.stats.cards || data.stats.cards.length === 0) && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    아직 등록된 통계 카드가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              통계 섹션이 아직 활성화되지 않았습니다.
            </div>
            <Button onClick={initializeStats}>
              <BarChart3 className="h-4 w-4 mr-2" />
              통계 섹션 활성화
            </Button>
          </div>
        )}
      </AdminSection>

      {/* 연혁 관리 */}
      <AdminSection 
        title="연혁 관리" 
        description="센터의 주요 연혁과 마일스톤을 관리합니다."
        headerActions={
          <Button onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-2" />
            연혁 추가
          </Button>
        }
      >
        <div className="space-y-3">
          {data.milestones?.map((milestone, index) => (
            <AdminCard key={index}>
              {editingMilestone === index ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AdminInput
                    label="연도"
                    value={milestone.year}
                    onChange={(value) => updateMilestone(index, 'year', value)}
                    placeholder="YYYY"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">월</label>
                    <select
                      value={milestone.month}
                      onChange={(e) => updateMilestone(index, 'month', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}월</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={milestone.event}
                        onChange={(e) => updateMilestone(index, 'event', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="연혁 내용"
                      />
                      <Button size="sm" onClick={() => setEditingMilestone(null)}>
                        완료
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">{milestone.year}년 {milestone.month}월</span>
                    <span className="text-gray-600">{milestone.event}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMilestone(index)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      </AdminSection>
    </div>
  )
}