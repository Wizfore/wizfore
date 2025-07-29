'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadImage, deleteImage } from '@/lib/services/storageService'

interface SimpleImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder: string
  placeholder?: string
  defaultImageUrl?: string
  className?: string
  imageClassName?: string
}

export function SimpleImageUpload({
  value,
  onChange,
  folder,
  placeholder = '이미지를 선택하거나 드래그하세요',
  defaultImageUrl,
  className = '',
  imageClassName = 'h-32 w-auto'
}: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('파일 크기는 2MB 이하여야 합니다.')
      return
    }

    // 파일 형식 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setIsUploading(true)

    try {
      // 기존 이미지 삭제
      if (value) {
        try {
          await deleteImage(value)
        } catch (error) {
          console.warn('기존 이미지 삭제 실패:', error)
        }
      }

      // 새 이미지 업로드
      const newImageUrl = await uploadImage(file, { category: folder })
      onChange(newImageUrl)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      await deleteImage(value)
      onChange('')
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      alert('이미지 삭제에 실패했습니다.')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    // 파일 크기 체크 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('파일 크기는 2MB 이하여야 합니다.')
      return
    }

    // 파일 형식 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setIsUploading(true)

    try {
      // 기존 이미지 삭제
      if (value) {
        try {
          await deleteImage(value)
        } catch (error) {
          console.warn('기존 이미지 삭제 실패:', error)
        }
      }

      // 새 이미지 업로드
      const newImageUrl = await uploadImage(file, { category: folder })
      onChange(newImageUrl)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 표시할 이미지 URL 결정
  const displayImageUrl = value || defaultImageUrl

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 이미지 미리보기 */}
      {displayImageUrl && (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img
              src={displayImageUrl}
              alt="미리보기"
              className={`border border-gray-300 rounded-lg object-cover ${imageClassName}`}
              onError={(e) => {
                // 이미지 로딩 실패 시 기본 이미지로 fallback
                if (value && defaultImageUrl && e.currentTarget.src !== defaultImageUrl) {
                  e.currentTarget.src = defaultImageUrl
                }
              }}
            />
            {value && (
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                title="이미지 삭제"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {value ? '업로드된 이미지' : '기본 이미지'}
          </p>
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="mx-auto h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayImageUrl ? (
              <Upload className="mx-auto h-6 w-6 text-gray-400" />
            ) : (
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
            )}
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG • 최대 2MB</p>
          </div>
        )}
      </div>
    </div>
  )
}