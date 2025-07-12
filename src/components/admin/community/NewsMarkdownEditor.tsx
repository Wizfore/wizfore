'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { uploadImage } from '@/lib/services/storageService'
import toast from 'react-hot-toast'

// 마크다운 에디터를 동적 임포트 (SSR 방지)
const MarkdownEditor = dynamic(
  () => import('@uiw/react-markdown-editor').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 border border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">에디터 로딩 중...</div>
      </div>
    )
  }
)

interface NewsMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  category?: string
  placeholder?: string
  height?: number
}

export default function NewsMarkdownEditor({
  value,
  onChange,
  category = 'general',
  placeholder = '내용을 입력하세요...',
  height = 400
}: NewsMarkdownEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const imageUrl = await uploadImage(file, {
        category,
        onProgress: (progress) => {
          setUploadProgress(progress.progress)
        }
      })

      toast.success('이미지 업로드 완료')
      return imageUrl
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      toast.error('이미지 업로드에 실패했습니다.')
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [category])

  // 드래그 앤 드롭 이미지 업로드
  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault()
    
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    for (const file of imageFiles) {
      try {
        const imageUrl = await handleImageUpload(file)
        const imageMarkdown = `![${file.name}](${imageUrl})\n\n`
        onChange(value + imageMarkdown)
      } catch (error) {
        // 에러는 handleImageUpload에서 처리됨
      }
    }
  }, [value, onChange, handleImageUpload])

  // 파일 선택으로 이미지 업로드
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    for (const file of files) {
      try {
        const imageUrl = await handleImageUpload(file)
        const imageMarkdown = `![${file.name}](${imageUrl})\n\n`
        onChange(value + imageMarkdown)
      } catch (error) {
        // 에러는 handleImageUpload에서 처리됨
      }
    }
    
    // 파일 선택 초기화
    event.target.value = ''
  }, [value, onChange, handleImageUpload])

  // 에디터 설정
  const editorProps = {
    value,
    onChange: (val: string) => onChange(val),
    placeholder,
    height: `${height}px`,
    data: {
      'data-color-mode': 'light'
    },
    toolbars: [
      'bold', 'italic', 'strikethrough',
      '|',
      'heading-1', 'heading-2', 'heading-3',
      '|',
      'quote', 'unordered-list', 'ordered-list', 'task',
      '|',
      'link', 'image', 'table', 'code',
      '|',
      'preview', 'edit', 'live'
    ] as any,
    // 커스텀 이미지 업로드 핸들러
    onImageUpload: async (file: File) => {
      return handleImageUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* 업로드 상태 표시 */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-blue-800">이미지 업로드 중... {Math.round(uploadProgress)}%</span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 이미지 업로드 도구 */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <ImageIcon className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">이미지 추가:</span>
        
        <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          파일 선택
        </label>
        
        <span className="text-xs text-gray-500">또는 에디터에 이미지를 드래그하세요</span>
      </div>

      {/* 마크다운 에디터 */}
      <div 
        className="border border-gray-300 rounded-lg overflow-hidden"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <MarkdownEditor {...editorProps} />
      </div>

      {/* 도움말 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">마크다운 에디터 사용법:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><code># 제목</code> - 헤딩</li>
              <li><code>**굵게**</code> - 굵은 텍스트</li>
              <li><code>*기울임*</code> - 기울임 텍스트</li>
              <li><code>[링크](URL)</code> - 링크</li>
              <li><code>![이미지](URL)</code> - 이미지</li>
              <li>이미지 파일을 에디터에 드래그하면 자동으로 업로드됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}