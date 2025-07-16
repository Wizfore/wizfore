'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Edit2, Calendar } from 'lucide-react'
import { getHistoryData, getHistoryHero, updateHistoryInfo } from '@/lib/services/dataService'
import { HistoryInfo, Milestone } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export default function HistoryManagementTab() {
  const [historyData, setHistoryData] = useState<HistoryInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null)
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
      const [historyInfo, hero] = await Promise.all([
        getHistoryData(),
        getHistoryHero()
      ])
      setHistoryData({
        milestones: historyInfo?.milestones || [],
        hero: hero || { title: '', description: '', imageUrl: '' }
      })
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
      await updateHistoryInfo(historyData)
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

      {/* 새 마일스톤 추가 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">새 마일스톤 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
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
          <div>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이벤트
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestone.event}
                onChange={(e) => setNewMilestone({ ...newMilestone, event: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이벤트 내용"
              />
              <Button onClick={addMilestone} disabled={!newMilestone.event.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
                    onKeyPress={(e) => e.key === 'Enter' && setEditingMilestone(null)}
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