// 프로그램 관련 타입들
export interface Program {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  description: string // 추가된 필드
  image: string
  icon: string
  category: string
  featured: boolean
  order: number
  status?: 'active' | 'preparation' | 'inactive' // 추가된 필드 (선택적)
  targetAudience?: string // 추가된 필드 (선택적)
  capacity?: number // 추가된 필드 (선택적)
  schedule?: string // 추가된 필드
  tags?: string[] // 추가된 필드
  target?: string[] // 기존 데이터와의 호환성을 위해 추가
  goal: string[] // 기존 ProgramDetail에서 이전
  content?: string[] // 기존 ProgramDetail에서 이전
  types?: string[] // 기존 ProgramDetail에서 이전
  sessions?: Session[]
  materials?: Material[]
}

export interface Session {
  id: string
  name: string
  ageRange: string
  duration: number
  capacity: number
  description: string
}

export interface Material {
  id: string
  title: string
  description: string
  imageUrl: string
}

export interface ProgramCategory {
  id: string
  programs: ProgramDetail[]
  order: number
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
}

export interface ProgramDetail {
  id?: string // 관리용 필드
  title: string
  target?: string[]
  goal: string[]
  content?: string[]
  types?: string[]
  order: number
  status?: 'active' | 'preparation' | 'inactive' // 관리용 필드
  targetAudience?: string // 관리용 필드
  capacity?: number // 관리용 필드
  schedule?: string // 관리용 필드
  tags?: string[] // 관리용 필드
  description?: string // 관리용 필드
  shortDescription?: string // 관리용 필드
  fullDescription?: string // 관리용 필드
  image?: string // 관리용 필드
  icon?: string // 관리용 필드
  category?: string // 관리용 필드
  featured?: boolean // 관리용 필드
  sessions?: Session[] // 관리용 필드
  materials?: Material[] // 관리용 필드
}