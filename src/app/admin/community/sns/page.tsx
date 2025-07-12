'use client'

import { useState, useEffect } from 'react'
import { Save, Instagram, Youtube, Facebook, Globe } from 'lucide-react'
import { getCommunity } from '@/lib/services/dataService'
import { Button } from '@/components/ui/button'

interface SnsData {
  hero?: {
    title?: string
    description?: string
    imageUrl?: string
  }
  aboutMessage?: {
    title?: string
    description?: string
  }
  youtube?: {
    link?: string
    message?: {
      title?: string
      description?: string
    }
  }
  instagram?: string
  facebook?: string
  blog?: string
}

export default function SnsManagePage() {
  const [snsData, setSnsData] = useState<SnsData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSnsData()
  }, [])

  const loadSnsData = async () => {
    try {
      setLoading(true)
      const communityData = await getCommunity()
      setSnsData(communityData?.sns || {})
    } catch (error) {
      console.error('SNS 데이터 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: updateSnsData 함수 구현 필요
      // await updateSnsData(snsData)
      alert('SNS 설정이 저장되었습니다.')
    } catch (error) {
      console.error('SNS 데이터 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (path: string, value: string) => {
    setSnsData(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2 text-gray-600">SNS 설정을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SNS 관리</h1>
          <p className="text-gray-600">SNS 페이지 설정 및 링크를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? '저장 중...' : '설정 저장'}
        </Button>
      </div>

      {/* Hero 섹션 설정 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h2>
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
              배경 이미지 URL
            </label>
            <input
              type="url"
              value={snsData.hero?.imageUrl || ''}
              onChange={(e) => updateField('hero.imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* About 메시지 설정 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h2>
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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube 설정
        </h2>
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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">소셜 미디어 링크</h2>
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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">설정 미리보기</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Hero 섹션</h3>
              <p className="text-sm text-gray-600">
                제목: {snsData.hero?.title || '(제목 없음)'}
              </p>
              <p className="text-sm text-gray-600">
                설명: {snsData.hero?.description || '(설명 없음)'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">소셜 미디어 링크</h3>
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