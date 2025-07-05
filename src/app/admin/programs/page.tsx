export default function ProgramsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">프로그램 관리</h1>
        <p className="text-gray-600">다양한 치료 및 교육 프로그램을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 치료 프로그램 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">치료 프로그램</h3>
          <p className="text-gray-600 mb-4">8개 치료 영역의 프로그램을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 언어치료, 인지치료<br/>
            • 놀이치료, 미술치료<br/>
            • 음악치료, 감각통합치료<br/>
            • 특수체육, 심리운동치료
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 상담 서비스 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">상담 서비스</h3>
          <p className="text-gray-600 mb-4">진단 평가와 상담 서비스를 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 발달/심리검사<br/>
            • 사회성 그룹치료<br/>
            • 부모상담/부모코칭
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 방과후 프로그램 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">방과후 프로그램</h3>
          <p className="text-gray-600 mb-4">토요/평일 방과후 프로그램을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 토요방과후(사회성교실)<br/>
            • 평일방과후(기초학습교실)<br/>
            • 프로그램 일정 관리
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 특수 스포츠 프로그램 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">특수 스포츠 프로그램</h3>
          <p className="text-gray-600 mb-4">장애인 뉴스포츠와 운동재활을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 장애인 뉴스포츠<br/>
            • 특수체육 운동재활<br/>
            • 스포츠 장비 관리
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 성인 주간활동 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">성인 주간활동</h3>
          <p className="text-gray-600 mb-4">6개 영역의 성인 주간활동을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 일상생활기술훈련<br/>
            • 사회적응기술훈련<br/>
            • 쉼(힐링), 재미(여가), 지역사회활용, 건강생활관리
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 프로그램 통계 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">프로그램 통계</h3>
          <p className="text-gray-600 mb-4">프로그램 이용 현황과 통계를 확인합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 이용자 현황<br/>
            • 프로그램별 통계<br/>
            • 월간/연간 리포트
          </div>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            통계 보기
          </button>
        </div>
      </div>
    </div>
  )
}