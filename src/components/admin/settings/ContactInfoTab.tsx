import React from 'react'
import type { DefaultSiteData } from '@/types'
import { AdminSection, AdminInput, AdminTextarea, AdminCard } from '@/components/admin/ui'

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
    <AdminSection 
      title="연락처 정보" 
      description="센터의 연락처와 운영 정보를 설정합니다."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminTextarea
          label="주소"
          value={siteInfo.contact.address}
          onChange={(value) => handleContactChange('address', value)}
          rows={3}
          placeholder="센터 주소를 입력하세요"
          required
        />
        
        <AdminInput
          label="전화번호"
          value={siteInfo.contact.phone}
          onChange={(value) => handleContactChange('phone', value)}
          placeholder="02-1234-5678"
          required
        />
        
        <AdminInput
          label="팩스"
          value={siteInfo.contact.fax}
          onChange={(value) => handleContactChange('fax', value)}
          placeholder="02-1234-5679"
        />
        
        <AdminInput
          label="이메일"
          type="email"
          value={siteInfo.contact.email}
          onChange={(value) => handleContactChange('email', value)}
          placeholder="contact@example.com"
          required
        />
        
        <AdminInput
          label="웹사이트"
          type="url"
          value={siteInfo.contact.website}
          onChange={(value) => handleContactChange('website', value)}
          placeholder="https://example.com"
        />
        
        <AdminInput
          label="사업자번호"
          value={siteInfo.contact.businessNumber}
          onChange={(value) => handleContactChange('businessNumber', value)}
          placeholder="123-45-67890"
        />
        
        <AdminInput
          label="계좌정보"
          value={siteInfo.contact.accountInfo}
          onChange={(value) => handleContactChange('accountInfo', value)}
          placeholder="은행명 계좌번호 예금주"
        />
        
        <AdminInput
          label="평일 운영시간"
          value={siteInfo.contact.operatingHours.weekday}
          onChange={(value) => handleOperatingHoursChange('weekday', value)}
          placeholder="09:00 - 18:00"
        />
        
        <AdminInput
          label="주말 운영시간"
          value={siteInfo.contact.operatingHours.weekend}
          onChange={(value) => handleOperatingHoursChange('weekend', value)}
          placeholder="09:00 - 17:00"
        />
      </div>
      
      <AdminInput
        label="지도 URL"
        type="url"
        value={siteInfo.contact.mapUrl}
        onChange={(value) => handleContactChange('mapUrl', value)}
        placeholder="구글 지도 임베드 URL을 입력하세요"
        helper="아래 안내에 따라 구글 지도 URL을 가져와 입력하세요"
      />

      <AdminCard className="bg-blue-50 border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 구글 지도 URL 가져오는 방법</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>구글 지도에서 원하는 위치를 검색합니다</li>
          <li>'공유' 버튼을 클릭합니다</li>
          <li>'지도 퍼가기' 탭을 선택합니다</li>
          <li>나타나는 iframe 코드에서 <code className="bg-blue-100 px-1 rounded">src="..."</code> 부분의 URL을 복사합니다</li>
          <li>복사한 URL을 위 입력창에 붙여넣기 합니다</li>
        </ol>
      </AdminCard>
    </AdminSection>
  )
}