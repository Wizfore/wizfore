// 시설 관련 타입들
export interface Facility {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  featured: boolean
  order: number
  equipment?: Equipment[]
  features?: Feature[]
}

export interface Equipment {
  id: string
  name: string
  description: string
  imageUrl: string
}

export interface Feature {
  id: string
  name: string
  description: string
}