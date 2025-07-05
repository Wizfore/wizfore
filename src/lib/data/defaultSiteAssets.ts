import { SiteAsset } from '@/types'

export const defaultSiteAssets: SiteAsset[] = [
  // 히어로 슬라이드 배경 이미지
  {
    id: 'hero-slide-1',
    name: '히어로 슬라이드 1 배경',
    category: 'hero',
    url: '/images/hero/slide1.jpg',
    alt: '전문가들이 함께하는 사회서비스센터',
    description: '첫 번째 히어로 슬라이드 배경 이미지',
    order: 1,
    enabled: true
  },
  {
    id: 'hero-slide-2',
    name: '히어로 슬라이드 2 배경',
    category: 'hero',
    url: '/images/hero/slide2.jpg',
    alt: '위즈포레 사회서비스센터 외관',
    description: '두 번째 히어로 슬라이드 배경 이미지',
    order: 2,
    enabled: true
  },
  {
    id: 'hero-slide-3',
    name: '히어로 슬라이드 3 배경',
    category: 'hero',
    url: '/images/hero/slide3.jpg',
    alt: '아이들이 건강하게 성장하는 모습',
    description: '세 번째 히어로 슬라이드 배경 이미지',
    order: 3,
    enabled: true
  },
  
  // 프로그램 관련 이미지
  {
    id: 'program-speech',
    name: '언어치료 아이콘',
    category: 'program',
    url: '/images/programs/speech-therapy.svg',
    alt: '언어치료 프로그램',
    description: '언어치료 프로그램 아이콘',
    order: 10,
    enabled: true
  },
  {
    id: 'program-play',
    name: '놀이치료 아이콘',
    category: 'program',
    url: '/images/programs/play-therapy.svg',
    alt: '놀이치료 프로그램',
    description: '놀이치료 프로그램 아이콘',
    order: 11,
    enabled: true
  },
  {
    id: 'program-art',
    name: '미술치료 아이콘',
    category: 'program',
    url: '/images/programs/art-therapy.svg',
    alt: '미술치료 프로그램',
    description: '미술치료 프로그램 아이콘',
    order: 12,
    enabled: true
  },
  {
    id: 'program-music',
    name: '음악치료 아이콘',
    category: 'program',
    url: '/images/programs/music-therapy.svg',
    alt: '음악치료 프로그램',
    description: '음악치료 프로그램 아이콘',
    order: 13,
    enabled: true
  },
  
  // 센터 소개 이미지
  {
    id: 'about-center',
    name: '센터 소개 이미지',
    category: 'background',
    url: '/images/about/center.jpg',
    alt: '위즈포레 사회서비스센터 내부',
    description: '센터 소개 섹션 배경 이미지',
    order: 20,
    enabled: true
  },
  
  // 문의 섹션 이미지
  {
    id: 'contact-consultation',
    name: '상담 문의 이미지',
    category: 'background',
    url: '/images/contact/consultation.jpg',
    alt: '전문가와의 상담 장면',
    description: '문의 섹션 배경 이미지',
    order: 30,
    enabled: true
  },
  
  // 아이콘들
  {
    id: 'icon-phone',
    name: '전화 아이콘',
    category: 'icon',
    url: '/images/icons/phone.svg',
    alt: '전화 문의',
    description: '전화 문의 아이콘',
    order: 40,
    enabled: true
  },
  {
    id: 'icon-email',
    name: '이메일 아이콘',
    category: 'icon',
    url: '/images/icons/email.svg',
    alt: '이메일 문의',
    description: '이메일 문의 아이콘',
    order: 41,
    enabled: true
  },
  {
    id: 'icon-location',
    name: '위치 아이콘',
    category: 'icon',
    url: '/images/icons/location.svg',
    alt: '센터 위치',
    description: '센터 위치 아이콘',
    order: 42,
    enabled: true
  }
]