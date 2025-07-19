// 소개 관련 타입들
export interface DirectorInfo {
  name: string
  position: string[]
  education: string[]
  career: string[]
  committees: string[]
  certifications: string[]
  imageUrl?: string
  aboutMessage?: {
    title: string
    description: string
    highlightKeywords?: string[]
  }
  hero?: {
    title: string
    description: string
    imageUrl?: string
  }
}

export interface AdvisorInfo {
  name: string
  position: string[]
  education: string[]
  career: string[]
  imageUrl?: string
  order: number
}

export interface HistoryInfo {
  hero: {
    title: string
    description: string
    imageUrl?: string
  }
  milestones: Milestone[]
  stats?: HistoryStats
}

export interface StatsCard {
  id: string
  title: string
  description: string
  iconPath: string
  order: number
  enabled: boolean
}

export interface HistoryStats {
  title: string
  description: string
  cards: StatsCard[]
}

export interface AdvisorsInfo {
  aboutMessage: {
    title: string
    description: string
  }
  hero: {
    title: string
    description: string
    imageUrl?: string
  }
  list: AdvisorInfo[]
}

export interface LocationInfo {
  hero: {
    title: string
    description: string
    imageUrl?: string
  }
  aboutMessage: {
    title: string
    description: string
  }
  transportation: TransportationInfo[]
}

export interface InquiryInfo {
  hero: {
    title: string
    description: string
    imageUrl?: string
  }
  aboutMessage: {
    title: string
    description: string
  }
  categories: string[]
}

export interface AboutInfo {
  title: string
  milestones?: Milestone[]
  photos?: Photo[]
  vision?: string
  mission?: string
  coreValues?: string[]
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
  transportationInfo?: TransportationInfo[]
  parkingInfo?: string
  images?: LocationImage[]
}

export interface Milestone {
  year: string
  month: string
  event: string
}

export interface Photo {
  id: string
  title: string
  imageUrl: string
  description: string
  date: string
}

export type TransportationType = '지하철' | '버스' | '차'

export interface TransportationInfo {
  type: TransportationType
  description: string
}

export interface LocationImage {
  id: string
  title: string
  imageUrl: string
}

// 센터소개 관리 통합 데이터 구조
export interface AboutData {
  director: DirectorInfo
  history: HistoryInfo
  advisors: AdvisorsInfo
  location: LocationInfo
}