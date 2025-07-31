import React from 'react'
import type { DefaultSiteData } from '@/types'

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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사이트명
          </label>
          <input
            type="text"
            value={siteInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            영문명
          </label>
          <input
            type="text"
            value={siteInfo.enName}
            onChange={(e) => handleInputChange('enName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설립일
          </label>
          <input
            type="date"
            value={formatDateForInput(siteInfo.establishedDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {siteInfo.establishedDate && (
            <p className="text-xs text-gray-500 mt-1">
              저장된 형식: {siteInfo.establishedDate}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설립 목적
        </label>
        <textarea
          value={siteInfo.purpose}
          onChange={(e) => handleInputChange('purpose', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}