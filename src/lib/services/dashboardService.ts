import { 
  collection,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { getUnreadInquiriesCount } from './inquiryService'

// 대시보드 통계 타입
export interface DashboardStats {
  totalPrograms: number
  totalTherapists: number
  unreadInquiries: number
  monthlyVisitors: number
  programsChange: string
  therapistsChange: string
  inquiriesChange: string
  visitorsChange: string
}

// 최근 문의 타입
export interface RecentInquiry {
  id: string
  name: string
  category: string
  time: string
  status: 'unread' | 'replied' | 'resolved'
}

// 최근 게시글 타입
export interface RecentNews {
  id: string
  title: string
  publishDate: string
  status: 'published' | 'draft'
}

// 대시보드 통계 데이터 가져오기
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = getFirebaseDb(); if (!db) {
      throw new Error('Firestore가 초기화되지 않았습니다.')
    }
    
    // 병렬로 모든 데이터 가져오기
    const [
      programsSnapshot,
      therapistsSnapshot,
      unreadCount
    ] = await Promise.all([
      getDocs(collection(db, 'programs')),
      getDocs(query(collection(db, 'team'), where('category', '==', 'therapist'))),
      getUnreadInquiriesCount()
    ])

    // 임시 방문자 수 (실제로는 Google Analytics 연동 필요)
    const monthlyVisitors = 1247

    return {
      totalPrograms: programsSnapshot.size,
      totalTherapists: therapistsSnapshot.size,
      unreadInquiries: unreadCount,
      monthlyVisitors,
      programsChange: '+2',
      therapistsChange: '+1',
      inquiriesChange: '-2',
      visitorsChange: '+15%'
    }
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error)
    
    // 에러 시 기본값 반환
    return {
      totalPrograms: 0,
      totalTherapists: 0,
      unreadInquiries: 0,
      monthlyVisitors: 0,
      programsChange: '0',
      therapistsChange: '0',
      inquiriesChange: '0',
      visitorsChange: '0%'
    }
  }
}

// 최근 문의 가져오기
export async function getRecentInquiries(limitCount: number = 5): Promise<RecentInquiry[]> {
  try {
    const db = getFirebaseDb(); if (!db) {
      throw new Error('Firestore가 초기화되지 않았습니다.')
    }
    
    const inquiriesRef = collection(db, 'inquiries')
    const q = query(
      inquiriesRef, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      const createdAt = data.createdAt as Timestamp
      
      return {
        id: doc.id,
        name: data.name,
        category: data.category,
        time: formatTimeAgo(createdAt),
        status: data.status
      }
    })
  } catch (error) {
    console.error('최근 문의 조회 오류:', error)
    return []
  }
}

// 최근 게시글 가져오기
export async function getRecentNews(limitCount: number = 5): Promise<RecentNews[]> {
  try {
    const db = getFirebaseDb(); if (!db) {
      throw new Error('Firestore가 초기화되지 않았습니다.')
    }
    
    // community 컬렉션에서 뉴스 데이터 가져오기
    const communityRef = collection(db, 'community')
    const querySnapshot = await getDocs(communityRef)
    
    if (querySnapshot.empty) {
      return []
    }
    
    // 모든 articles 수집
    interface Article {
      id: string
      title: string
      date?: string
      createdAt: string
      status?: string
    }
    const allArticles: Article[] = []
    querySnapshot.forEach(doc => {
      const data = doc.data()
      if (data.news?.articles) {
        allArticles.push(...data.news.articles)
      }
    })
    
    // 최신순 정렬 후 제한된 개수만 반환
    const sortedArticles = allArticles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limitCount)
    
    return sortedArticles.map(article => ({
      id: article.id,
      title: article.title,
      publishDate: new Date(article.date || article.createdAt).toLocaleDateString('ko-KR'),
      status: (article.status === 'published' ? 'published' : 'draft') as 'published' | 'draft'
    }))
  } catch (error) {
    console.error('최근 게시글 조회 오류:', error)
    
    // 에러 시 빈 배열 반환
    return []
  }
}

// 시간 차이를 "N시간 전" 형태로 변환
function formatTimeAgo(timestamp: Timestamp): string {
  const now = new Date()
  const time = timestamp.toDate()
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  return time.toLocaleDateString('ko-KR')
}