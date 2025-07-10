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

export interface TransportationInfo {
  type: string
  description: string
}

export interface LocationImage {
  id: string
  title: string
  imageUrl: string
}