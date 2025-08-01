import { ReactNode } from 'react'

// 디자인 토큰 정의
export const AdminUITokens = {
  // 간격
  spacing: {
    section: 'space-y-6',
    field: 'space-y-4',
    small: 'space-y-2',
  },
  
  // 카드 스타일
  card: {
    base: 'bg-white rounded-lg shadow border border-gray-200',
    padding: 'p-6',
    hover: 'hover:shadow-md transition-shadow duration-200',
  },
  
  // 입력 필드 스타일
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    small: 'flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500',
    disabled: 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed',
  },
  
  // 라벨 스타일
  label: {
    base: 'block text-sm font-medium text-gray-700 mb-2',
    small: 'block text-xs font-medium text-gray-700 mb-1',
    required: "after:content-['*'] after:text-red-500 after:ml-1",
  },
  
  // 제목 스타일
  title: {
    main: 'text-xl font-semibold text-gray-900',
    section: 'text-lg font-semibold text-gray-900 mb-4',
    subsection: 'text-sm font-medium text-gray-900',
  },
  
  // 텍스트 스타일
  text: {
    description: 'text-sm text-gray-600',
    helper: 'text-xs text-gray-500 mt-1',
    error: 'text-sm text-red-600 mt-1',
  },
  
  // 컬러 시스템
  colors: {
    backgrounds: {
      neutral: 'bg-gray-50',
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      purple: 'bg-purple-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
    },
    borders: {
      default: 'border-gray-200',
      focus: 'border-blue-500',
      error: 'border-red-300',
    },
  },
} as const

// 컴포넌트 Props 타입 정의
export interface AdminCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export interface AdminSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerActions?: ReactNode
}

export interface AdminFormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  helper?: string
  className?: string
}

export interface AdminInputProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helper?: string
  className?: string
}

export interface AdminTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helper?: string
  className?: string
}

export interface AdminSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helper?: string
  className?: string
}

export interface AdminArrayFieldProps<T = string> {
  label: string
  items: T[]
  onAdd: (item: T) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, item: T) => void
  placeholder?: string
  renderItem?: (item: T, index: number, onUpdate: (value: T) => void) => ReactNode
  newItemDefault: T
  className?: string
}

export interface AdminImageUploadFieldProps {
  label: string
  value: string | undefined
  onChange: (url: string) => void
  folder: string
  defaultImageUrl?: string
  required?: boolean
  error?: string
  helper?: string
  className?: string
}

// 유틸리티 함수
export const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ')
}