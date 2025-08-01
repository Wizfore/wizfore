import { AdminSectionProps, AdminUITokens, cn } from '@/types/admin-ui'
import { AdminCard } from './AdminCard'

/**
 * 관리자 페이지에서 사용하는 통일된 섹션 컴포넌트
 * 제목, 설명, 헤더 액션을 포함하는 카드 형태의 섹션입니다.
 * 
 * @example
 * <AdminSection title="기본 정보" description="사이트의 기본 정보를 설정합니다.">
 *   <AdminInput label="사이트명" value={name} onChange={setName} />
 * </AdminSection>
 * 
 * @example
 * <AdminSection 
 *   title="프로그램 관리" 
 *   description="프로그램 목록을 관리합니다."
 *   headerActions={<Button onClick={addProgram}>프로그램 추가</Button>}
 * >
 *   {프로그램 목록}
 * </AdminSection>
 */
export function AdminSection({ 
  title, 
  description, 
  children, 
  className, 
  headerActions 
}: AdminSectionProps) {
  return (
    <AdminCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={AdminUITokens.title.section}>{title}</h3>
          {description && (
            <p className={AdminUITokens.text.description}>{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>
      <div className={AdminUITokens.spacing.field}>
        {children}
      </div>
    </AdminCard>
  )
}