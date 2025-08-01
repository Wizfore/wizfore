import React from 'react'
import type { DefaultSiteData } from '@/types'
import { AdminSection, AdminInput, AdminTextarea, AdminFormField, AdminUITokens } from '@/components/admin/ui'

type SiteInfoData = DefaultSiteData['siteInfo']

interface BasicInfoTabProps {
  siteInfo: SiteInfoData
  onUpdate: (data: SiteInfoData) => void
}

export function BasicInfoTab({ siteInfo, onUpdate }: BasicInfoTabProps) {
  const handleInputChange = (field: keyof SiteInfoData, value: string) => {
    onUpdate({
      ...siteInfo,
      [field]: value
    })
  }

  // 한국어 날짜 형식을 YYYY-MM-DD로 변환 (date input용)
  const formatDateForInput = (koreanDate: string): string => {
    if (!koreanDate) return ''
    
    // 한국어 형식에서 숫자 추출
    const match = koreanDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
    if (match) {
      const [, year, month, day] = match
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    
    return ''
  }

  // YYYY-MM-DD를 한국어 형식으로 변환
  const formatDateToKorean = (dateString: string): string => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      return `${year}년 ${month}월 ${day}일`
    } catch {
      return dateString
    }
  }

  const handleDateChange = (value: string) => {
    const koreanDate = formatDateToKorean(value)
    handleInputChange('establishedDate', koreanDate)
  }

  return (
    <AdminSection 
      title="기본 정보" 
      description="사이트의 기본 정보를 설정합니다."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="사이트명"
          value={siteInfo.name}
          onChange={(value) => handleInputChange('name', value)}
          placeholder="사이트명을 입력하세요"
          required
        />
        
        <AdminInput
          label="영문명"
          value={siteInfo.enName}
          onChange={(value) => handleInputChange('enName', value)}
          placeholder="영문명을 입력하세요"
        />
        
        <AdminFormField
          label="설립일"
          helper={siteInfo.establishedDate ? `저장된 형식: ${siteInfo.establishedDate}` : undefined}
        >
          <input
            type="date"
            value={formatDateForInput(siteInfo.establishedDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            className={AdminUITokens.input.base}
          />
        </AdminFormField>
      </div>
      
      <AdminTextarea
        label="설립 목적"
        value={siteInfo.purpose}
        onChange={(value) => handleInputChange('purpose', value)}
        rows={4}
        placeholder="설립 목적을 입력하세요"
      />
    </AdminSection>
  )
}