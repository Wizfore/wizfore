'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, User, Upload } from 'lucide-react'
import { getAboutSectionData, updateDirectorInfo } from '@/lib/services/dataService'
import { DirectorInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export default function DirectorManagementTab() {
  const [directorData, setDirectorData] = useState<DirectorInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadDirectorData()
  }, [])

  const loadDirectorData = async () => {
    try {
      setLoading(true)
      const data = await getAboutSectionData()
      setDirectorData(data?.director || null)
    } catch (error) {
      console.error('센터장 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!directorData) return
    
    try {
      setSaving(true)
      await updateDirectorInfo(directorData)
      alert('센터장 정보가 저장되었습니다.')
    } catch (error) {
      console.error('센터장 정보 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof DirectorInfo, value: any) => {
    setDirectorData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const updateNestedField = (field: string, value: any) => {
    setDirectorData(prev => {
      if (!prev) return null
      const keys = field.split('.')
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const addArrayItem = (field: keyof DirectorInfo, newItem: string) => {
    if (!directorData) return
    const currentArray = directorData[field] as string[] || []
    updateField(field, [...currentArray, newItem])
  }

  const removeArrayItem = (field: keyof DirectorInfo, index: number) => {
    if (!directorData) return
    const currentArray = directorData[field] as string[] || []
    updateField(field, currentArray.filter((_, i) => i !== index))
  }

  const updateArrayItem = (field: keyof DirectorInfo, index: number, value: string) => {
    if (!directorData) return
    const currentArray = directorData[field] as string[] || []
    const newArray = [...currentArray]
    newArray[index] = value
    updateField(field, newArray)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2 text-gray-600">센터장 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!directorData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">센터장 정보를 찾을 수 없습니다.</p>
        <Button className="mt-4" onClick={loadDirectorData}>
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">센터장 소개 관리</h2>
          <p className="text-sm text-gray-600">센터장의 프로필과 인사말을 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={directorData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="센터장 이름"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로필 이미지
            </label>
            <ImageUpload
              value={directorData.imageUrl || ''}
              onChange={(url) => updateField('imageUrl', url)}
              folder="director"
            />
          </div>
        </div>
      </div>

      {/* 직책 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">직책</h3>
        <ArrayFieldManager
          items={directorData.position || []}
          onAdd={(item) => addArrayItem('position', item)}
          onRemove={(index) => removeArrayItem('position', index)}
          onUpdate={(index, value) => updateArrayItem('position', index, value)}
          placeholder="직책을 입력하세요"
        />
      </div>

      {/* 학력 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">학력</h3>
        <ArrayFieldManager
          items={directorData.education || []}
          onAdd={(item) => addArrayItem('education', item)}
          onRemove={(index) => removeArrayItem('education', index)}
          onUpdate={(index, value) => updateArrayItem('education', index, value)}
          placeholder="학력을 입력하세요"
        />
      </div>

      {/* 경력 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">경력</h3>
        <ArrayFieldManager
          items={directorData.career || []}
          onAdd={(item) => addArrayItem('career', item)}
          onRemove={(index) => removeArrayItem('career', index)}
          onUpdate={(index, value) => updateArrayItem('career', index, value)}
          placeholder="경력을 입력하세요"
        />
      </div>

      {/* 위원회 활동 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">위원회 활동</h3>
        <ArrayFieldManager
          items={directorData.committees || []}
          onAdd={(item) => addArrayItem('committees', item)}
          onRemove={(index) => removeArrayItem('committees', index)}
          onUpdate={(index, value) => updateArrayItem('committees', index, value)}
          placeholder="위원회 활동을 입력하세요"
        />
      </div>

      {/* 자격증 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">자격증</h3>
        <ArrayFieldManager
          items={directorData.certifications || []}
          onAdd={(item) => addArrayItem('certifications', item)}
          onRemove={(index) => removeArrayItem('certifications', index)}
          onUpdate={(index, value) => updateArrayItem('certifications', index, value)}
          placeholder="자격증을 입력하세요"
        />
      </div>

      {/* 인사말 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인사말</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={directorData.aboutMessage?.title || ''}
              onChange={(e) => updateNestedField('aboutMessage.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="인사말 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={directorData.aboutMessage?.description || ''}
              onChange={(e) => updateNestedField('aboutMessage.description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="인사말 내용"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강조 키워드 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={directorData.aboutMessage?.highlightKeywords?.join(', ') || ''}
              onChange={(e) => updateNestedField('aboutMessage.highlightKeywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="강조할 키워드들을 쉼표로 구분하여 입력"
            />
          </div>
        </div>
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
              value={directorData.hero?.title || ''}
              onChange={(e) => updateNestedField('hero.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 설명
            </label>
            <textarea
              value={directorData.hero?.description || ''}
              onChange={(e) => updateNestedField('hero.description', e.target.value)}
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
              value={directorData.hero?.imageUrl || ''}
              onChange={(url) => updateNestedField('hero.imageUrl', url)}
              folder="director/hero"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 배열 필드 관리 컴포넌트
interface ArrayFieldManagerProps {
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
  placeholder: string
}

function ArrayFieldManager({ items, onAdd, onRemove, onUpdate, placeholder }: ArrayFieldManagerProps) {
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem('')
    }
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}