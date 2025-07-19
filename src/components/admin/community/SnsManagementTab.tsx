'use client'

import { Instagram, Youtube, Facebook, Globe } from 'lucide-react'
import type { SnsInfo } from '@/types/community'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

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
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={snsData.hero?.title || ''}
              onChange={(e) => updateField('hero.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SNS 페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={snsData.hero?.description || ''}
              onChange={(e) => updateField('hero.description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SNS 페이지 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배경 이미지
            </label>
            <ImageUpload
              value={snsData.hero?.imageUrl || ''}
              onChange={(url: string) => updateField('hero.imageUrl', url)}
              folder="hero-images"
            />
          </div>
        </div>
      </div>

      {/* About 메시지 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={snsData.aboutMessage?.title || ''}
              onChange={(e) => updateField('aboutMessage.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 섹션 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={snsData.aboutMessage?.description || ''}
              onChange={(e) => updateField('aboutMessage.description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 섹션 설명"
            />
          </div>
        </div>
      </div>

      {/* YouTube 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube 설정
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube 링크
            </label>
            <input
              type="url"
              value={snsData.youtube?.link || ''}
              onChange={(e) => updateField('youtube.link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/channel/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube 섹션 제목
            </label>
            <input
              type="text"
              value={snsData.youtube?.message?.title || ''}
              onChange={(e) => updateField('youtube.message.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YouTube 섹션 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube 섹션 설명
            </label>
            <textarea
              value={snsData.youtube?.message?.description || ''}
              onChange={(e) => updateField('youtube.message.description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YouTube 섹션 설명"
            />
          </div>
        </div>
      </div>

      {/* 소셜 미디어 링크 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소셜 미디어 링크</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-600" />
              Instagram
            </label>
            <input
              type="url"
              value={snsData.instagram || ''}
              onChange={(e) => updateField('instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </label>
            <input
              type="url"
              value={snsData.facebook || ''}
              onChange={(e) => updateField('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              블로그
            </label>
            <input
              type="url"
              value={snsData.blog || ''}
              onChange={(e) => updateField('blog', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://blog.naver.com/..."
            />
          </div>
        </div>
      </div>

      {/* 미리보기 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">설정 미리보기</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Hero 섹션</h4>
              <p className="text-sm text-gray-600">
                제목: {snsData.hero?.title || '(제목 없음)'}
              </p>
              <p className="text-sm text-gray-600">
                설명: {snsData.hero?.description || '(설명 없음)'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">소셜 미디어 링크</h4>
              <div className="flex gap-2 mt-2">
                {snsData.instagram && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">Instagram</span>
                )}
                {snsData.facebook && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Facebook</span>
                )}
                {snsData.youtube?.link && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">YouTube</span>
                )}
                {snsData.blog && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Blog</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}