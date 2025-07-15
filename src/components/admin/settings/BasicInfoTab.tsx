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
            type="text"
            value={siteInfo.establishedDate}
            onChange={(e) => handleInputChange('establishedDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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