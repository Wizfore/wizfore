'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Edit2, Calendar, BarChart3, Eye, EyeOff } from 'lucide-react'
import { getHistoryData, getHistoryHero, getHistoryStats, updateHistoryInfo, updateHistoryStats } from '@/lib/services/dataService'
import { HistoryInfo, Milestone, HistoryStats, StatsCard } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export default function HistoryManagementTab() {
  const [historyData, setHistoryData] = useState<HistoryInfo | null>(null)
  const [statsData, setStatsData] = useState<HistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null)
  const [editingStatsCard, setEditingStatsCard] = useState<string | null>(null)
  const [newMilestone, setNewMilestone] = useState({
    year: new Date().getFullYear(),
    month: 1,
    event: ''
  })

  useEffect(() => {
    loadHistoryData()
  }, [])

  const loadHistoryData = async () => {
    try {
      setLoading(true)
      const [historyInfo, hero, stats] = await Promise.all([
        getHistoryData(),
        getHistoryHero(),
        getHistoryStats()
      ])
      setHistoryData({
        milestones: historyInfo?.milestones || [],
        hero: hero || { title: '', description: '', imageUrl: '' }
      })
      setStatsData(stats)
    } catch (error) {
      console.error('센터 발자취 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!historyData) return
    
    try {
      setSaving(true)
      const promises = [updateHistoryInfo(historyData)]
      
      if (statsData) {
        promises.push(updateHistoryStats(statsData))
      }
      
      await Promise.all(promises)
      alert('센터 발자취 정보가 저장되었습니다.')
    } catch (error) {
      console.error('센터 발자취 정보 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const updateHeroField = (field: string, value: string) => {
    setHistoryData(prev => {
      if (!prev) return null
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: value
        }
      }
    })
  }

  const addMilestone = () => {
    if (!newMilestone.event.trim()) return
    
    if (historyData) {
      const milestoneToAdd: Milestone = {
        year: newMilestone.year.toString(),
        month: newMilestone.month.toString(),
        event: newMilestone.event
      }
      
      const updatedMilestones = [...historyData.milestones, milestoneToAdd]
      setHistoryData({
        ...historyData,
        milestones: updatedMilestones.sort((a, b) => {
          const yearA = parseInt(a.year)
          const yearB = parseInt(b.year)
          if (yearA !== yearB) return yearB - yearA
          return parseInt(b.month) - parseInt(a.month)
        })
      })
      setNewMilestone({
        year: new Date().getFullYear(),
        month: 1,
        event: ''
      })
    }
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    if (!historyData) return
    
    const updatedMilestones = [...historyData.milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value.toString()
    }
    
    setHistoryData({
      ...historyData,
      milestones: updatedMilestones.sort((a, b) => {
        const yearA = parseInt(a.year)
        const yearB = parseInt(b.year)
        if (yearA !== yearB) return yearB - yearA
        return parseInt(b.month) - parseInt(a.month)
      })
    })
  }

  const removeMilestone = (index: number) => {
    if (!historyData) return
    
    const updatedMilestones = historyData.milestones.filter((_, i) => i !== index)
    setHistoryData({
      ...historyData,
      milestones: updatedMilestones
    })
  }

  // 통계 관련 함수들
  const updateStatsTitle = (title: string) => {
    setStatsData(prev => prev ? { ...prev, title } : null)
  }

  const updateStatsDescription = (description: string) => {
    setStatsData(prev => prev ? { ...prev, description } : null)
  }

  const updateStatsCard = (cardId: string, field: keyof StatsCard, value: string | number | boolean) => {
    setStatsData(prev => {
      if (!prev) return null
      
      const updatedCards = prev.cards.map(card => 
        card.id === cardId 
          ? { ...card, [field]: value }
          : card
      )
      
      return { ...prev, cards: updatedCards }
    })
  }

  const toggleStatsCard = (cardId: string) => {
    updateStatsCard(cardId, 'enabled', !statsData?.cards.find(c => c.id === cardId)?.enabled)
  }

  const moveStatsCard = (cardId: string, direction: 'up' | 'down') => {
    if (!statsData) return
    
    const cards = [...statsData.cards]
    const cardIndex = cards.findIndex(c => c.id === cardId)
    
    if (cardIndex === -1) return
    
    if (direction === 'up' && cardIndex > 0) {
      cards[cardIndex].order = cards[cardIndex - 1].order
      cards[cardIndex - 1].order = cards[cardIndex].order + 1
    } else if (direction === 'down' && cardIndex < cards.length - 1) {
      cards[cardIndex].order = cards[cardIndex + 1].order
      cards[cardIndex + 1].order = cards[cardIndex].order - 1
    }
    
    setStatsData({ ...statsData, cards: cards.sort((a, b) => a.order - b.order) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2 text-gray-600">센터 발자취 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!historyData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">센터 발자취 정보를 찾을 수 없습니다.</p>
        <Button className="mt-4" onClick={loadHistoryData}>
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">센터 발자취 관리</h2>
          <p className="text-sm text-gray-600">센터의 주요 연혁과 발자취를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>

      {/* 히어로 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">히어로 섹션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 제목
            </label>
            <input
              type="text"
              value={historyData.hero?.title || ''}
              onChange={(e) => updateHeroField('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 설명
            </label>
            <textarea
              value={historyData.hero?.description || ''}
              onChange={(e) => updateHeroField('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배경 이미지
            </label>
            <ImageUpload
              value={historyData.hero?.imageUrl || ''}
              onChange={(url) => updateHeroField('imageUrl', url)}
              folder="history/hero"
            />
          </div>
        </div>
      </div>

      {/* 통계 관리 섹션 */}
      {statsData && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            통계 섹션 관리
          </h3>
          
          {/* 통계 기본 정보 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                통계 섹션 제목
              </label>
              <input
                type="text"
                value={statsData.title}
                onChange={(e) => updateStatsTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="통계 섹션 제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                통계 섹션 설명
              </label>
              <textarea
                value={statsData.description}
                onChange={(e) => updateStatsDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="통계 섹션 설명"
              />
            </div>
          </div>

          {/* 통계 카드 목록 */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-800">통계 카드 ({statsData.cards.length}개)</h4>
            {statsData.cards.map((card) => (
              <div 
                key={card.id} 
                className={`p-4 border rounded-lg transition-all ${
                  card.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatsCard(card.id)}
                      className={card.enabled ? 'text-green-600' : 'text-gray-400'}
                    >
                      {card.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-gray-500">순서: {card.order}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveStatsCard(card.id, 'up')}
                      disabled={card.order === 1}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveStatsCard(card.id, 'down')}
                      disabled={card.order === statsData.cards.length}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                
                {editingStatsCard === card.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateStatsCard(card.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateStatsCard(card.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        아이콘 경로 (비어두면 기본 아이콘 사용)
                      </label>
                      <input
                        type="text"
                        value={card.iconPath}
                        onChange={(e) => updateStatsCard(card.id, 'iconPath', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`기본값: /icons/history/${card.id}.png`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingStatsCard(null)}
                      >
                        완료
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{card.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        아이콘: {card.iconPath || `/icons/history/${card.id}.png`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingStatsCard(card.id)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 새 마일스톤 추가 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">새 마일스톤 추가</h3>
        <div className="flex gap-4">
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연도
            </label>
            <input
              type="number"
              value={newMilestone.year}
              onChange={(e) => setNewMilestone({ ...newMilestone, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="2000"
              max="2030"
            />
          </div>
          <div className="w-20">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월
            </label>
            <select
              value={newMilestone.month}
              onChange={(e) => setNewMilestone({ ...newMilestone, month: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이벤트 내용
            </label>
            <input
              type="text"
              value={newMilestone.event}
              onChange={(e) => setNewMilestone({ ...newMilestone, event: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이벤트 내용"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addMilestone} disabled={!newMilestone.event.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 마일스톤 목록 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          마일스톤 목록 ({historyData.milestones.length}개)
        </h3>
        <div className="space-y-3">
          {historyData.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {milestone.year}년 {milestone.month}월
                </span>
              </div>
              
              {editingMilestone === index ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="number"
                    value={parseInt(milestone.year)}
                    onChange={(e) => updateMilestone(index, 'year', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    min="2000"
                    max="2030"
                  />
                  <select
                    value={parseInt(milestone.month)}
                    onChange={(e) => updateMilestone(index, 'month', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {month}월
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={milestone.event}
                    onChange={(e) => updateMilestone(index, 'event', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingMilestone(null)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMilestone(null)}
                  >
                    완료
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-700">{milestone.event}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMilestone(index)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeMilestone(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {historyData.milestones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 마일스톤이 없습니다.
            </div>
          )}
        </div>
      </div>

    </div>
  )
}