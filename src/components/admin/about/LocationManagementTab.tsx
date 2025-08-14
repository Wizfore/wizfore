'use client'

import React from 'react'
import { LocationInfo, TransportationInfo } from '@/types/about'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

interface LocationManagementTabProps {
  data: LocationInfo
  onUpdate: (data: LocationInfo) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
  onRegisterCallback?: (callback: () => void) => void
  onRegisterCleanupCallback?: (callback: () => Promise<void>) => void
}

export default function LocationManagementTab({ data, onUpdate, onUnsavedChanges, onRegisterCallback, onRegisterCleanupCallback }: LocationManagementTabProps) {
  // 이미지 정리 훅
  const {
    trackUploadedImage,
    stopTrackingAllImages,
    trackDeletedImage,
    processDeletedImages,
    markAsSaved,
    performCleanup,
  } = useImageCleanup()
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

  // 교통편 정보 업데이트
  const updateTransportation = (index: number, field: keyof TransportationInfo, value: string) => {
    // 아이콘 이미지 URL이 업데이트될 때 추적 시작
    if (field === 'iconPath' && value) {
      trackUploadedImage(value)
    }
    
    const newTransportation = [...(data.transportation || [])]
    newTransportation[index] = {
      ...newTransportation[index],
      [field]: value
    }
    onUpdate({
      ...data,
      transportation: newTransportation
    })
  }

  // 저장 성공 시 모든 이미지 추적 중단 및 삭제 예정 이미지 처리
  const handleSaveSuccess = React.useCallback(async () => {
    await processDeletedImages() // 삭제 예정인 이미지들을 실제로 삭제
    stopTrackingAllImages()
    markAsSaved()
    console.log('Location 탭: 삭제 예정 이미지 처리 완료, 이미지 추적 중단 및 저장 완료 표시')
  }, [processDeletedImages, stopTrackingAllImages, markAsSaved])

  // 저장하지 않음 선택 시 업로드된 이미지 정리
  const handleDiscardChanges = React.useCallback(async () => {
    await performCleanup()
    console.log('Location 탭: 이미지 정리 완료')
  }, [performCleanup])

  // 컴포넌트 마운트 시 콜백 등록
  React.useEffect(() => {
    if (onRegisterCallback) {
      onRegisterCallback(handleSaveSuccess)
      console.log('Location 탭: 저장 성공 콜백 등록')
    }
  }, [onRegisterCallback, handleSaveSuccess])

  // 컴포넌트 마운트 시 정리 콜백 등록
  React.useEffect(() => {
    if (onRegisterCleanupCallback) {
      onRegisterCleanupCallback(handleDiscardChanges)
      console.log('Location 탭: 정리 콜백 등록')
    }
  }, [onRegisterCleanupCallback, handleDiscardChanges])

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      <AdminSection title="Hero 섹션" description="오시는 길 Hero 섹션의 내용을 관리합니다.">
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
          folder="pages/about/location/hero"
          defaultImageUrl={data.hero?.defaultImageUrl}
          helper="Hero 섹션 배경으로 사용할 이미지를 업로드하세요"
          onImageDelete={trackDeletedImage}
        />
      </AdminSection>

      {/* About 메시지 섹션 */}
      <AdminSection title="소개 메시지" description="오시는 길 소개 메시지 내용을 관리합니다.">
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

      {/* 교통편 정보 */}
      <AdminSection title="교통편 정보" description="센터까지의 교통편 정보를 관리합니다.">
        <div className="space-y-4">
          {data.transportation?.map((transport, index) => (
            <AdminCard key={index}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 좌측: 기본 정보 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">교통수단</label>
                    <select
                      value={transport.type}
                      onChange={(e) => updateTransportation(index, 'type', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="지하철">지하철</option>
                      <option value="버스">버스</option>
                      <option value="차">차</option>
                    </select>
                  </div>
                  
                  <AdminInput
                    label="설명"
                    value={transport.description}
                    onChange={(value) => updateTransportation(index, 'description', value)}
                    placeholder="교통편 설명"
                    required
                  />
                </div>

                {/* 우측: 아이콘 이미지 */}
                <AdminImageUploadField
                  label="아이콘 이미지"
                  value={transport.iconPath}
                  onChange={(url) => updateTransportation(index, 'iconPath', url)}
                  folder={`pages/about/location/transportation/${transport.type}`}
                  defaultImageUrl={transport.defaultIconPath}
                  helper={`${transport.type} 교통편 아이콘을 업로드하세요`}
                  onImageDelete={trackDeletedImage}
                />
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>
    </div>
  )
}