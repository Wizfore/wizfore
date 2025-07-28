'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadImage, deleteImage } from '@/lib/services/storageService'
import { ImagePreview } from './ImagePreview'
import { getFallbackImageForContext } from './utils/fallbackImages'

interface SingleImageUploadProps {
  imageUrl?: string
  onImageChange: (url: string) => void
  category: 'favicon' | 'logo'
  className?: string
  accept?: string[]
  maxFileSize?: number
  showPreview?: boolean
  previewLabel?: string
}

export default function SingleImageUpload({
  imageUrl,
  onImageChange,
  category,
  className = '',
  accept = ['.png', '.jpg', '.jpeg', '.ico', '.svg'],
  maxFileSize = 2 * 1024 * 1024, // 2MB
  showPreview = true,
  previewLabel
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError('파일 형식이나 크기가 올바르지 않습니다.')
      return
    }

    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    setUploading(true)
    setError(null)
    setSuccess(false)
    setUploadProgress(0)

    try {
      // 기존 이미지 삭제
      if (imageUrl) {
        try {
          await deleteImage(imageUrl)
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패:', deleteError)
        }
      }

      // 새 이미지 업로드
      const newImageUrl = await uploadImage(file, {
        category: `site-assets/${category}`,
        onProgress: (progress) => {
          setUploadProgress(progress.progress)
        }
      })

      onImageChange(newImageUrl)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
      setError(err instanceof Error ? err.message : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [imageUrl, onImageChange, category])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': accept
    },
    multiple: false,
    maxSize: maxFileSize,
    disabled: uploading
  })

  const removeImage = async () => {
    if (!imageUrl) return

    try {
      await deleteImage(imageUrl)
      onImageChange('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('이미지 삭제 실패:', err)
      setError('이미지 삭제에 실패했습니다.')
    }
  }

  const resetError = () => setError(null)

  const getRecommendedSize = () => {
    switch (category) {
      case 'favicon':
        return '16x16 또는 32x32 픽셀'
      case 'logo':
        return '최대 높이 60px'
      default:
        return ''
    }
  }

  const getFileFormats = () => {
    switch (category) {
      case 'favicon':
        return 'ICO, PNG 권장'
      case 'logo':
        return 'PNG (투명 배경 권장)'
      default:
        return 'PNG, JPG, ICO, SVG'
    }
  }

  // Fallback 이미지 경로 계산
  const fallbackImagePath = getFallbackImageForContext({
    category
  })

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
          <button
            onClick={resetError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 성공 메시지 */}
      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 text-sm">
            {imageUrl ? '이미지가 업로드되었습니다.' : '이미지가 삭제되었습니다.'}
          </span>
        </div>
      )}

      {/* 이미지 미리보기 */}
      {showPreview && !uploading && (
        <div className="space-y-2">
          <ImagePreview
            imageUrl={imageUrl}
            fallbackPath={fallbackImagePath}
            alt={previewLabel || `${category} 이미지`}
            className={category === 'favicon' ? 'w-16 h-16' : 'h-16 w-auto'}
            showLabel={!!previewLabel}
            label={previewLabel}
          />
          
          {imageUrl && (
            <div className="flex justify-end">
              <button
                onClick={removeImage}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                title="이미지 삭제"
              >
                <X className="w-4 h-4" />
                이미지 삭제
              </button>
            </div>
          )}
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-3">
            <div className="mx-auto h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">업로드 중... ({Math.round(uploadProgress)}%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? '여기에 이미지를 놓아주세요' : '이미지를 드래그하거나 클릭하여 업로드'}
            </p>
            <p className="text-xs text-gray-500">
              {getFileFormats()} • 최대 {Math.round(maxFileSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>

      {/* 이미지 가이드 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          {category === 'favicon' ? '파비콘' : '로고'} 업로드 가이드
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 권장 크기: {getRecommendedSize()}</li>
          <li>• 파일 형식: {getFileFormats()}</li>
          <li>• 최대 파일 크기: {Math.round(maxFileSize / 1024 / 1024)}MB</li>
          {category === 'favicon' && (
            <li>• 브라우저 탭에 표시되는 작은 아이콘입니다</li>
          )}
          {category === 'logo' && (
            <li>• 투명 배경 PNG 파일을 권장합니다</li>
          )}
        </ul>
      </div>
    </div>
  )
}