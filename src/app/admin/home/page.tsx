export default function HomePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">홈페이지 관리</h1>
        <p className="text-gray-600">메인 페이지의 콘텐츠를 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 히어로 섹션 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">히어로 섹션</h3>
          <p className="text-gray-600 mb-4">메인 배너와 핵심 메시지를 관리합니다.</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 프로그램 미리보기 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">프로그램 미리보기</h3>
          <p className="text-gray-600 mb-4">4대 주요 치료 프로그램 소개를 관리합니다.</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 전문가 하이라이트 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전문가 하이라이트</h3>
          <p className="text-gray-600 mb-4">주요 치료사 소개를 관리합니다.</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 센터 소식 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">센터 소식</h3>
          <p className="text-gray-600 mb-4">최신 뉴스 및 공지사항을 관리합니다.</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 문의 버튼 설정 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">문의 버튼 설정</h3>
          <p className="text-gray-600 mb-4">상담 예약 및 문의 연결 설정을 관리합니다.</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>
      </div>
    </div>
  )
}