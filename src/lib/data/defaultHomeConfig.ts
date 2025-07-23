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
      enabled: true
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