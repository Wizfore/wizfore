'use client'

import { Instagram, Youtube, Facebook, Globe } from 'lucide-react'
import type { SnsInfo } from '@/types/community'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard
} from '@/components/admin/ui'

interface SnsManagementTabProps {
  data: SnsInfo
  onUpdate: (data: SnsInfo) => void
}

export default function SnsManagementTab({ data: snsData, onUpdate }: SnsManagementTabProps) {
  console.log('SnsManagementTab 렌더링, 받은 데이터:', snsData)

  const updateField = (path: string, value: string) => {
    console.log(`필드 업데이트: ${path} = "${value}"`)
    
    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(snsData)) // 깊은 복사
    let current: any = newData
    
    // 중첩 객체 경로 생성
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    // 최종 값 설정
    current[keys[keys.length - 1]] = value
    
    console.log('업데이트된 데이터:', newData)
    onUpdate(newData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">SNS 관리</h2>
        <p className="text-sm text-gray-600">SNS 페이지 설정 및 링크를 관리할 수 있습니다.</p>
      </div>

      {/* Hero 섹션 설정 */}
      <AdminSection title="Hero 섹션" description="SNS 페이지의 히어로 섹션을 관리합니다.">
        <AdminInput
          label="제목"
          value={snsData.hero?.title || ''}
          onChange={(value) => updateField('hero.title', value)}
          placeholder="SNS 페이지 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={snsData.hero?.description || ''}
          onChange={(value) => updateField('hero.description', value)}
          rows={3}
          placeholder="SNS 페이지 설명"
        />
        
        <AdminImageUploadField
          label="배경 이미지"
          value={snsData.hero?.imageUrl || ''}
          onChange={(url) => updateField('hero.imageUrl', url)}
          folder="pages/community/news/hero"
          defaultImageUrl={snsData.hero?.defaultImageUrl}
          helper="히어로 섹션 배경으로 사용할 이미지를 업로드하세요"
        />
      </AdminSection>

      {/* About 메시지 설정 */}
      <AdminSection title="소개 메시지" description="SNS 페이지의 소개 메시지를 관리합니다.">
        <AdminInput
          label="제목"
          value={snsData.aboutMessage?.title || ''}
          onChange={(value) => updateField('aboutMessage.title', value)}
          placeholder="소개 섹션 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={snsData.aboutMessage?.description || ''}
          onChange={(value) => updateField('aboutMessage.description', value)}
          rows={3}
          placeholder="소개 섹션 설명"
        />
      </AdminSection>

      {/* YouTube 설정 */}
      <AdminSection title="YouTube 설정" description="YouTube 채널 연동 설정을 관리합니다.">
        <div className="flex items-center gap-2 mb-4">
          <Youtube className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">YouTube 채널 설정</span>
        </div>
        
        <AdminInput
          label="YouTube 링크"
          value={snsData.youtube?.link || ''}
          onChange={(value) => updateField('youtube.link', value)}
          placeholder="https://youtube.com/channel/..."
          type="url"
        />
        
        <AdminInput
          label="YouTube 섹션 제목"
          value={snsData.youtube?.message?.title || ''}
          onChange={(value) => updateField('youtube.message.title', value)}
          placeholder="YouTube 섹션 제목"
        />
        
        <AdminTextarea
          label="YouTube 섹션 설명"
          value={snsData.youtube?.message?.description || ''}
          onChange={(value) => updateField('youtube.message.description', value)}
          rows={3}
          placeholder="YouTube 섹션 설명"
        />
      </AdminSection>

      {/* 소셜 미디어 링크 */}
      <AdminSection title="소셜 미디어 링크" description="각종 소셜 미디어 링크를 관리합니다.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-gray-700">Instagram</span>
            </div>
            <AdminInput
              label=""
              value={snsData.instagram || ''}
              onChange={(value) => updateField('instagram', value)}
              placeholder="https://instagram.com/..."
              type="url"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </div>
            <AdminInput
              label=""
              value={snsData.facebook || ''}
              onChange={(value) => updateField('facebook', value)}
              placeholder="https://facebook.com/..."
              type="url"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">블로그</span>
            </div>
            <AdminInput
              label=""
              value={snsData.blog || ''}
              onChange={(value) => updateField('blog', value)}
              placeholder="https://blog.naver.com/..."
              type="url"
            />
          </div>
        </div>
      </AdminSection>

      {/* 미리보기 */}
      <AdminSection title="설정 미리보기" description="현재 설정된 내용을 미리 확인할 수 있습니다.">
        <AdminCard>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Hero 섹션</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">제목:</span> {snsData.hero?.title || '(제목 없음)'}</p>
                <p><span className="font-medium">설명:</span> {snsData.hero?.description || '(설명 없음)'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">소셜 미디어 링크</h4>
              <div className="flex flex-wrap gap-2">
                {snsData.instagram && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">
                    <Instagram className="h-3 w-3" />
                    Instagram
                  </span>
                )}
                {snsData.facebook && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    <Facebook className="h-3 w-3" />
                    Facebook
                  </span>
                )}
                {snsData.youtube?.link && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    <Youtube className="h-3 w-3" />
                    YouTube
                  </span>
                )}
                {snsData.blog && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    <Globe className="h-3 w-3" />
                    Blog
                  </span>
                )}
                {!snsData.instagram && !snsData.facebook && !snsData.youtube?.link && !snsData.blog && (
                  <span className="text-sm text-gray-500">등록된 소셜 미디어 링크가 없습니다.</span>
                )}
              </div>
            </div>
          </div>
        </AdminCard>
      </AdminSection>
    </div>
  )
}