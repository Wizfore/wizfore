// 프로그램 관련 타입들
export interface Program {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  image: string
  icon: string
  category: string
  featured: boolean
  order: number
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
  }
  aboutMessage?: {
    title: string
    description: string
  }
}

export interface ProgramDetail {
  title: string
  target?: string[]
  goal: string[]
  content?: string[]
  types?: string[]
  order: number
}