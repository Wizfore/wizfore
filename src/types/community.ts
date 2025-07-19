import { CategoryItem } from './common'

// 커뮤니티 관련 타입들
export interface Article {
  id: string
  title: string
  contentHtml: string    // HTML 콘텐츠
  status: 'draft' | 'published'
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
  status: 'unread' | 'replied' | 'resolved'
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

// 커뮤니티 관리 통합 데이터 구조 (SNS 관리용)
export interface CommunityData {
  sns: SnsInfo
}