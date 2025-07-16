'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Edit2, User, ArrowUp, ArrowDown } from 'lucide-react'
import { getAdvisors, getAdvisorsAboutMessage, getAdvisorsHero, updateAdvisorsInfo } from '@/lib/services/dataService'
import { AdvisorsInfo, AdvisorInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export default function AdvisorsManagementTab() {
  const [advisorsData, setAdvisorsData] = useState<AdvisorsInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingAdvisor, setEditingAdvisor] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAdvisor, setNewAdvisor] = useState<Omit<AdvisorInfo, 'order'>>({
    name: '',
    position: [],
    education: [],
    career: [],
    imageUrl: ''
  })

  useEffect(() => {
    loadAdvisorsData()
  }, [])

  const loadAdvisorsData = async () => {
    try {
      setLoading(true)
      const [advisors, aboutMessage, hero] = await Promise.all([
        getAdvisors(),
        getAdvisorsAboutMessage(),
        getAdvisorsHero()
      ])
      setAdvisorsData({
        list: advisors || [],
        aboutMessage: aboutMessage || { title: '', description: '' },
        hero: hero || { title: '', description: '', imageUrl: '' }
      })
    } catch (error) {
      console.error('자문위원 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!advisorsData) return
    
    try {
      setSaving(true)
      await updateAdvisorsInfo(advisorsData)
      alert('자문위원 정보가 저장되었습니다.')
    } catch (error) {
      console.error('자문위원 정보 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const updateAboutMessage = (field: 'title' | 'description', value: string) => {
    setAdvisorsData(prev => {
      if (!prev) return null
      return {
        ...prev,
        aboutMessage: {
          ...prev.aboutMessage,
          [field]: value
        }
      }
    })
  }

  const updateHero = (field: 'title' | 'description' | 'imageUrl', value: string) => {
    setAdvisorsData(prev => {
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

  const addAdvisor = () => {
    if (!newAdvisor.name.trim()) return
    
    if (advisorsData) {
      const maxOrder = Math.max(...advisorsData.list.map(a => a.order || 0), 0)
      const advisorWithOrder = {
        ...newAdvisor,
        order: maxOrder + 1
      }
      
      setAdvisorsData({
        ...advisorsData,
        list: [...advisorsData.list, advisorWithOrder]
      })
      
      setNewAdvisor({
        name: '',
        position: [],
        education: [],
        career: [],
        imageUrl: ''
      })
      setShowAddForm(false)
    }
  }

  const updateAdvisor = (index: number, field: keyof AdvisorInfo, value: any) => {
    if (!advisorsData) return
    
    const updatedList = [...advisorsData.list]
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    }
    
    setAdvisorsData({
      ...advisorsData,
      list: updatedList
    })
  }

  const removeAdvisor = (index: number) => {
    if (!advisorsData) return
    
    const updatedList = advisorsData.list.filter((_, i) => i !== index)
    setAdvisorsData({
      ...advisorsData,
      list: updatedList
    })
  }

  const moveAdvisor = (index: number, direction: 'up' | 'down') => {
    if (!advisorsData) return
    
    const newList = [...advisorsData.list]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newList.length) {
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]]
      
      // order 값 업데이트
      newList[index].order = index + 1
      newList[newIndex].order = newIndex + 1
      
      setAdvisorsData({
        ...advisorsData,
        list: newList
      })
    }
  }

  const addArrayItemToAdvisor = (advisorIndex: number, field: 'position' | 'education' | 'career', item: string) => {
    if (!advisorsData) return
    const currentArray = advisorsData.list[advisorIndex][field] || []
    updateAdvisor(advisorIndex, field, [...currentArray, item])
  }

  const removeArrayItemFromAdvisor = (advisorIndex: number, field: 'position' | 'education' | 'career', itemIndex: number) => {
    if (!advisorsData) return
    const currentArray = advisorsData.list[advisorIndex][field] || []
    updateAdvisor(advisorIndex, field, currentArray.filter((_, i) => i !== itemIndex))
  }

  const updateArrayItemInAdvisor = (advisorIndex: number, field: 'position' | 'education' | 'career', itemIndex: number, value: string) => {
    if (!advisorsData) return
    const currentArray = advisorsData.list[advisorIndex][field] || []
    const newArray = [...currentArray]
    newArray[itemIndex] = value
    updateAdvisor(advisorIndex, field, newArray)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2 text-gray-600">자문위원 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!advisorsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">자문위원 정보를 찾을 수 없습니다.</p>
        <Button className="mt-4" onClick={loadAdvisorsData}>
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">전문 자문위원 관리</h2>
          <p className="text-sm text-gray-600">전문 자문위원들의 정보와 소개를 관리할 수 있습니다.</p>
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
              value={advisorsData.hero?.title || ''}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 설명
            </label>
            <textarea
              value={advisorsData.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
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
              value={advisorsData.hero?.imageUrl || ''}
              onChange={(url) => updateHero('imageUrl', url)}
              folder="advisors/hero"
            />
          </div>
        </div>
      </div>

      {/* 소개 메시지 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={advisorsData.aboutMessage?.title || ''}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자문위원 소개 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={advisorsData.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자문위원 소개 설명"
            />
          </div>
        </div>
      </div>

      {/* 자문위원 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          자문위원 목록 ({advisorsData.list.length}명)
        </h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          자문위원 추가
        </Button>
      </div>

      {/* 새 자문위원 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">새 자문위원 추가</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={newAdvisor.name}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="자문위원 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로필 이미지
                </label>
                <ImageUpload
                  value={newAdvisor.imageUrl}
                  onChange={(url) => setNewAdvisor({ ...newAdvisor, imageUrl: url })}
                  folder="advisors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addAdvisor} disabled={!newAdvisor.name.trim()}>
                추가
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 자문위원 목록 */}
      <div className="space-y-4">
        {advisorsData.list.map((advisor, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-gray-400" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{advisor.name}</h4>
                  <p className="text-sm text-gray-500">순서: {advisor.order}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveAdvisor(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveAdvisor(index, 'down')}
                  disabled={index === advisorsData.list.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingAdvisor(editingAdvisor === index ? null : index)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeAdvisor(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {editingAdvisor === index ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={advisor.name}
                      onChange={(e) => updateAdvisor(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      프로필 이미지
                    </label>
                    <ImageUpload
                      value={advisor.imageUrl}
                      onChange={(url) => updateAdvisor(index, 'imageUrl', url)}
                      folder="advisors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직책
                  </label>
                  <AdvisorArrayFieldManager
                    items={advisor.position || []}
                    onAdd={(item) => addArrayItemToAdvisor(index, 'position', item)}
                    onRemove={(itemIndex) => removeArrayItemFromAdvisor(index, 'position', itemIndex)}
                    onUpdate={(itemIndex, value) => updateArrayItemInAdvisor(index, 'position', itemIndex, value)}
                    placeholder="직책을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학력
                  </label>
                  <AdvisorArrayFieldManager
                    items={advisor.education || []}
                    onAdd={(item) => addArrayItemToAdvisor(index, 'education', item)}
                    onRemove={(itemIndex) => removeArrayItemFromAdvisor(index, 'education', itemIndex)}
                    onUpdate={(itemIndex, value) => updateArrayItemInAdvisor(index, 'education', itemIndex, value)}
                    placeholder="학력을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    경력
                  </label>
                  <AdvisorArrayFieldManager
                    items={advisor.career || []}
                    onAdd={(item) => addArrayItemToAdvisor(index, 'career', item)}
                    onRemove={(itemIndex) => removeArrayItemFromAdvisor(index, 'career', itemIndex)}
                    onUpdate={(itemIndex, value) => updateArrayItemInAdvisor(index, 'career', itemIndex, value)}
                    placeholder="경력을 입력하세요"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">직책:</span>
                  <span className="text-sm text-gray-600">
                    {advisor.position?.join(', ') || '없음'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">학력:</span>
                  <span className="text-sm text-gray-600">
                    {advisor.education?.length || 0}개
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">경력:</span>
                  <span className="text-sm text-gray-600">
                    {advisor.career?.length || 0}개
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {advisorsData.list.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 등록된 자문위원이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

// 자문위원 배열 필드 관리 컴포넌트
interface AdvisorArrayFieldManagerProps {
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
  placeholder: string
}

function AdvisorArrayFieldManager({ items, onAdd, onRemove, onUpdate, placeholder }: AdvisorArrayFieldManagerProps) {
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem('')
    }
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}