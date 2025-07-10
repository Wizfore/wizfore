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
  programs: {
    title: "세부 전문 프로그램",
    description: "개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다",
    enabled: true
  }
}