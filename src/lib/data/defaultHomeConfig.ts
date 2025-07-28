import { HomeConfig } from '@/types'

export const defaultHomeConfig: HomeConfig = {
  hero: {
    enabled: true,
    autoPlay: true,
    slides: [
      {
        id: 1,
        title: '공인된 사회서비스센터',
        description: '오랜 임상 경험, 엄격한 수련과정을 거친 각 분야의 전문가가 함께 합니다.',
        categoryText: '전문가 소개 보기',
        categoryLink: '/team',
        backgroundImage: '',
        order: 1,
        enabled: true
      },
      {
        id: 2,
        title: '위즈포레 사회서비스센터',
        description: '체계적이고 전문적인 아동 발달 지원 서비스를 제공합니다.',
        categoryText: '센터 소개 보기',
        categoryLink: '/about',
        backgroundImage: '',
        order: 2,
        enabled: true
      },
      {
        id: 3,
        title: '모든 아이가 건강하게 성장하는 세상을 만듭니다',
        description: '위즈포레와 함께 아이들의 밝은 미래를 만들어갑니다.',
        categoryText: '프로그램 보기',
        categoryLink: '/programs',
        backgroundImage: '',
        order: 3,
        enabled: true
      }
    ]
  },
  sections: {
    categoryCards: {
      title: "위즈포레 프로그램",
      description: "다양한 영역의 전문 프로그램을 제공합니다",
      enabled: true,
      defaultImageUrl: "/images/programs/defaultImage.jpg"
    },
    programGrid: {
      title: "세부 전문 프로그램",
      description: "개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다",
      enabled: true,
      iconMappings: [
        {
          id: "brain",
          categoryKeywords: ["인지", "학습", "인지학습", "학습능력"],
          iconName: "Brain",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 1
        },
        {
          id: "heart",
          categoryKeywords: ["정서", "심리", "정서심리", "감정"],
          iconName: "Heart",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 2
        },
        {
          id: "users",
          categoryKeywords: ["사회성", "사회", "관계", "소통"],
          iconName: "Users",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 3
        },
        {
          id: "target",
          categoryKeywords: ["목표", "달성", "치료", "개입"],
          iconName: "Target",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 4
        },
        {
          id: "lightbulb",
          categoryKeywords: ["창의", "창의성", "아이디어", "사고"],
          iconName: "Lightbulb",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 5
        },
        {
          id: "star",
          categoryKeywords: ["특성화", "특별", "전문", "특수"],
          iconName: "Star",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 6
        },
        {
          id: "message",
          categoryKeywords: ["상담", "컨설팅", "대화", "면담"],
          iconName: "MessageCircle",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 7
        },
        {
          id: "activity",
          categoryKeywords: ["활동", "운동", "신체", "움직임"],
          iconName: "Activity",
          bgColor: "bg-wizfore-light-beige",
          hoverColor: "bg-wizfore-light-beige",
          order: 8
        }
      ]
    },
    aboutSection: {
      enabled: true,
      showButton: true
    },
    mainServices: {
      aboutMessage: {
        title: "\"주요 사업 분야\"",
        description: "위즈포레는 다양한 전문 사업을 통해 종합적인 치료 서비스를 제공합니다.\n\n각 사업 분야별로 전문 자격을 갖춘 치료사들이 개별 맞춤형 서비스를 제공하고 있습니다.\n\n자세한 상담 및 서비스 이용 문의는 센터로 연락 주시기 바랍니다. 지속적으로 사업 영역을 확대하고 있습니다.",
        highlightKeywords: [
          "다양한",
          "전문",
          "종합",
          "치료",
          "서비스",
          "생애주기별"
        ]
      },
      services: [
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
          details: [],
          startYear: "2016",
          order: 2
        },
        {
          title: "발달장애인 주간활동 및 발달장애학생 방과후활동서비스",
          description: "발달장애인 평생교육프로그램(일상생활훈련/지역사회적응/문화예술체험 등)",
          details: [],
          startYear: "2020",
          order: 3
        },
        {
          title: "문체부 장애인 스포츠이용권 서비스 제공기관",
          description: "장애인 스포츠 활동 지원 서비스",
          details: [],
          startYear: "2024",
          order: 4
        }
      ],
      enabled: true,
      showSubPrograms: true
    }
  },
  theme: {
    primaryColor: "#FF7A59",
    accentColor: "#D4A574", 
    gradientColors: [
      {
        id: "primary-gradient",
        name: "기본 그라데이션",
        fromColor: "from-wizfore-light-beige",
        toColor: "to-wizfore-soft-pink",
        category: "section"
      },
      {
        id: "hero-gradient",
        name: "히어로 그라데이션",
        fromColor: "from-transparent",
        toColor: "to-wizfore-light-beige",
        category: "section"
      }
    ]
  }
}