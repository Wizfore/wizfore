import { AdminSelectProps, AdminUITokens, cn } from '@/types/admin-ui'
import { AdminFormField } from './AdminFormField'

/**
 * 관리자 페이지에서 사용하는 통일된 선택 필드 컴포넌트
 * 드롭다운 선택 입력에 사용됩니다.
 * 
 * @example
 * <AdminSelect
 *   label="카테고리"
 *   value={selectedCategory}
 *   onChange={setSelectedCategory}
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'news', label: '소식' },
 *     { value: 'notice', label: '공지사항' }
 *   ]}
 *   required
 * />
 * 
 * @example
 * <AdminSelect
 *   label="상태"
 *   value={status}
 *   onChange={setStatus}
 *   options={statusOptions}
 *   placeholder="상태를 선택하세요"
 *   helper="상태에 따라 노출 여부가 결정됩니다"
 * />
 */
export function AdminSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  className
}: AdminSelectProps) {
  return (
    <AdminFormField
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          AdminUITokens.input.base,
          disabled && AdminUITokens.input.disabled,
          error && 'border-red-300 focus:ring-red-500'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </AdminFormField>
  )
}