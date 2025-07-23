import { ContactInfo, MainServices } from './common'
import { DirectorInfo, HistoryInfo, AdvisorsInfo, LocationInfo, InquiryInfo } from './about'
import { ProgramCategory } from './program'
import { TeamCategory } from './expert'
import { NewsInfo, SnsInfo } from './community'

// 사이트 구성 관련 타입들
export interface SiteConfig {
  siteName: string
  logo: string
  favicon: string
  contact: {
    phone: string
    email: string
    address: string
    operatingHours: string
  }
  socialLinks: {
    instagram?: string
    facebook?: string
    blog?: string
    kakao?: string
  }
}

export interface HeroSlide {
  id: number
  title: string
  description: string
  categoryText: string
  categoryLink: string
  backgroundImage: string
  order: number
  enabled: boolean
}

// 프로그램 아이콘 매핑 타입
export interface ProgramIconMapping {
  id: string
  categoryKeywords: string[]  // ["인지", "학습"] 등 프로그램 카테고리와 매칭할 키워드
  iconName: string           // "Brain", "Heart" 등 Lucide 아이콘 이름
  bgColor: string           // 배경색 클래스명
  hoverColor: string        // 호버 색상 클래스명
  order: number             // 정렬 순서
}

// 그라데이션 색상 설정
export interface GradientColor {
  id: string
  name: string
  fromColor: string
  toColor: string
  category: 'section' | 'card' | 'button'
}

export interface HomeConfig {
  hero: {
    enabled: boolean
    autoPlay: boolean
    slides: HeroSlide[]
  }
  programs?: {
    title: string
    description: string
    enabled: boolean
  }
  // 새로 추가되는 섹션 설정
  sections?: {
    categoryCards?: {
      title: string
      description?: string
      enabled: boolean
    }
    programGrid?: {
      title: string
      description: string
      enabled: boolean
      iconMappings: ProgramIconMapping[]
    }
    aboutSection?: {
      enabled: boolean
      showButton: boolean
    }
    mainServices?: {
      enabled: boolean
      showSubPrograms: boolean
    }
  }
  // UI 테마 설정
  theme?: {
    primaryColor: string
    accentColor: string
    gradientColors: GradientColor[]
  }
}

// 전체 기본 사이트 데이터 구조
export interface DefaultSiteData {
  siteInfo: {
    name: string
    enName: string
    establishedDate: string
    purpose: string
    contact: ContactInfo
    mainServices: MainServices
    faviconUrl?: string
    headerLogoUrl?: string
  }
  aboutInfo: {
    director: DirectorInfo
    history: HistoryInfo
    advisors: AdvisorsInfo
    location: LocationInfo
    inquiry: InquiryInfo
    facilities: string[]
  }
  programs: ProgramCategory[]
  team: TeamCategory[]
  community: {
    news: NewsInfo
    sns: SnsInfo
  }
  homeConfig: HomeConfig
}