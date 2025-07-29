'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import ImageResize from 'tiptap-extension-resize-image'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useState, useCallback, useEffect, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Upload,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Palette,
  Highlighter
} from 'lucide-react'
import { uploadImage } from '@/lib/services/storageService'
import toast from 'react-hot-toast'

// 색상 팔레트 데이터
const TEXT_COLORS = [
  { name: '기본', color: '#000000' },
  { name: '회색', color: '#6B7280' },
  { name: '진한 회색', color: '#374151' },
  { name: '빨강', color: '#EF4444' },
  { name: '주황', color: '#F97316' },
  { name: '노랑', color: '#EAB308' },
  { name: '초록', color: '#22C55E' },
  { name: '파랑', color: '#3B82F6' },
  { name: '보라', color: '#8B5CF6' },
  { name: '분홍', color: '#EC4899' },
  { name: '진한 빨강', color: '#DC2626' },
  { name: '진한 파랑', color: '#2563EB' }
]

const HIGHLIGHT_COLORS = [
  { name: '없음', color: 'transparent' },
  { name: '노랑', color: '#FEF08A' },
  { name: '초록', color: '#BBF7D0' },
  { name: '파랑', color: '#BFDBFE' },
  { name: '분홍', color: '#FBCFE8' },
  { name: '주황', color: '#FED7AA' },
  { name: '보라', color: '#DDD6FE' },
  { name: '회색', color: '#E5E7EB' },
  { name: '빨강', color: '#FECACA' }
]

