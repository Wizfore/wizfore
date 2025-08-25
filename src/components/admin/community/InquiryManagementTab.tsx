'use client'

import React, { useEffect, useState } from 'react'
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
  onRegisterCallback?: (callback: () => void) => void
  onRegisterCleanupCallback?: (callback: () => Promise<void>) => void
}

export default function InquiryManagementTab({ 
  data, 
  onUpdate,
  onRegisterCallback,
  onRegisterCleanupCallback
}: InquiryManagementTabProps) {
  const [inquiryData, setInquiryData] = useState<InquiryInfo>(data)

  const {
    trackDeletedImage,
    processDeletedImages,
    markAsSaved,
    performCleanup,
  } = useImageCleanup()

  const updateField = (path: string, value: string | string[]) => {
    if (path.includes('imageUrl') && typeof value === 'string') {
      processDeletedImages(inquiryData.hero?.imageUrl || '', value)
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

  useEffect(() => {
    if (onRegisterCallback) {
      onRegisterCallback(() => {
        markAsSaved()
      })
    }
  }, [onRegisterCallback, markAsSaved])

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
