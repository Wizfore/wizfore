'use client'

import React, { useState, useEffect } from 'react'
import { ImageIcon, AlertCircle } from 'lucide-react'

interface ImagePreviewProps {
  imageUrl?: string
  fallbackPath?: string
  alt: string
  className?: string
  containerClassName?: string
  showLabel?: boolean
  label?: string
}

export function ImagePreview({
  imageUrl,
  fallbackPath,
  alt,
  className = '',
  containerClassName = '',
  showLabel = false,
  label
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [fallbackError, setFallbackError] = useState(false)

  // 실제 표시할 이미지 URL 결정
  const getDisplayImageUrl = () => {
    if (imageUrl && !imageError) {
      return imageUrl
    }
    if (fallbackPath && !fallbackError) {
      return fallbackPath
    }
    return null
  }

  const displayImageUrl = getDisplayImageUrl()

  const handleImageError = () => {
    if (imageUrl && !imageError) {
      setImageError(true)
    } else if (fallbackPath && !fallbackError) {
      setFallbackError(true)
    }
  }

  const resetErrors = () => {
    setImageError(false)
    setFallbackError(false)
  }

  // imageUrl이 변경되면 에러 상태 초기화
  useEffect(() => {
    setImageError(false)
    setFallbackError(false)
  }, [imageUrl])

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {showLabel && label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {displayImageUrl ? (
          <div className="relative">
            <img
              src={displayImageUrl}
              alt={alt}
              className={`border border-gray-300 rounded-lg object-cover ${className}`}
              onError={handleImageError}
            />
            {/* 이미지 정보 표시 */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {imageUrl && !imageError ? (
                <span>업로드된 이미지</span>
              ) : (
                <span>기본 이미지</span>
              )}
            </div>
          </div>
        ) : (
          // 이미지가 없거나 모든 이미지 로딩이 실패한 경우
          <div className={`border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 ${className}`}>
            {fallbackError ? (
              <>
                <AlertCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">이미지를 불러올 수 없습니다</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">이미지 없음</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 이미지 상태 정보 */}
      {(imageUrl || fallbackPath) && (
        <div className="text-xs text-gray-500 space-y-1">
          {imageUrl && (
            <div className="flex items-center justify-between">
              <span>업로드된 이미지:</span>
              <span className={imageError ? 'text-red-500' : 'text-green-600'}>
                {imageError ? '로딩 실패' : '정상'}
              </span>
            </div>
          )}
          {fallbackPath && (
            <div className="flex items-center justify-between">
              <span>기본 이미지:</span>
              <span className={fallbackError ? 'text-red-500' : 'text-blue-600'}>
                {fallbackError ? '로딩 실패' : '사용 가능'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}