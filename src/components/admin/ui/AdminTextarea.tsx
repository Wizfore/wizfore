import { AdminTextareaProps, AdminUITokens, cn } from '@/types/admin-ui'
import { AdminFormField } from './AdminFormField'

/**
 * 관리자 페이지에서 사용하는 통일된 텍스트 영역 컴포넌트
 * 여러 줄 텍스트 입력에 사용됩니다.
 * 
 * @example
 * <AdminTextarea
 *   label="설립 목적"
 *   value={purpose}
 *   onChange={setPurpose}
 *   rows={4}
 *   placeholder="설립 목적을 입력하세요"
 *   required
 * />
 * 
 * @example
 * <AdminTextarea
 *   label="상세 설명"
 *   value={description}
 *   onChange={setDescription}
 *   rows={6}
 *   helper="최대 500자까지 입력 가능합니다"
 * />
 */
export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  className
}: AdminTextareaProps) {
  return (
    <AdminFormField
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
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