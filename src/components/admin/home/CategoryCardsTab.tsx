import type { TabComponentProps } from './HomeManagement'

export function CategoryCardsTab({ data, setData }: TabComponentProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">카테고리 카드 섹션</h3>
        <p className="text-gray-600 mb-4">4대 프로그램 카테고리 영역의 설정을 관리합니다.</p>
      </div>

      {/* 실제 편집 폼 */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-3">카테고리 카드 섹션 설정</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">섹션 활성화</label>
            <input 
              type="checkbox"
              checked={data?.sections?.categoryCards?.enabled || false}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  categoryCards: {
                    title: prev!.sections?.categoryCards?.title || '',
                    description: prev!.sections?.categoryCards?.description || '',
                    enabled: e.target.checked
                  }
                }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">섹션 제목</label>
            <input
              type="text"
              value={data?.sections?.categoryCards?.title || ''}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  categoryCards: {
                    title: e.target.value,
                    description: prev!.sections?.categoryCards?.description || '',
                    enabled: prev!.sections?.categoryCards?.enabled || false
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="위즈포레 프로그램"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">섹션 설명</label>
            <textarea
              value={data?.sections?.categoryCards?.description || ''}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  categoryCards: {
                    title: prev!.sections?.categoryCards?.title || '',
                    description: e.target.value,
                    enabled: prev!.sections?.categoryCards?.enabled || false
                  }
                }
              }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="다양한 영역의 전문 프로그램을 제공합니다"
            />
          </div>
        </div>
      </div>

      {/* 다른 곳에서 관리하는 데이터 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ 다른 페이지에서 관리</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 카테고리별 프로그램 목록 → <strong>프로그램 관리</strong> 페이지</li>
          <li>• 카테고리 이름 및 설명 → <strong>프로그램 관리</strong> 페이지</li>
          <li>• 카테고리별 아이콘 → <strong>프로그램 관리</strong> 페이지</li>
        </ul>
      </div>
    </div>
  )
}