// 색상 처리 유틸리티 함수
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbaToString = (hex: string, opacity: number): string => {
  if (hex === 'transparent') return 'transparent'
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`
}

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  category?: string
  articleId?: string // 기사 ID 추가
  placeholder?: string
  className?: string
}

export default function TiptapEditor({
  value,
  onChange,
  category = 'general',
  articleId,
  placeholder = "내용을 작성하세요...",
  className = ""
}: TiptapEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [isHelpExpanded, setIsHelpExpanded] = useState(false)
  
  // 색상 선택기 상태
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [textColorOpacity, setTextColorOpacity] = useState(100)
  const [highlightOpacity, setHighlightOpacity] = useState(50)
  const [selectedTextColor, setSelectedTextColor] = useState('#000000')
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#FEF08A')
  
  // 외부 클릭 감지를 위한 ref
  const textColorRef = useRef<HTMLDivElement>(null)
  const highlightColorRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false)
      }
      if (highlightColorRef.current && !highlightColorRef.current.contains(event.target as Node)) {
        setShowHighlightPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 이미지 업로드 함수
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.')
      return null
    }

    setUploading(true)
    try {
      // articleId가 있으면 커뮤니티 뉴스 전용 경로 사용
      const uploadCategory = articleId ? `pages/community/news/${articleId}` : category
      const imageUrl = await uploadImage(file, { category: uploadCategory })
      toast.success('이미지 업로드 완료!')
      return imageUrl
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      toast.error('이미지 업로드에 실패했습니다.')
      return null
    } finally {
      setUploading(false)
    }
  }, [category, articleId])

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 크기는 5MB 이하여야 합니다.')
          continue
        }

        try {
          setUploading(true)
          // articleId가 있으면 커뮤니티 뉴스 전용 경로 사용
          const uploadCategory = articleId ? `pages/community/news/${articleId}` : category
          const imageUrl = await uploadImage(file, { category: uploadCategory })
          if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error)
          alert('이미지 업로드에 실패했습니다.')
        } finally {
          setUploading(false)
        }
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      ImageResize.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg shadow-sm max-w-full h-auto tiptap-image'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle']
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'custom-highlight'
        }
      }),
      Placeholder.configure({
        placeholder: placeholder
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 markdown-content tiptap-editor ${className}`
      }
    }
  })


  if (!editor) {
    return (
      <div className="h-96 border border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">에디터 로딩 중...</div>
      </div>
    )
  }

  // 색상 적용 함수들
  const applyTextColor = (color: string, opacity: number) => {
    const colorValue = rgbaToString(color, opacity)
    editor.chain().focus().setColor(colorValue).run()
    setSelectedTextColor(color)
    setTextColorOpacity(opacity)
    setShowTextColorPicker(false)
  }

  const applyHighlight = (color: string, opacity: number) => {
    if (color === 'transparent') {
      editor.chain().focus().unsetHighlight().run()
    } else {
      const colorValue = rgbaToString(color, opacity)
      editor.chain().focus().toggleHighlight({ color: colorValue }).run()
    }
    setSelectedHighlightColor(color)
    setHighlightOpacity(opacity)
    setShowHighlightPicker(false)
  }

  // 링크 추가 함수
  const addLink = () => {
    const url = window.prompt('링크 URL을 입력하세요:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  // 이미지 추가 함수
  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const imageUrl = await handleImageUpload(file)
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }
      }
    }
    input.click()
  }

  // 구분선 추가 함수
  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* 텍스트 서식 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="굵게"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="기울임"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="밑줄"
          >
            <UnderlineIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="취소선"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* 제목 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="제목 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="제목 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="제목 3"
          >
            <Heading3 size={16} />
          </button>
        </div>

        {/* 목록 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="순서 없는 목록"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="순서 있는 목록"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="인용"
          >
            <Quote size={16} />
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="왼쪽 정렬"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="가운데 정렬"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            title="오른쪽 정렬"
          >
            <AlignRight size={16} />
          </button>
        </div>

        {/* 글자색, 배경색 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          {/* 글자색 선택기 */}
          <div className="relative" ref={textColorRef}>
            <button
              type="button"
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
              className="p-2 rounded hover:bg-gray-200 text-gray-600 relative"
              title="글자색"
            >
              <Palette size={16} />
              <div 
                className="absolute bottom-0 right-0 w-3 h-1 rounded-sm border border-white"
                style={{ backgroundColor: selectedTextColor }}
              />
            </button>
            
            {showTextColorPicker && (
              <div className="absolute top-10 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px]">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">글자색 선택</h4>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {TEXT_COLORS.map((colorItem, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedTextColor(colorItem.color)}
                        className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                          selectedTextColor === colorItem.color ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: colorItem.color }}
                        title={colorItem.name}
                      />
                    ))}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">
                      투명도: {textColorOpacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={textColorOpacity}
                      onChange={(e) => setTextColorOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="mb-3 p-3 border rounded bg-gray-50">
                    <div className="text-xs text-gray-600 mb-1">미리보기:</div>
                    <div 
                      className="text-sm"
                      style={{ color: rgbaToString(selectedTextColor, textColorOpacity) }}
                    >
                      샘플 텍스트
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyTextColor(selectedTextColor, textColorOpacity)}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      적용
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTextColorPicker(false)}
                      className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 배경색 선택기 */}
          <div className="relative" ref={highlightColorRef}>
            <button
              type="button"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="p-2 rounded hover:bg-gray-200 text-gray-600 relative"
              title="배경색"
            >
              <Highlighter size={16} />
              <div 
                className="absolute bottom-0 right-0 w-3 h-1 rounded-sm border border-white"
                style={{ backgroundColor: selectedHighlightColor }}
              />
            </button>
            
            {showHighlightPicker && (
              <div className="absolute top-10 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px]">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">배경색 선택</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {HIGHLIGHT_COLORS.map((colorItem, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedHighlightColor(colorItem.color)}
                        className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                          selectedHighlightColor === colorItem.color ? 'border-blue-500' : 'border-gray-300'
                        } ${colorItem.color === 'transparent' ? 'bg-white relative' : ''}`}
                        style={{ backgroundColor: colorItem.color === 'transparent' ? '#ffffff' : colorItem.color }}
                        title={colorItem.name}
                      >
                        {colorItem.color === 'transparent' && (
                          <span className="absolute inset-0 flex items-center justify-center text-red-500 text-lg leading-none">×</span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {selectedHighlightColor !== 'transparent' && (
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">
                        투명도: {highlightOpacity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={highlightOpacity}
                        onChange={(e) => setHighlightOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                  
                  <div className="mb-3 p-3 border rounded bg-gray-50">
                    <div className="text-xs text-gray-600 mb-1">미리보기:</div>
                    <div 
                      className="text-sm px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: selectedHighlightColor === 'transparent' 
                          ? 'transparent' 
                          : rgbaToString(selectedHighlightColor, highlightOpacity) 
                      }}
                    >
                      샘플 텍스트
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyHighlight(selectedHighlightColor, highlightOpacity)}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      적용
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHighlightPicker(false)}
                      className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 링크, 이미지, 구분선 */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={addLink}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="링크 추가"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={addImage}
            disabled={uploading}
            className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
            title="이미지 추가"
          >
            {uploading ? <Upload size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          </button>
          <button
            type="button"
            onClick={addHorizontalRule}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="구분선 추가"
          >
            <div className="w-4 h-0.5 bg-gray-600"></div>
          </button>
        </div>

        {/* 실행 취소/다시 실행 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
            title="실행 취소"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
            title="다시 실행"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      {/* 에디터 */}
      <div 
        className="min-h-[400px] bg-white relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <EditorContent editor={editor} />
        
        {/* 업로드 인디케이터 */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>이미지 업로드 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 border-t border-blue-200">
        <button
          type="button"
          onClick={() => setIsHelpExpanded(!isHelpExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">WYSIWYG 에디터 사용법</span>
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
              {/* 기본 사용법 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">✏️ 기본 사용법</h4>
                <ul className="space-y-2 text-xs">
                  <li>• 텍스트를 선택한 후 툴바 버튼을 클릭하여 서식 적용</li>
                  <li>• 이미지를 에디터에 드래그하거나 클립보드에서 붙여넣기</li>
                  <li>• 링크 추가: 텍스트 선택 후 링크 버튼 클릭</li>
                  <li>• <span className="bg-yellow-100 px-1 rounded font-medium">글자색/배경색</span>: 텍스트 선택 후 색상 버튼 클릭</li>
                  <li>• <span className="bg-yellow-100 px-1 rounded font-medium">Enter</span>: 새 문단 시작 / <span className="bg-yellow-100 px-1 rounded font-medium">Shift+Enter</span>: 줄바꿈</li>
                </ul>
              </div>

              {/* 단축키 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">⌨️ 키보드 단축키</h4>
                <ul className="space-y-2 text-xs">
                  <li><code className="bg-yellow-100 px-1 rounded font-medium">Shift+Enter</code> - <span className="font-medium text-orange-700">줄바꿈</span></li>
                  <li><code className="bg-blue-100 px-1 rounded">Ctrl+B</code> - 굵게</li>
                  <li><code className="bg-blue-100 px-1 rounded">Ctrl+I</code> - 기울임</li>
                  <li><code className="bg-blue-100 px-1 rounded">Ctrl+U</code> - 밑줄</li>
                  <li><code className="bg-blue-100 px-1 rounded">Ctrl+Z</code> - 실행 취소</li>
                  <li><code className="bg-blue-100 px-1 rounded">Ctrl+Y</code> - 다시 실행</li>
                </ul>
              </div>

              {/* 마크다운 단축키 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">📝 마크다운 단축키</h4>
                <ul className="space-y-2 text-xs">
                  <li><code className="bg-blue-100 px-1 rounded"># 제목</code> - 제목 1</li>
                  <li><code className="bg-blue-100 px-1 rounded">## 제목</code> - 제목 2</li>
                  <li><code className="bg-blue-100 px-1 rounded">- 항목</code> - 목록</li>
                  <li><code className="bg-blue-100 px-1 rounded">&gt; 인용</code> - 인용문</li>
                </ul>
              </div>

              {/* 이미지 기능 */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">🖼️ 이미지 기능</h4>
                <ul className="space-y-2 text-xs">
                  <li>• 드래그 앤 드롭으로 이미지 업로드</li>
                  <li>• 클립보드에서 이미지 붙여넣기</li>
                  <li>• <span className="bg-yellow-100 px-1 rounded font-medium">이미지 선택 → 코너 핸들 드래그</span>로 크기 조절</li>
                  <li>• 이미지 선택 후 정렬 버튼으로 위치 조정</li>
                  <li>• 자동으로 Firebase Storage에 업로드</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
              <p className="text-xs font-medium text-blue-900 mb-1">💡 팁</p>
              <p className="text-xs text-blue-800">
                • Word나 Google Docs처럼 직관적으로 사용하세요<br/>
                • 이미지나 표를 클릭하면 추가 옵션이 나타납니다<br/>
                • 실시간으로 저장되므로 별도 저장 걱정 없습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}