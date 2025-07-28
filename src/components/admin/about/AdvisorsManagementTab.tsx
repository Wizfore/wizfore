'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react'
import { AdvisorsInfo, AdvisorInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'
import { getAdvisorDefaultImage } from '@/lib/utils/advisorImageUtils'

interface AdvisorsManagementTabProps {
  data: AdvisorsInfo
  onUpdate: (data: AdvisorsInfo) => void
}

export default function AdvisorsManagementTab({ data, onUpdate }: AdvisorsManagementTabProps) {
  const [editingAdvisor, setEditingAdvisor] = useState<number | null>(null)

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

  // About 메시지 업데이트
  const updateAboutMessage = (field: string, value: string) => {
    onUpdate({
      ...data,
      aboutMessage: {
        ...data.aboutMessage,
        [field]: value
      }
    })
  }

  // 자문위원 업데이트
  const updateAdvisor = (index: number, field: keyof AdvisorInfo, value: string | string[]) => {
    const newList = [...data.list]
    newList[index] = {
      ...newList[index],
      [field]: value
    }
    onUpdate({
      ...data,
      list: newList
    })
  }

  // 자문위원 추가
  const addAdvisor = () => {
    const newAdvisor: AdvisorInfo = {
      name: '',
      position: [],
      education: [],
      career: [],
      order: data.list.length + 1
    }
    onUpdate({
      ...data,
      list: [...data.list, newAdvisor]
    })
  }

  // 자문위원 삭제
  const removeAdvisor = (index: number) => {
    const newList = data.list.filter((_, i) => i !== index)
    // 순서 재정렬
    const reorderedList = newList.map((advisor, i) => ({
      ...advisor,
      order: i + 1
    }))
    onUpdate({
      ...data,
      list: reorderedList
    })
  }

  // 배열 필드 업데이트
  const updateAdvisorArrayField = (advisorIndex: number, field: 'position' | 'education' | 'career', itemIndex: number, value: string) => {
    const currentArray = data.list[advisorIndex][field] || []
    const newArray = [...currentArray]
    newArray[itemIndex] = value
    updateAdvisor(advisorIndex, field, newArray)
  }

  // 배열 필드에 항목 추가
  const addAdvisorArrayItem = (advisorIndex: number, field: 'position' | 'education' | 'career') => {
    const currentArray = data.list[advisorIndex][field] || []
    updateAdvisor(advisorIndex, field, [...currentArray, ''])
  }

  // 배열 필드에서 항목 제거
  const removeAdvisorArrayItem = (advisorIndex: number, field: 'position' | 'education' | 'career', itemIndex: number) => {
    const currentArray = data.list[advisorIndex][field] || []
    const newArray = currentArray.filter((_, i) => i !== itemIndex)
    updateAdvisor(advisorIndex, field, newArray)
  }

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={data.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
            <ImageUpload
              value={data.hero?.imageUrl || ''}
              onChange={(url: string) => updateHero('imageUrl', url)}
              folder="hero-images"
            />
          </div>
        </div>
      </div>

      {/* About 메시지 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={data.aboutMessage?.title || ''}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={data.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 설명"
            />
          </div>
        </div>
      </div>

      {/* 자문위원 목록 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">자문위원 목록</h3>
          <Button onClick={addAdvisor}>
            <Plus className="h-4 w-4 mr-2" />
            자문위원 추가
          </Button>
        </div>

        <div className="space-y-4">
          {data.list?.map((advisor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">자문위원 #{advisor.order}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAdvisor(editingAdvisor === index ? null : index)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdvisor(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {editingAdvisor === index ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        value={advisor.name}
                        onChange={(e) => updateAdvisor(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="자문위원 이름"
                      />
                    </div>

                    {/* 직책 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">직책</label>
                      {advisor.position?.map((position, posIndex) => (
                        <div key={posIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={position}
                            onChange={(e) => updateAdvisorArrayField(index, 'position', posIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdvisorArrayItem(index, 'position', posIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAdvisorArrayItem(index, 'position')}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        직책 추가
                      </Button>
                    </div>

                    {/* 학력 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">학력</label>
                      {advisor.education?.map((education, eduIndex) => (
                        <div key={eduIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={education}
                            onChange={(e) => updateAdvisorArrayField(index, 'education', eduIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 서울대학교 의과대학 졸업"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdvisorArrayItem(index, 'education', eduIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAdvisorArrayItem(index, 'education')}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        학력 추가
                      </Button>
                    </div>

                    {/* 경력 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                      {advisor.career?.map((career, carIndex) => (
                        <div key={carIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={career}
                            onChange={(e) => updateAdvisorArrayField(index, 'career', carIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 서울대학교병원 소아과 교수"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdvisorArrayItem(index, 'career', carIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAdvisorArrayItem(index, 'career')}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        경력 추가
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">프로필 이미지</label>
                    <ImageUpload
                      value={advisor.imageUrl}
                      onChange={(url: string) => updateAdvisor(index, 'imageUrl', url)}
                      folder="advisors"
                      role={advisor.position?.join(' ') || ''}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={advisor.imageUrl || getAdvisorDefaultImage(advisor.position)}
                      alt={advisor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = getAdvisorDefaultImage(advisor.position)
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{advisor.name || '이름 없음'}</h5>
                    <p className="text-sm text-gray-600">
                      {advisor.position?.join(', ') || '직책 없음'}
                    </p>
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