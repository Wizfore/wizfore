import type { TabComponentProps } from './HomeManagement'

export function ProgramGridTab({ data, setData }: TabComponentProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">프로그램 그리드 섹션</h3>
        <p className="text-gray-600 mb-4">12개 세부 프로그램 목록 영역의 설정을 관리합니다.</p>
      </div>

      {/* 실제 편집 폼 */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-3">프로그램 그리드 섹션 설정</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">섹션 활성화</label>
            <input 
              type="checkbox"
              checked={data?.sections?.programGrid?.enabled || false}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  programGrid: {
                    title: prev!.sections?.programGrid?.title || '',
                    description: prev!.sections?.programGrid?.description || '',
                    enabled: e.target.checked,
                    iconMappings: prev!.sections?.programGrid?.iconMappings || []
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
              value={data?.sections?.programGrid?.title || ''}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  programGrid: {
                    title: e.target.value,
                    description: prev!.sections?.programGrid?.description || '',
                    enabled: prev!.sections?.programGrid?.enabled || false,
                    iconMappings: prev!.sections?.programGrid?.iconMappings || []
                  }
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="세부 전문 프로그램"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">섹션 설명</label>
            <textarea
              value={data?.sections?.programGrid?.description || ''}
              onChange={(e) => setData(prev => ({
                ...prev!,
                sections: {
                  ...prev!.sections,
                  programGrid: {
                    title: prev!.sections?.programGrid?.title || '',
                    description: e.target.value,
                    enabled: prev!.sections?.programGrid?.enabled || false,
                    iconMappings: prev!.sections?.programGrid?.iconMappings || []
                  }
                }
              }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">아이콘 매핑</label>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p>프로그램별 아이콘 매핑 설정 기능은 추후 구현 예정입니다.</p>
              <p className="mt-1">현재는 자동 매핑 시스템이 작동 중입니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 다른 곳에서 관리하는 데이터 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ 다른 페이지에서 관리</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 프로그램 이름, 목표, 내용 → <strong>프로그램 관리</strong> 페이지</li>
          <li>• 프로그램 카테고리 분류 → <strong>프로그램 관리</strong> 페이지</li>
          <li>• 프로그램 순서 → <strong>프로그램 관리</strong> 페이지</li>
        </ul>
      </div>
    </div>
  )
}