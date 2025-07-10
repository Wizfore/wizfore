import { CategoryItem } from './common'

// 커뮤니티 관련 타입들
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

export interface NewsItem {
  id: number
  title: string
  content: string
  date: string
  imageUrl?: string
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
  articles: Record<string, NewsItem[]>
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