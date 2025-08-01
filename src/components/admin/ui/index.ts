// Admin UI 컴포넌트 시스템
// 모든 관리자 페이지에서 일관된 UI를 사용하기 위한 공통 컴포넌트들

// 기본 컴포넌트
export { AdminCard } from './AdminCard'
export { AdminSection } from './AdminSection'
export { AdminFormField } from './AdminFormField'

// 입력 컴포넌트
export { AdminInput } from './AdminInput'
export { AdminTextarea } from './AdminTextarea'
export { AdminSelect } from './AdminSelect'
export { AdminArrayField } from './AdminArrayField'
export { AdminImageUploadField } from './AdminImageUploadField'

// 타입 및 유틸리티
export type {
  AdminCardProps,
  AdminSectionProps,
  AdminFormFieldProps,
  AdminInputProps,
  AdminTextareaProps,
  AdminSelectProps,
  AdminArrayFieldProps,
  AdminImageUploadFieldProps,
} from '@/types/admin-ui'

export { AdminUITokens, cn } from '@/types/admin-ui'