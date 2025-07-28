// 전문가 및 팀 관련 타입들
export interface Expert {
  id: string
  name: string
  position: string
  image: string
  introduction: string
  education: string[]
  certificates: string[]
  category: string
  featured: boolean
  order: number
  certifications?: Certification[]
  schedules?: Schedule[]
}

export interface Certification {
  id: string
  name: string
  issueDate: string
  issuer: string
  expiryDate?: string
  imageUrl?: string
}

export interface Schedule {
  id: string
  dayOfWeek: string
  availableHours: string[]
  isAvailable: boolean
}

export interface TeamMember {
  name: string
  specialization: string[]
  education: string[]
  certifications: string[]
  order: number
}

export interface TeamFeature {
  id: string
  title: string
  description: string
  iconName: string
  order: number
}

export interface TeamCategory {
  id: string
  hero?: {
    title: string
    description: string
    imageUrl?: string
    defaultImageUrl?: string
  }
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
  members: TeamMember[]
  order: number
}

// 전문가 소개 관리 통합 데이터 구조
export interface TeamData {
  therapists: TeamCategory
  teachers: TeamCategory
}