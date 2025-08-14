import React from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import type { DefaultSiteData } from '@/types'
import { AdminSection, AdminCard, AdminImageUploadField } from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

type SiteInfoData = DefaultSiteData['siteInfo']

interface ImagesTabProps {
  siteInfo: SiteInfoData
  onUpdate: (data: SiteInfoData) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
  onRegisterCallback?: (callback: () => void) => void
}

export function ImagesTab({ siteInfo, onUpdate, onUnsavedChanges, onRegisterCallback }: ImagesTabProps) {
  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, trackDeletedImage, processDeletedImages, markAsSaved, performCleanup } = useImageCleanup()

  const handleImageChange = (field: keyof SiteInfoData, url: string) => {
    // 이미지 URL 업데이트 시 추적 시작
    if (url && (field === 'faviconUrl' || field === 'headerLogoUrl')) {
      trackUploadedImage(url)
    }
    
    onUpdate({
      ...siteInfo,
      [field]: url
    })
  }

  // 저장 성공 시 모든 이미지 추적 중단 및 삭제 예정 이미지 처리
  const handleSaveSuccess = React.useCallback(async () => {
    await processDeletedImages() // 삭제 예정인 이미지들을 실제로 삭제
    stopTrackingAllImages()
    markAsSaved()
    console.log('Images 탭: 삭제 예정 이미지 처리 완료, 이미지 추적 중단 및 저장 완료 표시')
  }, [processDeletedImages, stopTrackingAllImages, markAsSaved])

  // 저장하지 않음 선택 시 업로드된 이미지 정리
  const handleDiscardChanges = React.useCallback(async () => {
    await performCleanup()
    console.log('Images 탭: 이미지 정리 완료')
  }, [performCleanup])

  // 컴포넌트 마운트 시 콜백 등록
  React.useEffect(() => {
    if (onRegisterCallback) {
      onRegisterCallback(handleSaveSuccess)
      console.log('Images 탭: 저장 성공 콜백 등록')
    }
  }, [onRegisterCallback, handleSaveSuccess])

  return (
    <AdminSection 
      title="이미지 설정" 
      description="사이트에서 사용되는 기본 이미지들을 설정합니다."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 파비콘 설정 */}
        <AdminCard>
          <div className="flex items-center space-x-2 mb-4">
            <UploadIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-800">파비콘</h3>
          </div>
          
          <AdminImageUploadField
            label="파비콘 이미지"
            value={siteInfo.faviconUrl}
            onChange={(url) => handleImageChange('faviconUrl', url)}
            folder="site-assets/favicon"
            defaultImageUrl={siteInfo.defaultFaviconUrl}
            helper="브라우저 탭에 표시되는 작은 아이콘 이미지 (권장 크기: 16x16, 32x32px)"
            onImageDelete={trackDeletedImage}
            required
          />
        </AdminCard>
        
        {/* 헤더 로고 설정 */}
        <AdminCard>
          <div className="flex items-center space-x-2 mb-4">
            <UploadIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-800">헤더 로고</h3>
          </div>
          
          <AdminImageUploadField
            label="헤더 로고 이미지"
            value={siteInfo.headerLogoUrl}
            onChange={(url) => handleImageChange('headerLogoUrl', url)}
            folder="site-assets/logo"
            defaultImageUrl={siteInfo.defaultHeaderLogoUrl}
            helper="웹사이트 상단에 표시되는 로고 이미지 (권장 높이: 40-60px)"
            onImageDelete={trackDeletedImage}
            required
          />
        </AdminCard>
      </div>
      
      <AdminCard className="bg-blue-50 border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 이미지 업로드 방법</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>파일 업로드:</strong> 드래그 앤 드롭 또는 클릭하여 파일을 선택하면 자동으로 Firebase Storage에 업로드됩니다.</p>
          <p><strong>URL 입력:</strong> 외부 호스팅 서비스의 이미지 URL을 직접 입력할 수 있습니다.</p>
          <p><strong>자동 최적화:</strong> 업로드된 이미지는 자동으로 적절한 크기로 리사이즈됩니다.</p>
          <p><strong>지원 형식:</strong> JPG, PNG, WebP, SVG 파일을 지원합니다.</p>
        </div>
      </AdminCard>
    </AdminSection>
  )
}