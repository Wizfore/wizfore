import type { TabComponentProps } from './HomeManagement'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

export function HeroTab({ data, setData, onUnsavedChanges }: TabComponentProps & { onUnsavedChanges?: (hasChanges: boolean) => void }) {
  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, performCleanup } = useImageCleanup()
  // 자동재생 설정 업데이트
  const updateAutoPlay = (autoPlay: boolean) => {
    setData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        hero: {
          ...prev.hero,
          autoPlay
        }
      }
    })
  }

  // 슬라이드 필드 업데이트
  const updateSlideField = (index: number, field: string, value: string | boolean) => {
    // 배경 이미지 URL 업데이트 시 추적 시작
    if (field === 'backgroundImage' && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
    const newSlides = [...(data?.hero?.slides || [])]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: newSlides
        }
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
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">히어로 섹션 관리</h3>
        <p className="text-gray-600 mb-4">메인 페이지 상단의 슬라이더 배너를 관리합니다.</p>
      </div>

      {/* 슬라이더 설정 */}
      <AdminSection title="슬라이더 설정" description="히어로 섹션의 기본 설정을 관리합니다.">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">자동재생</label>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="autoPlay"
              checked={data?.hero?.autoPlay || false}
              onChange={(e) => updateAutoPlay(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoPlay" className="text-sm text-gray-600">활성화</label>
          </div>
        </div>
      </AdminSection>

      {/* 슬라이드 목록 */}
      <AdminSection title={`슬라이드 목록 (${data?.hero?.slides?.length || 0}개)`} description="개별 슬라이드 콘텐츠를 관리합니다.">
        <div className="space-y-4">
          {data?.hero?.slides?.map((slide, index) => (
            <AdminCard key={slide.id}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">슬라이드 {index + 1}</h4>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={slide.enabled}
                    onChange={(e) => updateSlideField(index, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">활성화</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 텍스트 콘텐츠 */}
                <div className="space-y-4">
                  <AdminInput
                    label="제목"
                    value={slide.title}
                    onChange={(value) => updateSlideField(index, 'title', value)}
                    placeholder="슬라이드 제목"
                    required
                  />
                  
                  <AdminInput
                    label="버튼 텍스트"
                    value={slide.categoryText}
                    onChange={(value) => updateSlideField(index, 'categoryText', value)}
                    placeholder="버튼에 표시될 텍스트"
                  />
                  
                  <AdminTextarea
                    label="설명"
                    value={slide.description}
                    onChange={(value) => updateSlideField(index, 'description', value)}
                    rows={3}
                    placeholder="슬라이드 설명"
                  />
                </div>

                {/* 배경 이미지 */}
                <div>
                  <AdminImageUploadField
                    label="배경 이미지"
                    value={slide.backgroundImage || ''}
                    onChange={(url) => updateSlideField(index, 'backgroundImage', url)}
                    folder={`pages/home/hero/slide-${slide.id}`}
                    defaultImageUrl={slide.defaultBackgroundImage}
                    helper="슬라이드 배경으로 사용할 이미지를 업로드하세요"
                  />
                </div>
              </div>
            </AdminCard>
          ))}
          
          {(!data?.hero?.slides || data.hero.slides.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>등록된 슬라이드가 없습니다.</p>
            </div>
          )}
        </div>
      </AdminSection>
    </div>
  )
}