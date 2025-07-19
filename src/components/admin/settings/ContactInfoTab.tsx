import React from 'react'
import type { DefaultSiteData } from '@/types'

type SiteInfoData = DefaultSiteData['siteInfo']

interface ContactInfoTabProps {
  siteInfo: SiteInfoData
  onUpdate: (data: SiteInfoData) => void
}

export function ContactInfoTab({ siteInfo, onUpdate }: ContactInfoTabProps) {
  const handleContactChange = (field: keyof SiteInfoData['contact'], value: string) => {
    onUpdate({
      ...siteInfo,
      contact: { ...siteInfo.contact, [field]: value }
    })
  }

  const handleOperatingHoursChange = (field: keyof SiteInfoData['contact']['operatingHours'], value: string) => {
    onUpdate({
      ...siteInfo,
      contact: {
        ...siteInfo.contact,
        operatingHours: { ...siteInfo.contact.operatingHours, [field]: value }
      }
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">연락처 정보</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소
          </label>
          <textarea
            value={siteInfo.contact.address}
            onChange={(e) => handleContactChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="text"
            value={siteInfo.contact.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            팩스
          </label>
          <input
            type="text"
            value={siteInfo.contact.fax}
            onChange={(e) => handleContactChange('fax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={siteInfo.contact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            웹사이트
          </label>
          <input
            type="text"
            value={siteInfo.contact.website}
            onChange={(e) => handleContactChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사업자번호
          </label>
          <input
            type="text"
            value={siteInfo.contact.businessNumber}
            onChange={(e) => handleContactChange('businessNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계좌정보
          </label>
          <input
            type="text"
            value={siteInfo.contact.accountInfo}
            onChange={(e) => handleContactChange('accountInfo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            평일 운영시간
          </label>
          <input
            type="text"
            value={siteInfo.contact.operatingHours.weekday}
            onChange={(e) => handleOperatingHoursChange('weekday', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주말 운영시간
          </label>
          <input
            type="text"
            value={siteInfo.contact.operatingHours.weekend}
            onChange={(e) => handleOperatingHoursChange('weekend', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          지도 URL
        </label>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 구글 지도 URL 가져오는 방법</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>구글 지도에서 원하는 위치를 검색합니다</li>
            <li>'공유' 버튼을 클릭합니다</li>
            <li>'지도 퍼가기' 탭을 선택합니다</li>
            <li>나타나는 iframe 코드에서 <code className="bg-blue-100 px-1 rounded">src="..."</code> 부분의 URL을 복사합니다</li>
            <li>복사한 URL을 아래 입력창에 붙여넣기 합니다</li>
          </ol>
        </div>
      
        <input
          type="url"
          value={siteInfo.contact.mapUrl}
          onChange={(e) => handleContactChange('mapUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}