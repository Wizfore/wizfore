'use client'

import { Plus, Trash2 } from 'lucide-react'
import { DirectorInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

interface DirectorManagementTabProps {
  data: DirectorInfo
  onUpdate: (data: DirectorInfo) => void
}

export default function DirectorManagementTab({ data, onUpdate }: DirectorManagementTabProps) {
  // 기본 정보 업데이트 함수
  const updateBasicInfo = (field: keyof DirectorInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    })
  }

  // 배열 필드 업데이트 함수
  const updateArrayField = (field: keyof DirectorInfo, index: number, value: string) => {
    const currentArray = (data[field] as string[]) || []
    const newArray = [...currentArray]
    newArray[index] = value
    onUpdate({
      ...data,
      [field]: newArray
    })
  }

  // 배열 필드에 새 항목 추가
  const addArrayItem = (field: keyof DirectorInfo) => {
    const currentArray = (data[field] as string[]) || []
    onUpdate({
      ...data,
      [field]: [...currentArray, '']
    })
  }

  // 배열 필드에서 항목 제거
  const removeArrayItem = (field: keyof DirectorInfo, index: number) => {
    const currentArray = (data[field] as string[]) || []
    const newArray = currentArray.filter((_, i) => i !== index)
    onUpdate({
      ...data,
      [field]: newArray
    })
  }

  // 중첩 객체 업데이트 함수
  const updateNestedObject = (parentField: 'aboutMessage' | 'hero', field: string, value: string) => {
    onUpdate({
      ...data,
      [parentField]: {
        ...data[parentField],
        [field]: value
      }
    })
  }

  // 배열 필드 렌더링 함수
  const renderArrayField = (field: keyof DirectorInfo, label: string) => {
    const items = (data[field] as string[]) || []
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayField(field, index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`${label} ${index + 1}`}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => removeArrayItem(field, index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => addArrayItem(field)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {label} 추가
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                센터장 이름
              </label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="센터장 이름을 입력하세요"
              />
            </div>
            {renderArrayField('position', '직책')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로필 이미지
            </label>
            <ImageUpload
              value={data.imageUrl}
              onChange={(url: string) => updateBasicInfo('imageUrl', url)}
              folder="director"
            />
          </div>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {renderArrayField('education', '학력')}
            {renderArrayField('career', '경력')}
          </div>
          <div className="space-y-6">
            {renderArrayField('committees', '위원회')}
            {renderArrayField('certifications', '자격증')}
          </div>
        </div>
      </div>

      {/* 소개 메시지 섹션 */}
      {data.aboutMessage && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={data.aboutMessage.title || ''}
                onChange={(e) => updateNestedObject('aboutMessage', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="소개 메시지 제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={data.aboutMessage.description || ''}
                onChange={(e) => updateNestedObject('aboutMessage', 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="소개 메시지 설명"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero 섹션 */}
      {data.hero && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero 제목
              </label>
              <input
                type="text"
                value={data.hero.title || ''}
                onChange={(e) => updateNestedObject('hero', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hero 섹션 제목"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero 설명
              </label>
              <textarea
                value={data.hero.description || ''}
                onChange={(e) => updateNestedObject('hero', 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hero 섹션 설명"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero 배경 이미지 URL
              </label>
              <input
                type="url"
                value={data.hero.imageUrl || ''}
                onChange={(e) => updateNestedObject('hero', 'imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}