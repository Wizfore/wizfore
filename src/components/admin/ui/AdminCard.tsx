import { AdminCardProps, AdminUITokens, cn } from '@/types/admin-ui'

/**
 * 관리자 페이지에서 사용하는 통일된 카드 컴포넌트
 * 일관된 스타일링과 hover 효과를 제공합니다.
 * 
 * @example
 * <AdminCard>
 *   <h3>제목</h3>
 *   <p>내용</p>
 * </AdminCard>
 * 
 * @example
 * <AdminCard hover className="mb-4">
 *   상호작용이 가능한 카드
 * </AdminCard>
 */
export function AdminCard({ children, className, hover = false }: AdminCardProps) {
  return (
    <div 
      className={cn(
        AdminUITokens.card.base,
        AdminUITokens.card.padding,
        hover && AdminUITokens.card.hover,
        className
      )}
    >
      {children}
    </div>
  )
}