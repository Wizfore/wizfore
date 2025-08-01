import type { TabComponentProps } from './HomeManagement'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminCard
} from '@/components/admin/ui'

export function CategoryCardsTab({ data, setData }: TabComponentProps) {
  // 깊은 복사를 사용한 필드 업데이트 함수
  const updateField = (field: 'title' | 'description' | 'enabled', value: string | boolean) => {
    setData(prev => ({
      ...prev!,
      sections: {
        ...prev!.sections,
        categoryCards: {
          title: field === 'title' ? value as string : prev!.sections?.categoryCards?.title || '',
          description: field === 'description' ? value as string : prev!.sections?.categoryCards?.description || '',
          enabled: field === 'enabled' ? value as boolean : prev!.sections?.categoryCards?.enabled || false
        }
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">카테고리 카드 섹션</h3>
        <p className="text-gray-600 mb-4">4대 프로그램 카테고리 영역의 설정을 관리합니다.</p>
      </div>

      {/* 섹션 설정 */}
      <AdminSection title="카테고리 카드 섹션 설정" description="홈페이지의 프로그램 카테고리 섹션을 관리합니다.">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">섹션 활성화</label>
          <input 
            type="checkbox"
            checked={data?.sections?.categoryCards?.enabled || false}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <AdminInput
          label="섹션 제목"
          value={data?.sections?.categoryCards?.title || ''}
          onChange={(value) => updateField('title', value)}
          placeholder="위즈포레 프로그램"
          required
        />

        <AdminTextarea
          label="섹션 설명"
          value={data?.sections?.categoryCards?.description || ''}
          onChange={(value) => updateField('description', value)}
          rows={2}
          placeholder="다양한 영역의 전문 프로그램을 제공합니다"
        />
      </AdminSection>

      {/* 다른 곳에서 관리하는 데이터 */}
      <AdminSection title="관련 설정" description="카테고리 카드와 관련된 다른 설정들은 별도 페이지에서 관리됩니다.">
        <AdminCard>
          <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            다른 페이지에서 관리
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>카테고리별 프로그램 목록 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>카테고리 이름 및 설명 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>카테고리별 아이콘 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
          </ul>
        </AdminCard>
      </AdminSection>
    </div>
  )
}