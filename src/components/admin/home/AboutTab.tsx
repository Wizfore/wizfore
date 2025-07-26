import type { TabComponentProps } from './HomeManagement'

export function AboutTab({ data, setData }: TabComponentProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">센터 소개 섹션</h3>
        <p className="text-gray-600 mb-4">홈페이지의 센터장 인사말 및 센터 소개 영역을 확인할 수 있습니다.</p>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-amber-800 mb-1">데이터 수정 안내</h4>
            <p className="text-sm text-amber-700">
              AboutSection에 표시되는 센터장 인사말 및 관련 정보를 수정하려면 
              <strong className="mx-1">센터소개관리 페이지의 센터장소개탭</strong>에서 
              <strong className="mx-1">소개메시지</strong> 섹션을 편집하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 다른 곳에서 관리하는 데이터 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ 다른 페이지에서 관리</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 센터장 인사말 제목 및 내용 → <strong>센터소개관리 → 센터장소개탭 → 소개메시지</strong></li>
          <li>• 하이라이트 키워드 설정 → <strong>센터소개관리 → 센터장소개탭 → 소개메시지</strong></li>
          <li>• 센터장명 및 프로필 정보 → <strong>센터소개관리 → 센터장소개탭</strong></li>
        </ul>
      </div>
    </div>
  )
}