'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { AdvisorsInfo, AdvisorInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminArrayField, 
  AdminImageUploadField,
  AdminCard
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

interface AdvisorsManagementTabProps {
  data: AdvisorsInfo
  onUpdate: (data: AdvisorsInfo) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
}

export default function AdvisorsManagementTab({ data, onUpdate, onUnsavedChanges }: AdvisorsManagementTabProps) {
  const [editingAdvisor, setEditingAdvisor] = useState<number | null>(null)
  
  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, performCleanup } = useImageCleanup()

  // 기본 이미지 옵션 정의
  const defaultImageOptions = [
    { value: '/images/advisors/defaultProfessorM.png', label: '교수 (남성)' },
    { value: '/images/advisors/defaultProfessorF.png', label: '교수 (여성)' },
    { value: '/images/advisors/defaultDirectorF.png', label: '원장/대표 (여성)' },
    { value: '/images/advisors/defaultPharmacistF.png', label: '약사 (여성)' },
    { value: '/images/advisors/defaultPoliceM.png', label: '경찰 (남성)' }
  ]

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
    // 이미지 URL이 업데이트될 때 추적 시작
    if (field === 'imageUrl' && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
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
      order: data.list.length + 1,
      defaultImageUrl: '/images/advisors/defaultProfessorM.png' // 기본값
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
  const updateAdvisorArrayField = (advisorIndex: number, field: 'position' | 'education' | 'career', items: string[]) => {
    updateAdvisor(advisorIndex, field, items)
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

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      <AdminSection title="Hero 섹션" description="자문위원 Hero 섹션의 내용을 관리합니다.">
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
          folder="pages/about/advisors/hero"
          defaultImageUrl={data.hero?.defaultImageUrl}
          helper="Hero 섹션 배경으로 사용할 이미지를 업로드하세요"
        />
      </AdminSection>

      {/* About 메시지 섹션 */}
      <AdminSection title="소개 메시지" description="자문위원 소개 메시지 내용을 관리합니다.">
        <AdminInput
          label="제목"
          value={data.aboutMessage?.title || ''}
          onChange={(value) => updateAboutMessage('title', value)}
          placeholder="소개 메시지 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={data.aboutMessage?.description || ''}
          onChange={(value) => updateAboutMessage('description', value)}
          rows={4}
          placeholder="소개 메시지 설명"
          required
        />
      </AdminSection>

      {/* 자문위원 목록 */}
      <AdminSection 
        title="자문위원 목록" 
        description="자문위원들의 정보를 관리합니다."
        headerActions={
          <Button onClick={addAdvisor}>
            <Plus className="h-4 w-4 mr-2" />
            자문위원 추가
          </Button>
        }
      >
        <div className="space-y-4">
          {data.list?.map((advisor, index) => (
            <AdminCard key={index}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">자문위원 #{advisor.order}</h4>
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
                    <AdminInput
                      label="이름"
                      value={advisor.name}
                      onChange={(value) => updateAdvisor(index, 'name', value)}
                      placeholder="자문위원 이름"
                      required
                    />

                    <AdminArrayField
                      label="직책"
                      items={advisor.position || []}
                      onAdd={(item) => updateAdvisorArrayField(index, 'position', [...(advisor.position || []), item])}
                      onRemove={(itemIndex) => updateAdvisorArrayField(index, 'position', (advisor.position || []).filter((_, i) => i !== itemIndex))}
                      onUpdate={(itemIndex, item) => {
                        const newPosition = [...(advisor.position || [])]
                        newPosition[itemIndex] = item
                        updateAdvisorArrayField(index, 'position', newPosition)
                      }}
                      newItemDefault=""
                      placeholder="직책을 입력하세요"
                    />

                    <AdminArrayField
                      label="학력"
                      items={advisor.education || []}
                      onAdd={(item) => updateAdvisorArrayField(index, 'education', [...(advisor.education || []), item])}
                      onRemove={(itemIndex) => updateAdvisorArrayField(index, 'education', (advisor.education || []).filter((_, i) => i !== itemIndex))}
                      onUpdate={(itemIndex, item) => {
                        const newEducation = [...(advisor.education || [])]
                        newEducation[itemIndex] = item
                        updateAdvisorArrayField(index, 'education', newEducation)
                      }}
                      newItemDefault=""
                      placeholder="예: 서울대학교 의과대학 졸업"
                    />

                    <AdminArrayField
                      label="경력"
                      items={advisor.career || []}
                      onAdd={(item) => updateAdvisorArrayField(index, 'career', [...(advisor.career || []), item])}
                      onRemove={(itemIndex) => updateAdvisorArrayField(index, 'career', (advisor.career || []).filter((_, i) => i !== itemIndex))}
                      onUpdate={(itemIndex, item) => {
                        const newCareer = [...(advisor.career || [])]
                        newCareer[itemIndex] = item
                        updateAdvisorArrayField(index, 'career', newCareer)
                      }}
                      newItemDefault=""
                      placeholder="예: 서울대학교병원 소아과 교수"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">기본 이미지 선택</label>
                      <select
                        value={advisor.defaultImageUrl || '/images/advisors/defaultProfessorM.png'}
                        onChange={(e) => updateAdvisor(index, 'defaultImageUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {defaultImageOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <AdminImageUploadField
                      label="프로필 이미지"
                      value={advisor.imageUrl}
                      onChange={(url) => updateAdvisor(index, 'imageUrl', url)}
                      folder="pages/about/advisors"
                      defaultImageUrl={advisor.defaultImageUrl}
                      helper={`${advisor.position?.join(' ') || '자문위원'} 프로필 이미지를 업로드하세요`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="font-medium text-gray-900">{advisor.name || '이름 없음'}</h5>
                  <p className="text-sm text-gray-600">
                    {advisor.position?.join(', ') || '직책 없음'}
                  </p>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      </AdminSection>
    </div>
  )
}