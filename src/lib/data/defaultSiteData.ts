import { DefaultSiteData } from '@/types'
import { defaultHomeConfig } from './defaultHomeConfig'

export const defaultSiteData: DefaultSiteData = {
  siteInfo: {
    name: "위즈포레",
    enName: "Wizfore",
    establishedDate: "2016년 1월 1일",
    purpose: "위즈포레는 \"함께 어우러지는 지혜의 숲(WIZ FORE)\"라는 의미를 담고 있으며, 장애인을 포함한 모든 사람들이 어우러져 더불어 살아가는 힘을 키우는데 필요한 사회서비스를 제공하는 전문기관입니다.",
    faviconUrl: "",
    headerLogoUrl: "",
    coreValues: {
      diverse: "다양성을 존중하고 포용하는 마음",
      together: "함께 어우러져 살아가는 공동체",
      restful: "모든 생명이 안전하고 편안한 공간",
      dreaming: "희망과 꿈을 키워가는 터전",
      growing: "지속적인 발전과 성장",
      caring: "진심과 마음이 담긴 서비스",
      healing: "치유와 회복을 지원하는 전문성"
    },
    organization: {
      totalStaff: 24,
      staffComposition: [
        { category: "언어치료사", count: 5 },
        { category: "미술치료사", count: 3 },
        { category: "음악치료사", count: 2 },
        { category: "놀이치료사", count: 4 },
        { category: "감각통합치료사", count: 3 },
        { category: "특수체육지도사", count: 4 },
        { category: "부모상담사", count: 3 }
      ],
      totalClients: 23,
      clientComposition: [
        { category: "시설치료", count: 1 },
        { category: "전담서비스", count: 1 },
        { category: "발달장애인 주간활동/방과후", count: 6 },
        { category: "기타 치료서비스", count: 15 }
      ]
    },
    contact: {
      address: "부산광역시 사상구 모라동 110번길 25 3층, 4층 (모라주공아파트1단지 입구 홈플러스 위 광명한의원 4층)",
      phone: "051-324-0940",
      fax: "051-313-3922",
      email: "wizfore@daum.net",
      website: "wizfore.modoo.at",
      operatingHours: {
        weekday: "09:00 ~ 19:00",
        weekend: "09:00 ~ 18:00"
      },
      businessNumber: "123-45-67890",
      accountInfo: "농협 123-456-789012 위즈포레사회서비스센터",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.848873729402!2d128.98987061177746!3d35.18531905694215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ea9ea90ac5a9%3A0x170fb73b2e0fe64c!2z67aA7IKw6rSR7Jet7IucIOyCrOyDgeq1rCDrqqjrnbzroZwxMTDrsojquLggMjU!5e0!3m2!1sko!2skr!4v1751037173300!5m2!1sko!2skr",
    },
    mainServices: [
      {
        title: "발달중재서비스",
        description: "발달/심리검사, 언어/인지/미술/놀이/감각통합/심리운동/사회성 치료 서비스",
        details: [
          "복지부 발달재활서비스(2022년~) & 교육부 치료지원서비스(2021년~)",
          "복지부 지역사회서비스 아동청소년 심리치유서비스(2016년~)"
        ],
        startYear: "2016",
        order: 1
      },
      {
        title: "부모/가족지원서비스",
        description: "가족이음(학부모코칭)서비스",
        startYear: "2016",
        order: 2
      },
      {
        title: "발달장애인 주간활동 및 발달장애학생 방과후활동서비스",
        description: "발달장애인 평생교육프로그램(일상생활훈련/지역사회적응/문화예술체험 등)",
        startYear: "2020",
        order: 3
      },
      {
        title: "문체부 장애인 스포츠이용권 서비스 제공기관",
        description: "장애인 스포츠 활동 지원 서비스",
        startYear: "2024",
        order: 4
      }
    ]
  },
  
  aboutInfo: {
    director: {
      name: "마종문",
      position: ["감각통합", "심리운동사"],
      education: [
        "아동학/스포츠건강학 학사 졸업",
        "부산대학교 특수교육 석사 졸업",
        "신라대학교 사회복지 박사과정"
      ],
      career: [
        "대한민국해병대 예비역소령",
        "감각통합&심리운동 임상경력 21년",
        "전) 사)한국심리협회 사무국장",
        "전) 메디칼아동청소년발달센터장",
        "전) 꿈땅부산아동인지상담센터장"
      ],
      committees: [
        "전) 울산광역시 보육정책위원",
        "전) 교육부 인성교육 우수기관 중앙심사위원",
        "전) 부산진구드림스타트센터 운영위원",
        "전) 장애전문 공감어린이집 운영위원",
        "전) 사회서비스 품질평가위원(중앙)",
        "현) 재활시설 아이맘심리발달센터 운영위원",
        "현) 한국사회복지상담학회 이사",
        "현) 모라동 주민자치위원"
      ],
      certifications: [
        "발달진단평가전문가",
        "감각재활/심리운동/행동재활사(국가)",
        "인지행동상담전문가",
        "원예치료사1급",
        "사회복지상담 수련감독",
        "발달장애인 공공후견인"
      ],
      imageUrl: "",
      aboutMessage: {
        title: "함께 걷는 성장의 길",
        description: "영유아부터 성인까지 온 가족이 함께하는 종합사회서비스센터로 개인별 특성을 고려한 맞춤형 치료서비스를 제공하고 있습니다.\n\n건강한 발달과 성장의 핵심은 전문가의 경험과 진심입니다. 각 치료영역의 깊은 전문성과 따뜻한 애정을 가진 선생님들이 동행합니다.\n\n이렇게 아이와 가족 모두의 행복한 일상을 함께 만들어갑니다."
      },
      hero: {
        title: "센터장 소개",
        description: "위즈포레를 이끌어가는 센터장을 소개합니다",
        imageUrl: ""
      }
    },
    
    history: {
      hero: {
        title: "센터 발자취",
        description: "위즈포레의 성장과 발전 과정을 시간순으로 소개합니다",
        imageUrl: ""
      },
      milestones: [
        { year: "2016", month: "1", event: "위즈포레사회서비스센터 설립" },
        { year: "2016", month: "2", event: "아동청소년 심리치유서비스 제공기관 등록" },
        { year: "2016", month: "2", event: "학부모코칭서비스 제공기관 등록" },
        { year: "2016", month: "2", event: "아동 동화구연서비스 제공기관 등록" },
        { year: "2020", month: "12", event: "발달장애인 주간활동서비스 제공기관 지정" },
        { year: "2020", month: "12", event: "발달장애학생 방과후활동서비스 제공기관 지정" },
        { year: "2021", month: "7", event: "교육청 특수교육대상자 치료지원 서비스 제공기관 지정" },
        { year: "2021", month: "9", event: "부산정보문화센터(정보산업진흥원) 업무협약" },
        { year: "2021", month: "10", event: "사상구드림스타트센터 업무협약 (아동 심리치료 전문기관)" },
        { year: "2021", month: "10", event: "부산시여성가족개발원 업무협약 (성인지 교육 협력기관)" },
        { year: "2021", month: "11", event: "장애아동 발달재활서비스 제공기관 지정" },
        { year: "2022", month: "2", event: "사상여성인력센터 청년채용 업무협약" },
        { year: "2022", month: "6", event: "부산가톨릭대학교 언어청각치료학과 산학협력" },
        { year: "2022", month: "7", event: "성평등 사례뱅크 공모전 우수상 수상 (부산여성가족개발원)" },
        { year: "2022", month: "11", event: "춘해보건대학교 언어치료학과 산학협력" },
        { year: "2023", month: "3", event: "사상구장애인체육회 업무협약 (생활체육지원사업)" },
        { year: "2023", month: "3", event: "사상구장애인복지관 업무협약" },
        { year: "2023", month: "4", event: "한국사회복지상담학회 산학협력 (신라대 사회복지학과)" },
        { year: "2023", month: "7", event: "경남통일교육지원센터(통일부) 업무협약" },
        { year: "2023", month: "11", event: "신라대학교 특수체육교육학과 산학협력" },
        { year: "2023", month: "11", event: "경남정보대학교 작업치료학과 산학협력" },
        { year: "2023", month: "11", event: "장애인스포츠 및 일반스포츠 이용권 제공기관 선정" },
        { year: "2024", month: "2", event: "건양사이버대학교 심리운동치료학과 산학협력" },
        { year: "2025", month: "5", event: "김천대학교 건강재활서비스학과 산학협력" }
      ]
    },

    advisors: {
      aboutMessage: {
        title: "전문 자문위원단",
        description: "위즈포레 사회서비스센터는 다양한 분야의 전문가들로 구성된 자문위원단을 운영하고 있습니다.\n각 분야의 전문성을 바탕으로 센터의 서비스 질 향상과 운영 개선에 도움을 주고 계십니다."
      },
      hero: {
        title: "자문위원",
        description: "위즈포레의 전문성 향상을 위해 도움을 주시는 분들을 소개합니다",
        imageUrl: ""
      },
      list: [
        {
          name: "윤치연",
          position: ["(사)한국심리협회 교수"],
          education: ["특수교육학 박사"],
          career: [
            "전)국립재활원 임상심리실장",
            "전)춘해보건대학교 언어치료학과 정교수"
          ],
          imageUrl: "",
          order: 1
        },
        {
          name: "송영화",
          position: ["사회복지법인 세림복지재단 원장"],
          education: ["사회복지학 박사"],
          career: [
            "현)사회복지법인 세림복지재단 이사",
            "현)세림어르신의집 원장"
          ],
          imageUrl: "",
          order: 2
        },
        {
          name: "허명진",
          position: ["부산가톨릭대학교 교수"],
          education: ["특수교육학 박사"],
          career: [
            "현)부산가톨릭대학교 언어청각치료학과 정교수"
          ],
          imageUrl: "",
          order: 3
        },
        {
          name: "정원철",
          position: ["신라대학교 교수"],
          education: ["사회복지학 박사"],
          career: [
            "현)신라대학교 사회복지학과 정교수",
            "현)한국사회복지상담학회장"
          ],
          imageUrl: "",
          order: 4
        },
        {
          name: "박소현",
          position: ["한마음약국 약사"],
          education: ["부산대학교 약학과 졸업"],
          career: [
            "현)한마음약국 대표"
          ],
          imageUrl: "",
          order: 5
        },
        {
          name: "배제현",
          position: ["창원대학교 교수"],
          education: ["교육학 박사"],
          career: [
            "전)창신대학교 유아교육학과 정교수",
            "창원시육아종합지원센터 인성교육 강사"
          ],
          imageUrl: "",
          order: 6
        },
        {
          name: "공광석",
          position: ["금정경찰서 경감"],
          education: ["동의대 경찰행정학과 박사 수료"],
          career: [
            "금정경찰서 부곡지구대",
            "중앙경찰학교 교수요원"
          ],
          imageUrl: "",
          order: 7
        },
        {
          name: "박정숙",
          position: ["우석대학교 겸임교수"],
          education: ["특수교육학 박사"],
          career: [
            "한국심리운동연구소 전문강사",
            "심리운동사1급"
          ],
          imageUrl: "",
          order: 8
        }
      ]
    },

    location: {
      hero: {
        title: "오시는길",
        description: "위즈포레 사회서비스센터 위치 및 교통 안내",
        imageUrl: ""
      },
      aboutMessage: {
        title: "위즈포레로 오시는 길을 확인하세요",
        description: ""
      },
      transportation: [
        {
          type: "지하철",
          description: "모라역 하차 후 도보 5분"
        },
        {
          type: "버스",
          description: "모라주공아파트 정류장 하차"
        },
        {
          type: "차",
          description: "센터 입구 도로공용주차장 및 홈플러스 주차장 이용"
        }
      ]
    },

    inquiry: {
      hero: {
        title: "온라인 문의",
        description: "궁금한 사항이나 문의사항을 언제든지 남겨주세요",
        imageUrl: ""
      },
      aboutMessage: {
        title: "문의하기",
        description: "궁금한 사항이나 상담을 원하시는 내용을 자세히 적어주시면, 방문 시일 내에 답변드리겠습니다."
      },
      categories: ["프로그램 문의", "상담 문의", "시설 이용 문의", "일반 문의", "기타"]
    },

    facilities: [
      "언어치료실",
      "인지치료실", 
      "놀이치료실",
      "미술치료실",
      "음악치료실",
      "감각통합치료실",
      "특수체육실",
      "심리운동실",
      "집단치료실",
      "상담실"
    ]
  },

  programs: [
    {
      id: "therapy",
      hero: {
        title: "치료 프로그램",
        description: "개별적인 특성과 필요에 맞춘 전문적인 치료 서비스를 제공합니다.",
        imageUrl: ""
      },
      aboutMessage: {
        title: "개별화된 치료 접근",
        description: "각 아동의 발달 단계와 특성을 고려하여 언어, 인지, 정서, 감각통합 등 다양한 영역의 전문적인 치료 서비스를 제공합니다"
      },
      programs: [
        {
          title: "언어치료",
          target: ["언어발달장애", "조음음운장애", "유창성장애", "학령기 언어학습장애"],
          goal: ["의사소통 능력 향상", "언어 발달 촉진"],
          content: ["구어 표현 훈련", "언어 이해 능력 개발", "발음 교정"],
          types: ["개별치료", "그룹치료"],
          order: 1
        },
        {
          title: "인지치료",
          target: ["인지발달지연", "학습장애", "주의집중력 부족"],
          goal: ["인지기능 강화", "학습능력 개발"],
          content: ["기초인지프로그램", "기초학습프로그램", "학습능력향상프로그램"],
          types: ["개별인지치료", "집단인지치료"],
          order: 2
        },
        {
          title: "놀이치료",
          target: ["정서발달지연", "사회성 부족", "행동문제"],
          goal: ["정서적 안정", "사회성 발달"],
          content: ["자유놀이 활동", "구조화된 놀이", "치료놀이 프로그램"],
          types: ["발달놀이치료", "정서놀이치료", "사회성놀이치료", "모래놀이치료"],
          order: 3
        },
        {
          title: "미술치료",
          target: ["창의성 부족", "정서표현 어려움", "자아개념 문제"],
          goal: ["창의성 개발", "심리적 치유"],
          content: ["그리기 활동", "만들기 활동", "조형 활동"],
          types: ["발달미술치료", "심리미술치료", "원예미술치료", "퍼포먼스미술치료"],
          order: 4
        },
        {
          title: "음악치료",
          target: ["감정표현 어려움", "사회적 상호작용 부족", "스트레스 관리"],
          goal: ["감정 표현 능력 향상", "사회적 상호작용 향상"],
          content: ["악기 연주", "노래 부르기", "음악 감상", "리듬 활동"],
          types: ["발달음악치료", "심리음악치료", "동작치료", "사회성 집단치료"],
          order: 5
        },
        {
          title: "감각통합치료",
          target: ["감각처리장애", "감각통합기능 부족", "일상생활 기능 저하"],
          goal: ["감각 처리 능력 향상", "일상생활 기능 증진"],
          content: ["전정각 발달치료", "고유각 발달치료", "촉각 발달치료"],
          types: ["개별직접치료", "소그룹치료"],
          order: 6
        },
        {
          title: "특수체육(운동재활)",
          target: ["신체기능 저하", "운동발달지연", "사회성 부족"],
          goal: ["신체기능 향상", "사회성 발달"],
          content: ["맞춤형 탬포 트레이닝", "근력운동", "사회성 통합 스포츠"],
          types: ["개별운동치료", "그룹스포츠"],
          order: 7
        },
        {
          title: "심리운동치료",
          target: ["전인적 발달지연", "자아개념 부족", "사회성 발달지연"],
          goal: ["전인적 발달", "자아개념 형성"],
          content: ["물질경험 프로그램", "신체경험 프로그램", "사회경험 프로그램"],
          types: ["개별심리운동", "집단심리운동"],
          order: 8
        }
      ],
      order: 1
    },

    {
      id: "counseling",
      hero: {
        title: "상담 프로그램",
        description: "정확한 진단과 개별화된 상담을 통해 최적의 치료 계획을 제공합니다.",
        imageUrl: ""
      },
      aboutMessage: {
        title: "종합적인 평가와 지원",
        description: "발달검사, 심리검사, 사회성 그룹치료, 부모상담 등을 통해 아동과 가족의 전반적인 발달과 적응을 지원합니다"
      },
      programs: [
        {
          title: "발달/심리검사",
          target: ["발달지연 아동", "심리적 어려움", "학습문제"],
          goal: ["정확한 진단", "개별화된 치료계획 수립"],
          content: ["인지기능 평가", "사회성 평가", "정서행동 평가"],
          types: ["발달검사", "지능검사", "종합심리검사(풀뱃터리)", "부모심리검사"],
          order: 1
        },
        {
          title: "사회성 그룹치료",
          target: ["사회성 부족", "또래관계 어려움", "사회적 기술 부족"],
          goal: ["또래 관계 형성", "사회적 기술 습득"],
          content: ["사회성 & 사회적 기술훈련", "사회경험 심리운동프로그램", "사회정서 원예치료프로그램"],
          types: ["소그룹 활동", "집단 프로그램"],
          order: 2
        },
        {
          title: "부모상담/부모코칭",
          target: ["양육 스트레스", "가족 갈등", "자녀 양육 어려움"],
          goal: ["가족 기능 강화", "양육 역량 향상"],
          content: ["개인상담/부부상담", "자녀양육코칭", "가족문화상담"],
          types: ["개별상담", "그룹상담", "가족치료"],
          order: 3
        }
      ],
      order: 2
    },

    {
      id: "afterschool",
      hero: {
        title: "방과후 프로그램",
        description: "학령기 아동의 발달과 사회성 향상을 위한 집단 프로그램입니다.",
        imageUrl: ""
      },
      aboutMessage: {
        title: "사회성과 학습의 균형",
        description: "토요일 사회성교실과 평일 기초학습교실을 통해 아동의 사회적 기술과 학습능력을 동시에 향상시키는 종합적인 방과후 프로그램입니다"
      },
      programs: [
        {
          title: "토요방과후 (사회성교실)",
          target: ["사회성 개발", "동료관계 향상", "사회적 기술 훈련"],
          goal: ["사회성 발달", "동료와의 상호작용 향상"],
          content: ["사회지각/인지", "의사소통", "사회감성(배려,질서 등)", "사회적기술훈련", "문화예술체험"],
          types: ["집단 활동", "체험 학습"],
          order: 1
        },
        {
          title: "평일방과후 (기초학습교실)",
          target: ["기초학습능력 부족", "진로 탐색 필요", "학습동기 부족"],
          goal: ["기초학습능력 배양", "진로 탐색"],
          content: ["생활/학습 기초인지", "진로적성/직업체험"],
          types: ["개별지도", "그룹학습"],
          order: 2
        }
      ],
      order: 3
    },

    {
      id: "special-sports",
      hero: {
        title: "특수 스포츠 프로그램",
        description: "다양한 스포츠 활동을 통한 신체 기능 향상과 사회성 발달을 도모합니다.",
        imageUrl: ""
      },
      aboutMessage: {
        title: "다양한 스포츠 경험",
        description: "뉴스포츠와 운동재활 프로그램을 통해 신체 활동의 즐거움을 경험하고, 건강한 생활 습관과 사회성을 함께 기를 수 있습니다"
      },
      programs: [
        {
          title: "장애인 뉴스포츠",
          target: ["스포츠 경험 부족", "신체활동 요구", "사회성 향상"],
          goal: ["다양한 스포츠 경험", "신체활동 증진"],
          content: ["플라잉디스크", "츄크볼", "핸들러", "플로어볼", "라켓룬", "접시콘"],
          types: ["개별지도", "집단스포츠"],
          order: 1
        },
        {
          title: "특수체육 운동재활",
          target: ["신체기능 저하", "운동능력 개발", "사회성 향상"],
          goal: ["신체기능 향상", "사회성 발달"],
          content: ["맞춤형 탬포 트레이닝", "근력운동", "사회성 통합 스포츠"],
          types: ["개별훈련", "그룹운동"],
          order: 2
        }
      ],
      order: 4
    },

    {
      id: "adult-day",
      hero: {
        title: "성인 주간활동 프로그램",
        description: "성인 발달장애인의 자립생활과 사회통합을 위한 종합적인 서비스를 제공합니다.",
        imageUrl: ""
      },
      aboutMessage: {
        title: "종합적인 생활 지원",
        description: "일상생활기술, 사회적응, 여가활동, 지역사회 참여, 건강관리 등 6개 영역의 체계적인 프로그램을 통해 성인 발달장애인의 삶의 질 향상을 지원합니다"
      },
      programs: [
        {
          title: "일상생활기술훈련",
          target: ["일상생활 능력 부족", "자립생활 준비", "생활기술 향상"],
          goal: ["독립적인 일상생활 능력 향상"],
          content: ["신변자립생활", "자기관리생활", "청결/위생/안전/이동생활"],
          types: ["개별훈련", "소그룹 활동"],
          order: 1
        },
        {
          title: "사회적응기술훈련",
          target: ["사회적응 어려움", "공동체 참여 부족", "사회적 기술 개발"],
          goal: ["사회구성원으로서의 적응 능력 배양"],
          content: ["사회정서생활", "공동체적응생활", "공감/협동/배려/질서 사회적기술"],
          types: ["집단 활동", "사회체험"],
          order: 2
        },
        {
          title: "쉼(힐링)프로그램",
          target: ["정서적 스트레스", "심리적 피로", "휴식 필요"],
          goal: ["정서적 안정", "스트레스 해소"],
          content: ["숲체험", "숲치유", "원예치료활동", "음악/영화/댄스 문화예술교육"],
          types: ["자연체험", "문화예술 활동"],
          order: 3
        },
        {
          title: "재미(여가)프로그램",
          target: ["여가활동 부족", "취미 개발", "삶의 질 향상"],
          goal: ["여가 활용 능력 향상", "삶의 질 향상"],
          content: ["음악/미술/원예/레크레이션 여가활동", "보드게임/컴퓨터/요리/운동 취미활동"],
          types: ["여가집단", "취미클래스"],
          order: 4
        },
        {
          title: "지역사회활용훈련",
          target: ["지역사회 참여 부족", "사회통합 필요", "지역사회 적응"],
          goal: ["지역사회 통합", "사회참여 확대"],
          content: ["공공/편의시설/문화시설 이용", "바리스타/난타/체육시설 이용"],
          types: ["지역사회 체험", "실습 활동"],
          order: 5
        },
        {
          title: "건강생활관리",
          target: ["신체건강 관리", "정신건강 관리", "건강한 생활습관"],
          goal: ["신체적 건강 증진", "정신적 건강 증진"],
          content: ["맞춤형 피트니스 신체운동활동", "뇌파프로그램 정신건강활동"],
          types: ["개별 건강관리", "집단 건강프로그램"],
          order: 6
        }
      ],
      order: 5
    }
  ],

  team: [
    {
      id: "therapists",
      hero: {
        title: "치료·상담사",
        description: "전문적이고 따뜻한 마음으로 함께하는 치료 전문가들을 소개합니다",
        imageUrl: ""
      },
      aboutMessage: {
        title: "전문 치료진 소개",
        description: "위즈포레 전문 자격을 갖춘 여러 명의 치료·상담사가 개인별 특성에 맞는 맞춤형 치료 서비스를 제공하고 있습니다.\n각 분야의 전문성을 바탕으로 체계적이고 효과적인 치료를 통해 내담자의 발달과 성장을 지원합니다."
      },
      features: [
        {
          id: "national-certification",
          title: "국가자격 보유",
          description: "모든 치료사가 해당 분야의 국가공인 자격증을 보유하여 전문성을 보장합니다",
          iconName: "Award",
          order: 1
        },
        {
          id: "continuous-education",
          title: "지속적 교육",
          description: "정기적인 교육과 연수를 통해 최신 치료 기법과 이론을 습득합니다",
          iconName: "GraduationCap",
          order: 2
        },
        {
          id: "individualized-approach",
          title: "개별화 접근",
          description: "각 내담자의 특성과 필요에 맞춘 개별화된 치료 계획을 수립합니다",
          iconName: "Target",
          order: 3
        },
        {
          id: "teamwork-collaboration",
          title: "팀워크 협력",
          description: "다학제적 팀 접근을 통해 종합적이고 효과적인 치료를 제공합니다",
          iconName: "Users",
          order: 4
        }
      ],
      members: [
        {
          name: "마*문",
          specialization: ["감각통합", "심리운동"],
          education: ["특수교육 석사", "사회복지 박사과정"],
          certifications: ["감각통합/심리운동/행동재활(국가)"],
          order: 1
        },
        {
          name: "서*화",
          specialization: ["놀이치료", "미술치료"],
          education: ["특수재활/미술치료학과 졸업"],
          certifications: ["놀이재활/미술재활사(국가)"],
          order: 2
        },
        {
          name: "심*연",
          specialization: ["언어치료", "놀이치료"],
          education: ["언어치료/놀이치료학과 졸업", "언어치료 석사과정"],
          certifications: ["언어재활(1급)/놀이재활사(국가)"],
          order: 3
        },
        {
          name: "신*정",
          specialization: ["언어치료"],
          education: ["언어치료 학사"],
          certifications: ["언어재활사(국가)"],
          order: 4
        },
        {
          name: "문*희",
          specialization: ["미술치료", "부모상담"],
          education: ["상담심리 석사", "상담심리 박사수료"],
          certifications: ["미술재활/심리상담전문가"],
          order: 5
        },
        {
          name: "한*영",
          specialization: ["미술치료"],
          education: ["유아특수언어치료학과 졸업"],
          certifications: ["미술재활사/유아특수교사"],
          order: 6
        },
        {
          name: "정*정",
          specialization: ["감각통합", "작업치료"],
          education: ["작업치료 학사", "작업치료 석사과정"],
          certifications: ["감각재활사/작업치료사"],
          order: 7
        },
        {
          name: "하*솔",
          specialization: ["감각통합", "작업치료"],
          education: ["작업치료 학사", "작업치료 석사"],
          certifications: ["감각재활사/작업치료사"],
          order: 8
        },
        {
          name: "이*빈",
          specialization: ["음악치료"],
          education: ["음악치료 석사 졸업"],
          certifications: ["음악재활사(국가)"],
          order: 9
        },
        {
          name: "박*혜",
          specialization: ["미술치료"],
          education: ["미술치료 석사 졸업"],
          certifications: ["미술재활사/청소년상담사(국가)"],
          order: 10
        },
        {
          name: "강*진",
          specialization: ["심리검사", "임상심리"],
          education: ["심리학 석사", "상담학 박사과정"],
          certifications: ["임상심리사/인지치료사"],
          order: 11
        },
        {
          name: "박*호",
          specialization: ["특수체육"],
          education: ["특수체육교육학과 졸업", "심리운동학과"],
          certifications: ["특수체육교사/감각통합"],
          order: 12
        },
        {
          name: "주*희",
          specialization: ["특수체육"],
          education: ["운동처방학과 졸업"],
          certifications: ["장애인스포츠지도사/감각통합"],
          order: 13
        },
        {
          name: "이*은",
          specialization: ["언어치료"],
          education: ["언어치료학과 졸업"],
          certifications: ["언어재활사(국가)/미술치료사"],
          order: 14
        },
        {
          name: "박*현",
          specialization: ["언어치료", "미술치료"],
          education: ["언어치료학과 졸업"],
          certifications: ["언어재활사(국가)/미술치료사"],
          order: 15
        },
        {
          name: "이*미",
          specialization: ["음악치료"],
          education: ["음악치료 석사 졸업"],
          certifications: ["음악재활사(국가)"],
          order: 16
        },
        {
          name: "김*숙",
          specialization: ["원예치료"],
          education: ["상담심리 석사 졸업"],
          certifications: ["재활심리사(국가)"],
          order: 17
        },
        {
          name: "정*미",
          specialization: ["심리운동"],
          education: ["교육학과 졸업"],
          certifications: ["심리운동사"],
          order: 18
        },
        {
          name: "김*주",
          specialization: ["특수체육"],
          education: ["특수체육교육학과 졸업"],
          certifications: ["특수체육교사/감각통합"],
          order: 19
        },
        {
          name: "김*림",
          specialization: ["특수체육"],
          education: ["특수체육학과 졸업"],
          certifications: ["스포츠지도사/감각통합", "태권도 사범(4단)"],
          order: 20
        },
        {
          name: "지*채",
          specialization: ["언어치료"],
          education: ["언어치료학과 졸업"],
          certifications: ["언어재활사(국가)"],
          order: 21
        },
        {
          name: "엄*웅",
          specialization: ["감각통합", "작업치료"],
          education: ["작업치료학과 졸업"],
          certifications: ["감각재활사(국가)/작업치료사"],
          order: 22
        },
        {
          name: "이*훈",
          specialization: ["놀이체육"],
          education: ["사회복지학과 졸업"],
          certifications: ["사회복지사(국가)", "놀이체육지도사"],
          order: 23
        },
        {
          name: "남*주",
          specialization: ["감각통합", "작업치료"],
          education: ["작업치료 학사"],
          certifications: ["감각재활사(국가)/작업치료사"],
          order: 24
        },
        {
          name: "안*정",
          specialization: ["특수체육"],
          education: ["특수체육학과 졸업"],
          certifications: ["유아체육/감각통합", "전)우슈 청소년 국가대표"],
          order: 25
        },
        {
          name: "강*성",
          specialization: ["특수체육"],
          education: ["특수체육학과 졸업"],
          certifications: ["특수체육/감각통합"],
          order: 26
        },
        {
          name: "김*은",
          specialization: ["음악치료"],
          education: ["음악치료학 석사 졸업"],
          certifications: ["음악치료/상담심리"],
          order: 27
        }
      ],
      order: 1
    },
    {
      id: "teachers",
      hero: {
        title: "주간·방과후 교사",
        description: "성인 주간활동과 방과후 프로그램을 전담하는 전문 교사진을 소개합니다",
        imageUrl: ""
      },
      aboutMessage: {
        title: "전문 교육진 소개",
        description: "위즈포레는 여러 명의 전문 교사진이 성인 발달장애인 주간활동 프로그램과 방과후 프로그램을 운영하고 있습니다.\n사회복지, 특수교육, 간호 등 다양한 전문 분야의 교사들이 개별 맞춤형 교육과 돌봄 서비스를 제공합니다."
      },
      features: [
        {
          id: "social-welfare-expertise",
          title: "사회복지 전문성",
          description: "사회복지사 자격을 바탕으로 한 전문적인 사례관리와 서비스 제공",
          iconName: "Heart",
          order: 1
        },
        {
          id: "individualized-education",
          title: "개별화 교육",
          description: "각 이용자의 발달 수준과 특성에 맞춘 개별화된 교육 프로그램 운영",
          iconName: "Users",
          order: 2
        },
        {
          id: "safety-management",
          title: "안전 관리",
          description: "간호교사의 전문적인 건강관리와 안전한 프로그램 환경 조성",
          iconName: "Shield",
          order: 3
        },
        {
          id: "continuous-development",
          title: "지속적 발전",
          description: "정기적인 교육과 연수를 통한 전문성 향상과 서비스 질 개선",
          iconName: "GraduationCap",
          order: 4
        }
      ],
      members: [
        {
          name: "마*문",
          specialization: ["시설장"],
          education: ["특수교육 석사졸업", "사회복지 박사과정"],
          certifications: ["감각재활", "심리운동", "행동재활사(국가)"],
          order: 1
        },
        {
          name: "서*화",
          specialization: ["전담인력", "실장"],
          education: ["특수재활/미술치료학사 졸업"],
          certifications: ["놀이재활/미술재활사/사회복지사"],
          order: 2
        },
        {
          name: "조*은",
          specialization: ["사회복지사"],
          education: ["사회복지학사 졸업"],
          certifications: ["사회복지사"],
          order: 3
        },
        {
          name: "유*은",
          specialization: ["사회복지사", "팀장"],
          education: ["사회복지학과 졸업"],
          certifications: ["사회복지사/바리스타"],
          order: 4
        },
        {
          name: "안*혜",
          specialization: ["간호교사"],
          education: ["의무행정학과 졸업"],
          certifications: ["간호조무사/사회복지사(국가)", "놀이심리상담사"],
          order: 5
        },
        {
          name: "안*현",
          specialization: ["사회복지사"],
          education: ["사회복지학과 졸업"],
          certifications: ["사회복지사"],
          order: 6
        },
        {
          name: "강*영",
          specialization: ["인지학습교사"],
          education: ["특수교육학과 졸업", "사회복지학 석사 졸업"],
          certifications: ["인지학습치료사"],
          order: 7
        }
      ],
      order: 2
    }
  ],

  community: {
    news: {
      categories: [
        { korean: "파트너쉽", english: "partnership" },
        { korean: "소식", english: "news" },
        { korean: "행사", english: "events" },
        { korean: "수상", english: "awards" },
        { korean: "공지사항", english: "notices" }
      ],
      hero: {
        title: "공지사항",
        description: "위즈포레의 다양한 활동과 성과를 확인해보세요",
        imageUrl: ""
      },
      aboutMessage: {
        title: "전체 소식",
        description: "위즈포레 사회서비스센터의 다양한 협력 활동, 수상 내역, 행사 참여 등 주요 소식들을 시간순으로 확인하실 수 있습니다."
      },
      articles: {
        "partnership": [
          {
            id: 1,
            title: "부산정보문화센터 업무협약",
            content: "부산시 유관기관 부산정보문화센터와 정보화 역기능지원사업 협력합니다~",
            date: "2021-09-07"
          },
          {
            id: 2,
            title: "부산여성가족개발원 협약",
            content: "부산시 유관기관 부산여성가족개발원 양성평등센터와 성인지,성평등교육 협력합니다~",
            date: "2021-10-28"
          },
          {
            id: 3,
            title: "사)한국원예치료복지협회 협약",
            content: "원예치료사 양성기관 사)한국원예치료복지협회 부산지회와 원예치료프로그램 협력합니다~",
            date: "2021-11-04"
          },
          {
            id: 4,
            title: "사상여성인력센터 업무협약",
            content: "부산시 온택트지원사업(청년채용) 참여기관으로 협약되었습니다(2022.2.18)",
            date: "2022-02-18"
          },
          {
            id: 5,
            title: "부산가톨릭대학교 언어청각치료학과 협약",
            content: "부산가톨릭대학교 언어청각치료학과(허명진 교수님)와 업무협약(6.17) 하였습니다~",
            date: "2022-06-17"
          },
          {
            id: 6,
            title: "햇살나무작은도서관 업무협약",
            content: "사)부산여성회에서 운영하는 모라동 햇살나무작은도서관과 업무협약했어요~",
            date: "2022-08-01"
          },
          {
            id: 7,
            title: "춘해보건대학교 언어치료학과 산학협력",
            content: "춘해보건대학교 언어치료학과 산학협력",
            date: "2022-11-29"
          },
          {
            id: 8,
            title: "한국사회복지상담학회 업무협약",
            content: "신라대학교 사회복지학과에 소재하는 한국사회복지상담학회와 업무협약되었어요~",
            date: "2023-04-27"
          },
          {
            id: 9,
            title: "숲체험 주)우리들 업무협약",
            content: "숲체험- 주)우리들 산림교육전문기관과 업무협약했어요~",
            date: "2023-05-01"
          },
          {
            id: 10,
            title: "사)부산생명의숲 업무협약",
            content: "숲체험 전문기관인 사)부산생명의숲과 숲체험프로그램 운영합니다~",
            date: "2023-05-17"
          },
          {
            id: 11,
            title: "미더덕협동조합 업무협약",
            content: "마을기업 미더덕협동조합, 가정식 영양식단 전문업체와 중식급식 운영합니다~",
            date: "2023-06-21"
          },
          {
            id: 12,
            title: "경남통일교육센터 협약",
            content: "오늘 통일부 산하 경남통일교육센터와 업무협약통해서 북한 생활문화들을 체험해보았어요",
            date: "2023-07-14"
          },
          {
            id: 13,
            title: "신라대 특수체육학과 협약",
            content: "신라대학교 특수체육학과와 산학협력이 체결되었어요(23.11.21)",
            date: "2023-11-21"
          },
          {
            id: 14,
            title: "경남정보대 작업치료과 협약",
            content: "경남정보대 작업치료과와 산학협력 체결(11.25)",
            date: "2023-11-25"
          },
          {
            id: 15,
            title: "춘해보건대 작업치료과 협약",
            content: "춘해보건대 작업치료과 산학협력 체결 및 예비졸업생 재능기부 봉사활동(11.25)",
            date: "2023-11-25"
          },
          {
            id: 16,
            title: "건양사이버대학교 심리운동치료학과 산학협력",
            content: "건양사이버대학교 심리운동치료학과 산학협력",
            date: "2024-02-07"
          },
          {
            id: 17,
            title: "공립 동원로얄듀어린이집 협약",
            content: "공립 동원로얄듀크어린이집 업무협약(2024.04.15) 영유아 발달진단평가 협력",
            date: "2024-04-15"
          },
          {
            id: 18,
            title: "부산여성폭력방지지원센터 협약",
            content: "부산광역시여성폭력방지종합지원센터 업무협약(2024.04.25) 폭력예방교육 추진",
            date: "2024-04-25"
          },
          {
            id: 19,
            title: "공립 덕포중흥어린이집 협약",
            content: "공립 덕포중흥어린이집 업무협약(2024.04.26) 영유아 발달진단평가 협력",
            date: "2024-04-26"
          },
          {
            id: 20,
            title: "부산과학기술대학교 협약",
            content: "부산과학기술대학교 사회복지상담학과 가족회사 업무협약 체결(2024.5.27)",
            date: "2024-05-27"
          },
          {
            id: 21,
            title: "사상구가족센터 협약",
            content: "사상구가족센터 업무협약(2024.06.10) 가족상담 지원사업 협력",
            date: "2024-06-10"
          },
          {
            id: 22,
            title: "주)키드위즈 협약",
            content: "주)키드위즈 업무협약(2024.06.10) 영유아 발달진단평가시스템 현장 적용",
            date: "2024-06-10"
          },
          {
            id: 23,
            title: "김천대 재활서비스학과 협약",
            content: "김천대학교 재활서비스학과 산학협력, 심리운동재활사 현장실습기관 협력",
            date: "2025-05-28"
          }
        ],
        "news": [
          {
            id: 1,
            title: "모라1동 주민자치위원 위촉",
            content: "2021.11.26일에 모라1동 주민센터에서 자치위원 위촉식이 있었습니다.",
            date: "2021-11-26"
          },
          {
            id: 2,
            title: "2022년 발달재활서비스 단가표 안내",
            content: "위와 같이 본 기관의 2022년 발달재활서비스 단가표를 안내드립니다.",
            date: "2022-01-01"
          },
          {
            id: 3,
            title: "사회서비스 전자바우처 클린센터 안내",
            content: "사회서비스 전자바우처 클린센터 운영에 대해 안내드리오니 서비스 이에 참고바랍니다~",
            date: "2022-03-01"
          },
          {
            id: 4,
            title: "부산시 성평등 기사자료의 위즈포레",
            content: "여성신문(2022.5.18, 이세아 기자)에 위즈포레사회서비스센터도 소개되었어요~",
            date: "2022-05-18"
          },
          {
            id: 5,
            title: "한국심리협회 윤치연교수님 자문위원위촉",
            content: "발달진단평가 전문교육기관 사)한국심리협회 윤치연교수님께서 자문위원 수락해주셨어요~",
            date: "2022-06-20"
          },
          {
            id: 6,
            title: "2023 발달재활서비스 안내",
            content: "위와 같이 본 기관의 2023년 발달재활서비스 단가표를 안내드립니다.",
            date: "2023-01-01"
          },
          {
            id: 7,
            title: "보건복지부 품질평가위원 위촉",
            content: "2023년 6월초 보건복지부 품질평가위원으로 위촉되어서 전국 현장평가에 참여합니다",
            date: "2023-06-01"
          },
          {
            id: 8,
            title: "한마음약국 자문위원 위촉",
            content: "한마음약국(김소현 약사) 주간,방과후 위생교육자문위원 위촉되었어요(23.7.7)",
            date: "2023-07-07"
          },
          {
            id: 9,
            title: "배제현교수님 자문위원위촉",
            content: "배제현교수님(창신대 유아교육과)께서 부모상담 자문위원 위촉되었어요(23.10.14)",
            date: "2023-10-14"
          },
          {
            id: 10,
            title: "장애인스포츠 및 일반스포츠 이용권 제공기관 선정",
            content: "장애인스포츠 및 일반스포츠 이용권 제공기관 선정",
            date: "2023-11-28"
          }
        ],
        "events": [
          {
            id: 1,
            title: "성평등 공동포럼 사례발표",
            content: "협력기관인 부산시여성가족개발원 주최 성평등 공동포럼(11.19)에 참여했어요~",
            date: "2021-11-19"
          },
          {
            id: 2,
            title: "부산솔빛학교 학부모설명회",
            content: "사상구 소재한 특수학교인 부산솔빛학교 학부모설명회(12.14)에 다녀왔어요~",
            date: "2021-12-14"
          },
          {
            id: 3,
            title: "부산과기대 사회복지상담과 탐방",
            content: "부산과학기술대학교 사회복지상담과(학생 50명, 교수 4명) 사회서비스 현장 탐방",
            date: "2024-06-04"
          }
        ],
        "awards": [
          {
            id: 1,
            title: "성인지 사례 공모전 우수상 수상",
            content: "부산여성가족개발원 성인지 사례 공모전에서 위즈포레가 우수상을 수상했어요~",
            date: "2022-07-19"
          },
          {
            id: 2,
            title: "사상구청장 표창장 수상",
            content: "주민자치활동 및 장애인 사회통합 기여로 사상구청장 표창장 수상(23.12.30)",
            date: "2023-12-30"
          }
        ],
        "notices": [
          {
            id: 1,
            title: "공지사항 테스트",
            content: "고양시 발달 및 장애인지원센터에서 바자회 행사 자원 집단상담 프로그램을 운영합니다~",
            date: "2023-09-21"
          }
          
        ]
      }
    },
    sns: {
      hero: {
        title: "SNS",
        description: "위즈포레의 생생한 활동 모습을 영상으로 만나보세요",
        imageUrl: ""
      },
      aboutMessage: {
        title: "위즈포레 YouTube",
        description: "센터의 생생한 활동 모습을 만나보세요"
      },
      youtube: {
        link: "https://www.youtube.com/embed/XX7Z-iCsMfU",
        message: {
          title: "위즈포레 사회서비스센터 소개",
          description: "위즈포레에서 제공하는 다양한 치료 프로그램과 서비스를 소개하는 영상입니다. 센터의 시설과 전문가들, 그리고 이용자들의 모습을 통해 위즈포레가 추구하는 가치를 확인해보세요."
        }
      }
    }
  },

  homeConfig: defaultHomeConfig
}