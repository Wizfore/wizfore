import React from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import { SimpleImageUpload } from '@/components/admin/common/SimpleImageUpload'
import type { DefaultSiteData } from '@/types'

type SiteInfoData = DefaultSiteData['siteInfo']

interface ImagesTabProps {
  siteInfo: SiteInfoData
  onUpdate: (data: SiteInfoData) => void
}

export function ImagesTab({ siteInfo, onUpdate }: ImagesTabProps) {
  const handleImageChange = (field: keyof SiteInfoData, url: string) => {
    onUpdate({
      ...siteInfo,
      [field]: url
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">이미지 설정</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 파비콘 설정 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
            <UploadIcon className="w-5 h-5" />
            <span>파비콘</span>
          </h3>
          
          {/* 파일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              파일 업로드
            </label>
            <SimpleImageUpload
              value={siteInfo.faviconUrl}
              onChange={(url) => handleImageChange('faviconUrl', url)}
              folder="site-assets/favicon"
              defaultImageUrl={siteInfo.defaultFaviconUrl}
              placeholder="파비콘 파일을 드래그하거나 클릭하여 업로드"
              imageClassName="w-16 h-16"
            />
          </div>
          
          {/* 또는 URL 직접 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              또는 URL 직접 입력
            </label>
            <input
              type="url"
              value={siteInfo.faviconUrl || ''}
              onChange={(e) => handleImageChange('faviconUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/favicon.ico"
            />
            <p className="mt-1 text-sm text-gray-500">
              브라우저 탭에 표시되는 작은 아이콘 이미지 URL
            </p>
          </div>
        </div>
        
        {/* 헤더 로고 설정 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
            <UploadIcon className="w-5 h-5" />
            <span>헤더 로고</span>
          </h3>
          
          {/* 파일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              파일 업로드
            </label>
            <SimpleImageUpload
              value={siteInfo.headerLogoUrl}
              onChange={(url) => handleImageChange('headerLogoUrl', url)}
              folder="site-assets/logo"
              defaultImageUrl={siteInfo.defaultHeaderLogoUrl}
              placeholder="로고 파일을 드래그하거나 클릭하여 업로드"
              imageClassName="h-16 w-auto"
            />
          </div>
          
          {/* 또는 URL 직접 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              또는 URL 직접 입력
            </label>
            <input
              type="url"
              value={siteInfo.headerLogoUrl || ''}
              onChange={(e) => handleImageChange('headerLogoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-sm text-gray-500">
              웹사이트 상단에 표시되는 로고 이미지 URL
            </p>
          </div>
        </div>
      </div>
      
      {/* 전체 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 이미지 업로드 방법</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>파일 업로드:</strong> 드래그 앤 드롭 또는 클릭하여 파일을 선택하면 자동으로 Firebase Storage에 업로드됩니다.</p>
          <p><strong>URL 입력:</strong> 외부 호스팅 서비스의 이미지 URL을 직접 입력할 수 있습니다.</p>
          <p><strong>자동 최적화:</strong> 업로드된 이미지는 자동으로 적절한 크기로 리사이즈됩니다.</p>
        </div>
      </div>
    </div>
  )
}