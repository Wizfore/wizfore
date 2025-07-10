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

export interface Notice {
  id: string
  title: string
  content: string
  publishDate: string
  author: string
  featured: boolean
  status: 'published' | 'draft'
  attachments?: Attachment[]
  comments?: Comment[]
}

export interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadDate: string
}

export interface Comment {
  id: string
  author: string
  content: string
  date: string
  isVisible: boolean
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  email: string
  category: string
  message: string
  createdAt: string
  status: 'unread' | 'replied'
  adminNote?: string
  replyContent?: string
  repliedAt?: string
  replies?: Reply[]
}

export interface Reply {
  id: string
  content: string
  replyDate: string
  repliedBy: string
  isVisible: boolean
}

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

// 기본 사이트 데이터 구조를 위한 새로운 타입들
export interface DirectorInfo {
  name: string
  position: string[]
  education: string[]
  career: string[]
  committees: string[]
  certifications: string[]
  imageUrl?: string
  heroImageUrl?: string
  aboutMessage?: {
    title: string
    description: string
  }
  heroMessage?: {
    title: string
    description: string
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

export interface OrganizationInfo {
  totalStaff: number
  staffComposition: {
    category: string
    count: number
  }[]
  totalClients: number
  clientComposition: {
    category: string
    count: number
  }[]
}

export interface CoreValues {
  diverse: string
  together: string
  restful: string
  dreaming: string
  growing: string
  caring: string
  healing: string
}

export interface ProgramCategory {
  id: string
  title: string
  description: string
  programs: ProgramDetail[]
  order: number
  imageUrl?: string
}

export interface ProgramDetail {
  title: string
  target?: string[]
  goal: string[]
  content?: string[]
  types?: string[]
  order: number
}

export interface TeamMember {
  name: string
  specialization: string[]
  education: string[]
  certifications: string[]
  imageUrl?: string
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
  heroMessage?: {
    title: string
    description: string
  }
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
  members: TeamMember[]
  order: number
}

export interface CategoryItem {
  korean: string
  english: string
}

export interface NewsItem {
  id: number
  title: string
  content: string
  date: string
  imageUrl?: string
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
  details?: string[]
  startYear: string
  order: number
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
    history: {
      heroMessage: {
        title: string
        description: string
      }
      milestones: Milestone[]
    }
    advisors: {
      aboutMessage: {
        title: string
        description: string
      }
      heroMessage: {
        title: string
        description: string
      }
      list: AdvisorInfo[]
    }
    location: {
      heroMessage: {
        title: string
        description: string
      }
      aboutMessage: {
        title: string
        description: string
      }
      transportation: TransportationInfo[]
    }
    inquiry: {
      heroMessage: {
        title: string
        description: string
      }
      aboutMessage: {
        title: string
        description: string
      }
      categories: string[]
    }
    facilities: string[]
  }
  programs: ProgramCategory[]
  team: TeamCategory[]
  community: {
    news: {
      categories: CategoryItem[]
      heroMessage?: {
        title?: string
        description?: string
      }
      aboutMessage?: {
        title?: string
        description?: string
      }
      articles: Record<string, NewsItem[]>
    }
    sns: {
      heroMessage?: {
        title?: string
        description?: string
      }
      aboutMessage?: {
        title?: string
        description?: string
      }
      youtube?: {
        link?: string
        message?: {
          title?: string
          description?: string
        }
      }
      instagram?: string
      facebook?: string
      blog?: string
    }
  }
  homeConfig: HomeConfig
  siteAssets: SiteAsset[]
}
