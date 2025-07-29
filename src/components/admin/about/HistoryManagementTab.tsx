'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, BarChart3, Eye, EyeOff } from 'lucide-react'
import { HistoryInfo, Milestone, StatsCard } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

interface HistoryManagementTabProps {
  data: HistoryInfo
  onUpdate: (data: HistoryInfo) => void
}

export default function HistoryManagementTab({ data, onUpdate }: HistoryManagementTabProps) {
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null)
  const [editingStatsCard, setEditingStatsCard] = useState<string | null>(null)

  // Hero 섹션 업데이트
  const updateHero = (field: string, value: string) => {
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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={data.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배경 이미지
            </label>
            <ImageUpload
              value={data.hero?.imageUrl || ''}
              onChange={(url: string) => updateHero('imageUrl', url)}
              folder="pages/about/history/hero"
              defaultImageUrl={data.hero?.defaultImageUrl}
            />
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          통계 섹션
        </h3>
        
        {data.stats ? (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  통계 섹션 제목
                </label>
                <input
                  type="text"
                  value={data.stats.title || ''}
                  onChange={(e) => updateStats('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="통계 섹션 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  통계 섹션 설명
                </label>
                <textarea
                  value={data.stats.description || ''}
                  onChange={(e) => updateStats('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="통계 섹션 설명"
                />
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900">통계 카드</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.stats.cards?.map((card) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">카드 #{card.order}</span>
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
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateStatsCard(card.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="카드 제목"
                    />
                    <textarea
                      value={card.description}
                      onChange={(e) => updateStatsCard(card.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="카드 설명"
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">아이콘 이미지</label>
                      <ImageUpload
                        value={card.iconPath}
                        onChange={(url: string) => updateStatsCard(card.id, 'iconPath', url)}
                        folder={`pages/about/history/stats`}
                        defaultImageUrl={card.defaultIconPath}
                        previewSize="h-16 w-16"
                        placeholder="아이콘 이미지를 업로드하세요"
                      />
                    </div>
                  </div>
                  
                  {/* 카운팅 안내 */}
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1">통계 계산 방식</div>
                    <div className="text-xs text-gray-600">
                      {getCountingGuide(card.id)}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!data.stats.cards || data.stats.cards.length === 0) && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  아직 등록된 통계 카드가 없습니다.
                </div>
              )}
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
      </div>

      {/* 연혁 관리 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">연혁 관리</h3>
          <Button onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-2" />
            연혁 추가
          </Button>
        </div>
        
        <div className="space-y-3">
          {data.milestones?.map((milestone, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              {editingMilestone === index ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">연도</label>
                    <input
                      type="text"
                      value={milestone.year}
                      onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">월</label>
                    <select
                      value={milestone.month}
                      onChange={(e) => updateMilestone(index, 'month', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}월</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">내용</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={milestone.event}
                        onChange={(e) => updateMilestone(index, 'event', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <span className="font-medium">{milestone.year}년 {milestone.month}월</span>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}