export default function AboutPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">센터 소개 관리</h1>
        <p className="text-gray-600">센터에 대한 정보와 소개 콘텐츠를 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 센터장 소개 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">센터장 소개</h3>
          <p className="text-gray-600 mb-4">센터장의 학력, 경력, 자격증 정보를 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 학력 정보<br/>
            • 경력 및 위원활동<br/>
            • 자격증 및 전문성
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 센터 발자취 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">센터 발자취</h3>
          <p className="text-gray-600 mb-4">2016년부터 현재까지의 주요 연혁을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 기관 설립 및 등록<br/>
            • 업무협약 현황<br/>
            • 산학협력 협약
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 전문 자문위원 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전문 자문위원</h3>
          <p className="text-gray-600 mb-4">7명의 전문 자문위원 정보를 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 자문위원 프로필<br/>
            • 전문 분야<br/>
            • 경력 사항
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 시설 둘러보기 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">시설 둘러보기</h3>
          <p className="text-gray-600 mb-4">센터 시설 사진과 설명을 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 시설 사진 갤러리<br/>
            • 시설 설명<br/>
            • 가상 투어
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>

        {/* 오시는 길 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오시는 길</h3>
          <p className="text-gray-600 mb-4">위치, 교통편, 주차 정보를 관리합니다.</p>
          <div className="text-sm text-gray-500 mb-4">
            • 주소 및 연락처<br/>
            • 운영시간<br/>
            • 주차 안내
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            관리하기
          </button>
        </div>
      </div>
    </div>
  )
}