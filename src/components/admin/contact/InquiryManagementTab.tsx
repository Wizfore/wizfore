'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { InquiryInfo } from '@/types/about'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface InquiryManagementTabProps {
  data: InquiryInfo
  onUpdate: (data: InquiryInfo) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
  onRegisterCallback?: (callback: () => void) => void
  onRegisterCleanupCallback?: (callback: () => Promise<void>) => void
}

export default function InquiryManagementTab({ 
  data, 
  onUpdate,
  onUnsavedChanges,
  onRegisterCallback,
  onRegisterCleanupCallback
}: InquiryManagementTabProps) {
  const [inquiryData, setInquiryData] = useState<InquiryInfo>(data)
  const [initialData, setInitialData] = useState<InquiryInfo>(JSON.parse(JSON.stringify(data)))

  const {
    trackUploadedImage,
    stopTrackingAllImages,
    trackDeletedImage,
    processDeletedImages,
    markAsSaved,
    performCleanup,
  } = useImageCleanup()

  // 변경사항 감지
  const hasChanges = JSON.stringify(inquiryData) !== JSON.stringify(initialData)

  // 변경사항을 부모에게 알림
  useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasChanges)
    }
  }, [hasChanges, onUnsavedChanges])

  const updateField = (path: string, value: string | string[]) => {
    // 이미지 URL이 업데이트될 때 추적 시작
    if (path.includes('imageUrl') && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
    const keys = path.split('.')
    const newData = { ...inquiryData }
    
    let current: any = newData
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setInquiryData(newData)
    onUpdate(newData)
  }

  const addCategory = () => {
    const newCategories = [...(inquiryData.categories || []), '새 카테고리']
    updateField('categories', newCategories)
  }

  const removeCategory = (index: number) => {
    const newCategories = inquiryData.categories.filter((_, i) => i !== index)
    updateField('categories', newCategories)
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...inquiryData.categories]
    newCategories[index] = value
    updateField('categories', newCategories)
  }

  // 저장 성공 시 모든 이미지 추적 중단 및 삭제 예정 이미지 처리
  const handleSaveSuccess = useCallback(async () => {
    await processDeletedImages() // 삭제 예정인 이미지들을 실제로 삭제
    stopTrackingAllImages()
    markAsSaved()
    // 현재 데이터를 새로운 초기 데이터로 설정
    setInitialData(JSON.parse(JSON.stringify(inquiryData)))
    // 변경사항 상태 초기화
    if (onUnsavedChanges) {
      onUnsavedChanges(false)
    }
    console.log('InquiryManagementTab: 삭제 예정 이미지 처리 완료, 이미지 추적 중단 및 저장 완료 표시')
  }, [processDeletedImages, stopTrackingAllImages, markAsSaved, inquiryData, onUnsavedChanges])

  useEffect(() => {
    if (onRegisterCallback) {
      onRegisterCallback(handleSaveSuccess)
    }
  }, [onRegisterCallback, handleSaveSuccess])

  useEffect(() => {
    if (onRegisterCleanupCallback) {
      onRegisterCleanupCallback(async () => {
        await performCleanup()
      })
    }
  }, [onRegisterCleanupCallback, performCleanup])

  useEffect(() => {
    setInquiryData(data)
  }, [data])

  return (
    <div className="space-y-8">
      <AdminSection
        title="히어로 섹션"
        description="문의 페이지 상단에 표시되는 히어로 섹션을 설정합니다"
      >
        <AdminInput
          label="제목"
          value={inquiryData.hero?.title || ''}
          onChange={(value) => updateField('hero.title', value)}
          placeholder="문의 페이지 제목"
        />
        
        <AdminTextarea
          label="설명"
          value={inquiryData.hero?.description || ''}
          onChange={(value) => updateField('hero.description', value)}
          placeholder="문의 페이지 설명"
        />
        
        <AdminImageUploadField
          label="배경 이미지"
          value={inquiryData.hero?.imageUrl || ''}
          onChange={(url) => updateField('hero.imageUrl', url)}
          folder="pages/inquiry/hero"
          defaultImageUrl={inquiryData.hero?.defaultImageUrl}
          helper="문의 페이지 히어로 섹션 배경으로 사용할 이미지를 업로드하세요"
          onImageDelete={trackDeletedImage}
        />
      </AdminSection>

      <AdminSection
        title="소개 메시지"
        description="문의 폼 위에 표시되는 소개 메시지를 설정합니다"
      >
        <AdminInput
          label="제목"
          value={inquiryData.aboutMessage?.title || ''}
          onChange={(value) => updateField('aboutMessage.title', value)}
          placeholder="소개 메시지 제목"
        />
        
        <AdminTextarea
          label="설명"
          value={inquiryData.aboutMessage?.description || ''}
          onChange={(value) => updateField('aboutMessage.description', value)}
          placeholder="문의 전 안내 메시지"
        />
      </AdminSection>

      <AdminSection
        title="문의 카테고리"
        description="문의 폼에서 선택할 수 있는 카테고리를 관리합니다"
      >
        <div className="space-y-4">
          {inquiryData.categories?.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <AdminInput
                  label=""
                  value={category}
                  onChange={(value) => updateCategory(index, value)}
                  placeholder="카테고리 이름"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCategory(index)}
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addCategory}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            카테고리 추가
          </Button>
        </div>
      </AdminSection>
    </div>
  )
}
