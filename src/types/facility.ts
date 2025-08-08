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

// 센터 둘러보기 관련 타입들
export interface FacilityCategory {
  id: string
  name: string
  order: number
}

export interface FacilityImage {
  id: string
  description?: string
  imageUrl: string
  categoryId: string
  order: number
}