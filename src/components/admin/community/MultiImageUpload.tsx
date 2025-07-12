'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { uploadImage, deleteImage, UploadProgress } from '@/lib/services/storageService'
import { Button } from '@/components/ui/button'

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export default function MultiImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  className = ''
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of acceptedFiles) {
        const fileName = `${Date.now()}-${file.name}`
        setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))

        const imageUrl = await uploadImage(file, {
          category: 'articles',
          onProgress: (progressData: UploadProgress) => {
            setUploadProgress(prev => ({ ...prev, [fileName]: progressData.progress }))
          }
        })

        newImages.push(imageUrl)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileName]
          return newProgress
        })
      }

      onImagesChange([...images, ...newImages])
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [images, onImagesChange, maxImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages
  })

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      await deleteImage(imageUrl)
      const newImages = images.filter((_, i) => i !== index)
      onImagesChange(newImages)
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      alert('이미지 삭제에 실패했습니다.')
    }
  }

  const copyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(`![이미지](${imageUrl})`)
    alert('마크다운 이미지 문법이 클립보드에 복사되었습니다.')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 업로드 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-wizfore-coral-primary bg-wizfore-coral-primary/5'
            : 'border-gray-300 hover:border-wizfore-coral-primary hover:bg-gray-50'
        } ${uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? '여기에 이미지를 놓아주세요' : '이미지를 드래그하거나 클릭하여 업로드'}
        </p>
        <p className="text-sm text-gray-500">
          최대 {maxImages}개, JPG, PNG, GIF, WebP 형식 지원
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ({images.length}/{maxImages}개 업로드됨)
        </p>
      </div>

      {/* 업로드 진행 상황 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">업로드 중...</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{fileName}</span>
                <span className="text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-wizfore-coral-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 업로드된 이미지 목록 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">업로드된 이미지</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`업로드된 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => copyImageUrl(imageUrl)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(imageUrl, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {imageUrl.split('/').pop()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 사용법:</p>
        <ul className="space-y-1 ml-2">
          <li>• 이미지를 업로드한 후 📷 버튼을 클릭하면 마크다운 문법이 클립보드에 복사됩니다.</li>
          <li>• 복사한 문법을 에디터에 붙여넣으면 이미지가 본문에 삽입됩니다.</li>
          <li>• ❌ 버튼을 클릭하면 이미지를 삭제할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  )
}