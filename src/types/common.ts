// 공통 타입들
export interface User {
  uid: string
  email: string
  displayName: string
  role: 'admin' | 'staff'
  lastLogin: string
  createdAt: string
  permissions?: Permission[]
  activities?: Activity[]
}

export interface Permission {
  id: string
  resource: string
  actions: string[]
}

export interface Activity {
  id: string
  action: string
  timestamp: string
  details?: string
  ipAddress: string
}

export interface ContactInfo {
  address: string
  phone: string
  fax: string
  email: string
  website: string
  operatingHours: {
    weekday: string
    weekend: string
  }
  businessNumber: string
  accountInfo: string
  mapUrl: string
}

export interface MainService {
  title: string
  description: string
  details: string[]
  startYear: string
  order: number
}

export interface MainServices {
  aboutMessage: {
    title: string
    description: string
    highlightKeywords: string[]
  }
  services: MainService[]
}

export interface CategoryItem {
  korean: string
  english: string
}