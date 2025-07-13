'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Upload, Image as ImageIcon, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
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
  height?: number | string
}

export default function NewsMarkdownEditor({
  value,
  onChange,
  category = 'general',
  placeholder = "내용을 마크다운 형식으로 작성하세요...",
  height = 200
}: NewsMarkdownEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dynamicHeight, setDynamicHeight] = useState(typeof height === 'number' ? height : 400)
  const [isHelpExpanded, setIsHelpExpanded] = useState(true)

  // 내용 변경 시 높이 동적 계산
  useEffect(() => {
    if (typeof height === 'number' && value) {
      // 줄 수를 기반으로 높이 계산
      const lines = value.split('\n').length
      const lineHeight = 22 // 픽셀당 줄 높이
      const minHeight = height // 기본 높이 (200px)
      
      const calculatedHeight = Math.max(minHeight, (lines * lineHeight))
      setDynamicHeight(calculatedHeight)
    } else if (typeof height === 'number') {
      setDynamicHeight(height) // 내용이 없으면 기본 높이
    }
  }, [value, height])

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
    height: typeof height === 'string' ? height : `${dynamicHeight}px`,
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
    <div className="space-y-4 max-w-full min-w-0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
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
        className="border border-gray-300 rounded-lg overflow-hidden w-full"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <MarkdownEditor {...editorProps} />
        </div>
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsHelpExpanded(!isHelpExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">마크다운 에디터 사용법</span>
          </div>
          {isHelpExpanded ? (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          )}
        </button>
        
        {isHelpExpanded && (
          <div className="px-4 pb-4 text-sm text-blue-800">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 기본 텍스트 서식 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">📝 텍스트 서식</h4>
                <ul className="space-y-2 text-xs">
                  <li><code className="bg-blue-100 px-1 rounded"># 제목 1</code> - 큰 제목</li>
                  <li><code className="bg-blue-100 px-1 rounded">## 제목 2</code> - 중간 제목</li>
                  <li><code className="bg-blue-100 px-1 rounded">### 제목 3</code> - 작은 제목</li>
                  <li><code className="bg-blue-100 px-1 rounded">**굵게**</code> - 굵은 텍스트</li>
                  <li><code className="bg-blue-100 px-1 rounded">*기울임*</code> - 기울임 텍스트</li>
                  <li><code className="bg-blue-100 px-1 rounded">~~취소선~~</code> - 취소선</li>
                  <li><code className="bg-blue-100 px-1 rounded">`인라인 코드`</code> - 인라인 코드</li>
                </ul>
              </div>

              {/* 목록 및 링크 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">📋 목록 및 링크</h4>
                <ul className="space-y-2 text-xs">
                  <li><code className="bg-blue-100 px-1 rounded">- 항목</code> - 순서 없는 목록</li>
                  <li><code className="bg-blue-100 px-1 rounded">1. 항목</code> - 순서 있는 목록</li>
                  <li><code className="bg-blue-100 px-1 rounded">[링크 텍스트](URL)</code> - 링크</li>
                  <li><code className="bg-blue-100 px-1 rounded">![대체텍스트](이미지URL)</code> - 이미지</li>
                  <li><code className="bg-blue-100 px-1 rounded">&gt; 인용문</code> - 인용 블록</li>
                </ul>
              </div>

              {/* 이미지 크기 조정 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">🖼️ 이미지 크기 조정</h4>
                <ul className="space-y-2 text-xs">
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "작게")</code> - 작은 이미지 (300px)</li>
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "보통")</code> - 보통 이미지 (500px)</li>
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "크게")</code> - 큰 이미지 (700px)</li>
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "전체")</code> - 전체 너비</li>
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "400")</code> - 직접 크기 (400px)</li>
                  <li><code className="bg-blue-100 px-1 rounded">![설명](URL "50%")</code> - 비율로 크기</li>
                </ul>
              </div>

              {/* 테이블 및 코드 블록 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">📊 테이블 및 코드</h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <code className="bg-blue-100 px-1 rounded text-[10px]">
                      | 제목1 | 제목2 |<br/>
                      |------|------|<br/>
                      | 내용1 | 내용2 |
                    </code>
                  </li>
                  <li>
                    <code className="bg-blue-100 px-1 rounded">
                      ```언어<br/>
                      코드 블록<br/>
                      ```
                    </code>
                  </li>
                  <li><code className="bg-blue-100 px-1 rounded">---</code> - 구분선</li>
                </ul>
              </div>

              {/* 고급 기능 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">🚀 고급 기능</h4>
                <ul className="space-y-2 text-xs">
                  <li>✅ 이미지 드래그 앤 드롭으로 자동 업로드</li>
                  <li>✅ 실시간 미리보기 지원</li>
                  <li>✅ 동적 높이 조정</li>
                  <li>✅ 다양한 파일 형식 지원 (JPG, PNG, GIF, WebP)</li>
                  <li>✅ 코드 하이라이팅</li>
                  <li>✅ 수식 지원 (LaTeX)</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
              <p className="text-xs font-medium text-blue-900 mb-1">💡 팁</p>
              <p className="text-xs text-blue-800">
                • 이미지를 에디터 영역에 직접 드래그하면 자동으로 업로드되고 마크다운 형식으로 삽입됩니다<br/>
                • 이미지 크기 조정: 업로드 후 마크다운 문법 끝에 "작게", "보통", "크게", "전체" 또는 숫자를 추가하세요<br/>
                • 예시: ![logo](URL "작게") 또는 ![banner](URL "600") 형태로 사용<br/>
                • Ctrl+Z로 실행 취소, Ctrl+Y로 다시 실행할 수 있습니다<br/>
                • 에디터는 내용에 따라 자동으로 높이가 조정됩니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}