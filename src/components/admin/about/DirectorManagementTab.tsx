'use client'

import { DirectorInfo } from '@/types/about'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminArrayField, 
  AdminImageUploadField 
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

interface DirectorManagementTabProps {
  data: DirectorInfo
  onUpdate: (data: DirectorInfo) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
}

export default function DirectorManagementTab({ data, onUpdate, onUnsavedChanges }: DirectorManagementTabProps) {
  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, performCleanup } = useImageCleanup()
  // 기본 정보 업데이트 함수
  const updateBasicInfo = (field: keyof DirectorInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    })
  }

  // 배열 필드 업데이트 함수
  const updateArrayField = (field: keyof DirectorInfo, items: string[]) => {
    onUpdate({
      ...data,
      [field]: items
    })
  }

  // 중첩 객체 업데이트 함수
  const updateNestedObject = (parentField: 'aboutMessage' | 'hero', field: string, value: string | string[]) => {
    // Hero 이미지 URL이 업데이트될 때 추적 시작
    if (parentField === 'hero' && field === 'imageUrl' && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
    onUpdate({
      ...data,
      [parentField]: {
        ...data[parentField],
        [field]: value
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

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      {data.hero && (
        <AdminSection title="Hero 섹션" description="센터장 Hero 섹션의 내용을 관리합니다.">
          <AdminInput
            label="Hero 제목"
            value={data.hero.title || ''}
            onChange={(value) => updateNestedObject('hero', 'title', value)}
            placeholder="Hero 섹션 제목"
            required
          />
          
          <AdminTextarea
            label="Hero 설명"
            value={data.hero.description || ''}
            onChange={(value) => updateNestedObject('hero', 'description', value)}
            rows={3}
            placeholder="Hero 섹션 설명"
            required
          />
          
          <AdminImageUploadField
            label="Hero 배경 이미지"
            value={data.hero.imageUrl}
            onChange={(url) => updateNestedObject('hero', 'imageUrl', url)}
            folder="pages/about/director/hero"
            defaultImageUrl={data.hero?.defaultImageUrl}
            helper="Hero 섹션 배경으로 사용할 이미지를 업로드하세요"
          />
        </AdminSection>
      )}

      {/* 소개 메시지 섹션 */}
      {data.aboutMessage && (
        <AdminSection title="소개 메시지" description="센터장 소개 메시지 내용을 관리합니다.">
          <AdminInput
            label="제목"
            value={data.aboutMessage.title || ''}
            onChange={(value) => updateNestedObject('aboutMessage', 'title', value)}
            placeholder="소개 메시지 제목"
            required
          />
          
          <AdminTextarea
            label="설명"
            value={data.aboutMessage.description || ''}
            onChange={(value) => updateNestedObject('aboutMessage', 'description', value)}
            rows={4}
            placeholder="소개 메시지 설명"
            required
          />
          
          <AdminInput
            label="강조 키워드 (쉼표로 구분)"
            value={data.aboutMessage.highlightKeywords?.join(', ') || ''}
            onChange={(value) => {
              const keywords = value.split(',').map(k => k.trim()).filter(k => k)
              updateNestedObject('aboutMessage', 'highlightKeywords', keywords)
            }}
            placeholder="예: 전문적인 치료, 개별 맞춤 서비스, 지속적인 관리"
            helper="설명 텍스트에서 강조하고 싶은 키워드들을 쉼표로 구분하여 입력하세요"
          />
        </AdminSection>
      )}

      {/* 기본 정보 섹션 */}
      <AdminSection title="기본 정보" description="센터장의 기본 정보를 관리합니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <AdminInput
              label="센터장 이름"
              value={data.name || ''}
              onChange={(value) => updateBasicInfo('name', value)}
              placeholder="센터장 이름을 입력하세요"
              required
            />
            
            <AdminArrayField
              label="직책"
              items={data.position || []}
              onAdd={(item) => updateArrayField('position', [...(data.position || []), item])}
              onRemove={(index) => updateArrayField('position', (data.position || []).filter((_, i) => i !== index))}
              onUpdate={(index, item) => {
                const newPositions = [...(data.position || [])]
                newPositions[index] = item
                updateArrayField('position', newPositions)
              }}
              newItemDefault=""
              placeholder="직책을 입력하세요"
            />
          </div>
          
          <AdminImageUploadField
            label="프로필 이미지"
            value={data.imageUrl}
            onChange={(url) => updateBasicInfo('imageUrl', url)}
            folder="pages/about/director"
            defaultImageUrl={data.defaultImageUrl}
            helper="센터장 프로필 이미지를 업로드하세요"
          />
        </div>
      </AdminSection>

      {/* 상세 정보 섹션 */}
      <AdminSection title="상세 정보" description="센터장의 학력, 경력, 위원회 활동, 자격증 정보를 관리합니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AdminArrayField
              label="학력"
              items={data.education || []}
              onAdd={(item) => updateArrayField('education', [...(data.education || []), item])}
              onRemove={(index) => updateArrayField('education', (data.education || []).filter((_, i) => i !== index))}
              onUpdate={(index, item) => {
                const newEducation = [...(data.education || [])]
                newEducation[index] = item
                updateArrayField('education', newEducation)
              }}
              newItemDefault=""
              placeholder="학력을 입력하세요"
            />
            
            <AdminArrayField
              label="경력"
              items={data.career || []}
              onAdd={(item) => updateArrayField('career', [...(data.career || []), item])}
              onRemove={(index) => updateArrayField('career', (data.career || []).filter((_, i) => i !== index))}
              onUpdate={(index, item) => {
                const newCareer = [...(data.career || [])]
                newCareer[index] = item
                updateArrayField('career', newCareer)
              }}
              newItemDefault=""
              placeholder="경력을 입력하세요"
            />
          </div>
          
          <div className="space-y-6">
            <AdminArrayField
              label="위원회"
              items={data.committees || []}
              onAdd={(item) => updateArrayField('committees', [...(data.committees || []), item])}
              onRemove={(index) => updateArrayField('committees', (data.committees || []).filter((_, i) => i !== index))}
              onUpdate={(index, item) => {
                const newCommittees = [...(data.committees || [])]
                newCommittees[index] = item
                updateArrayField('committees', newCommittees)
              }}
              newItemDefault=""
              placeholder="위원회를 입력하세요"
            />
            
            <AdminArrayField
              label="자격증"
              items={data.certifications || []}
              onAdd={(item) => updateArrayField('certifications', [...(data.certifications || []), item])}
              onRemove={(index) => updateArrayField('certifications', (data.certifications || []).filter((_, i) => i !== index))}
              onUpdate={(index, item) => {
                const newCertifications = [...(data.certifications || [])]
                newCertifications[index] = item
                updateArrayField('certifications', newCertifications)
              }}
              newItemDefault=""
              placeholder="자격증을 입력하세요"
            />
          </div>
        </div>
      </AdminSection>
    </div>
  )
}