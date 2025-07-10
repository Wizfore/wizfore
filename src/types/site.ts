import { CoreValues, OrganizationInfo, ContactInfo, MainService } from './common'
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

export interface HomeConfig {
  hero: {
    enabled: boolean
    autoPlay: boolean
    slides: HeroSlide[]
  }
  programs: {
    title: string
    subtitle: string
    description: string
    enabled: boolean
  }
  experts: {
    title: string
    subtitle: string
    description: string
    enabled: boolean
  }
  about: {
    title: string
    subtitle: string
    description: string
    image: string
    enabled: boolean
  }
  news: {
    title: string
    subtitle: string
    description: string
    enabled: boolean
  }
  facilities: {
    title: string
    subtitle: string
    description: string
    enabled: boolean
  }
  contact: {
    title: string
    subtitle: string
    description: string
    image: string
    enabled: boolean
  }
}

export interface SiteAsset {
  id: string
  name: string
  category: 'hero' | 'program' | 'icon' | 'background' | 'other'
  url: string
  alt: string
  description?: string
  order: number
  enabled: boolean
}

// 전체 기본 사이트 데이터 구조
export interface DefaultSiteData {
  siteInfo: {
    name: string
    establishedDate: string
    purpose: string
    coreValues: CoreValues
    organization: OrganizationInfo
    contact: ContactInfo
    mainServices: MainService[]
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
  siteAssets: SiteAsset[]
}