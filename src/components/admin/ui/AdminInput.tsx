import { AdminInputProps, AdminUITokens, cn } from '@/types/admin-ui'
import { AdminFormField } from './AdminFormField'

/**
 * 관리자 페이지에서 사용하는 통일된 입력 필드 컴포넌트
 * 라벨, 검증, 에러 처리를 포함한 완전한 입력 필드입니다.
 * 
 * @example
 * <AdminInput
 *   label="사이트명"
 *   value={siteName}
 *   onChange={setSiteName}
 *   placeholder="사이트명을 입력하세요"
 *   required
 * />
 * 
 * @example
 * <AdminInput
 *   label="설립일"
 *   type="date"
 *   value={establishedDate}
 *   onChange={setEstablishedDate}
 *   helper="YYYY-MM-DD 형식으로 입력됩니다"
 * />
 */
export function AdminInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  className
}: AdminInputProps) {
  return (
    <AdminFormField
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          AdminUITokens.input.base,
          disabled && AdminUITokens.input.disabled,
          error && 'border-red-300 focus:ring-red-500'
        )}
      />
    </AdminFormField>
  )
}