import { CategoryItem } from './common'

// 커뮤니티 관련 타입들
export interface Article {
  id: string
  title: string
  contentMarkdown: string   // 마크다운 콘텐츠
  images: string[]          // Firebase Storage URLs 배열
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  category: 'notices' | 'partnership' | 'news' | 'events' | 'awards'
  date: string              // 발행일/표시일
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

// NewsItem은 Article과 통합됨 - 하위 호환성을 위해 별칭으로 유지
export type NewsItem = Article

export interface NewsInfo {
  categories: CategoryItem[]
  hero?: {
    title?: string
    description?: string
    imageUrl?: string
  }
  aboutMessage?: {
    title?: string
    description?: string
  }
  articles: Article[]
}

export interface SnsInfo {
  hero?: {
    title?: string
    description?: string
    imageUrl?: string
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