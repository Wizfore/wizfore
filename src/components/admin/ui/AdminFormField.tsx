import { AdminFormFieldProps, AdminUITokens, cn } from '@/types/admin-ui'

/**
 * 관리자 페이지에서 사용하는 통일된 폼 필드 래퍼 컴포넌트
 * 라벨, 입력 필드, 에러 메시지, 도움말을 포함합니다.
 * 
 * @example
 * <AdminFormField label="사이트명" required>
 *   <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
 * </AdminFormField>
 * 
 * @example
 * <AdminFormField 
 *   label="이메일" 
 *   required 
 *   error="올바른 이메일 주소를 입력하세요"
 *   helper="예: admin@example.com"
 * >
 *   <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
 * </AdminFormField>
 */
export function AdminFormField({ 
  label, 
  children, 
  required = false, 
  error, 
  helper, 
  className 
}: AdminFormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className={cn(
        AdminUITokens.label.base,
        required && AdminUITokens.label.required
      )}>
        {label}
      </label>
      
      {children}
      
      {error && (
        <p className={AdminUITokens.text.error}>{error}</p>
      )}
      
      {helper && !error && (
        <p className={AdminUITokens.text.helper}>{helper}</p>
      )}
    </div>
  )
}