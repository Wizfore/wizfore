import type { Article, CategoryItem } from '@/types'


/**
 * 특정 카테고리에서 다음 사용할 ID를 생성합니다.
 * 해당 카테고리 뉴스 배열의 최대값에 1을 더한 값을 반환합니다.
 * 
 * @param articles - 전체 기사 배열
 * @param category - 카테고리명
 * @returns 다음 사용할 ID (문자열)
 */
export function getNextNewsId(articles: Article[], category: string): string {
  const categoryNews = articles.filter(article => article.category === category)
  
  if (categoryNews.length === 0) {
    return "1"
  }
  
  // 카테고리별 ID 패턴에 맞춰 숫자 부분 추출
  const maxId = Math.max(...categoryNews.map(news => {
    const match = news.id.match(/_?(\d+)$/)
    return match ? parseInt(match[1]) : 0
  }))
  
  return `${category}_${maxId + 1}`
}

/**
 * 새로운 뉴스 항목을 생성합니다.
 * ID는 해당 카테고리에서 자동으로 생성됩니다.
 * 
 * @param articles - 전체 기사 배열
 * @param newsData - 새 뉴스 데이터 (ID 제외)
 * @returns 새로운 뉴스 항목
 */
export function createArticle(
  articles: Article[],
  newsData: Omit<Article, 'id'>
): Article {
  return {
    id: getNextNewsId(articles, newsData.category),
    ...newsData
  }
}

/**
 * 전체 배열에 새 항목을 추가합니다.
 * 
 * @param articles - 전체 기사 배열
 * @param newsData - 새 뉴스 데이터 (ID 제외)
 * @returns 새 항목이 추가된 뉴스 배열
 */
export function addArticle(
  articles: Article[],
  newsData: Omit<Article, 'id'>
): Article[] {
  const newItem = createArticle(articles, newsData)
  return [...articles, newItem]
}

/**
 * 전체 뉴스 배열을 반환합니다.
 * 새로운 배열 구조에서는 이미 category 필드가 포함되어 있습니다.
 * 
 * @param articles - 전체 기사 배열
 * @returns 전체 뉴스 배열
 */
export function getAllNewsWithCategory(articles: Article[]): Article[] {
  return articles
}

/**
 * 특정 카테고리의 뉴스만 반환합니다.
 * 
 * @param articles - 전체 기사 배열
 * @param category - 조회할 카테고리
 * @returns 해당 카테고리의 뉴스 배열
 */
export function getNewsByCategory(
  articles: Article[], 
  category: string
): Article[] {
  return articles.filter(article => article.category === category)
}

/**
 * 공지사항과 일반 뉴스를 분리합니다.
 * 
 * @param newsData - 카테고리별 뉴스 객체
 * @returns 공지사항과 일반 뉴스가 분리된 객체
 */
/**
 * 카테고리 영어명으로 한글명 찾기
 */
export function getCategoryByEnglish(categories: CategoryItem[], english: string): CategoryItem | undefined {
  return categories.find(cat => cat.english === english)
}

/**
 * 카테고리 한글명으로 영어명 찾기
 */
export function getCategoryByKorean(categories: CategoryItem[], korean: string): CategoryItem | undefined {
  return categories.find(cat => cat.korean === korean)
}

/**
 * 한글 카테고리명을 영어로 변환
 */
export function getEnglishCategory(categories: CategoryItem[], korean: string): Article['category'] {
  const category = getCategoryByKorean(categories, korean)
  return (category?.english as Article['category']) || 'news'
}

/**
 * 영어 카테고리명을 한글로 변환
 */
export function getKoreanCategory(categories: CategoryItem[], english: string): string {
  const category = getCategoryByEnglish(categories, english)
  return category?.korean || english
}

/**
 * 공지사항과 일반 뉴스 분리 (영어 카테고리 기준)
 */
export function separateNoticeAndNews(articles: Article[]) {
  const noticeItems = articles.filter(article => article.category === 'notices')
  const regularNews = articles.filter(article => article.category !== 'notices')
  
  return {
    noticeItems,
    regularNews
  }
}

/**
 * 뉴스 목록을 표시용으로 정렬합니다.
 * 공지사항이 상단에, 일반 뉴스는 날짜 역순으로 정렬됩니다.
 * 
 * @param newsData - 카테고리별 뉴스 객체
 * @param selectedCategory - 선택된 카테고리 ('all' 또는 특정 카테고리)
 * @returns 정렬된 뉴스 배열
 */
/**
 * 뉴스 목록을 표시용으로 정렬 (영어 카테고리 기준)
 */
export function sortNewsForDisplay(
  articles: Article[], 
  selectedCategory: string
): Article[] {
  if (selectedCategory === 'all') {
    const { noticeItems, regularNews } = separateNoticeAndNews(articles)
    
    // 공지사항은 최신순으로 정렬
    const sortedNotices = noticeItems.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    // 일반 뉴스는 최신순으로 정렬
    const sortedRegularNews = regularNews.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return [...sortedNotices, ...sortedRegularNews]
  }
  
  // 특정 카테고리가 선택된 경우 (영어 카테고리명 사용)
  const categoryNews = getNewsByCategory(articles, selectedCategory)
  return categoryNews.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * 전역 고유 ID를 생성합니다 (category-id 형태).
 * URL 라우팅에 사용됩니다.
 * 
 * @param category - 카테고리명
 * @param id - 카테고리 내 ID
 * @returns 전역 고유 ID
 */
export function createGlobalId(category: string, id: string): string {
  return `${category}-${id}`
}

/**
 * 전역 ID를 파싱하여 카테고리와 ID를 반환합니다.
 * 
 * @param globalId - 전역 고유 ID (category-id 형태)
 * @returns 카테고리와 ID 객체
 */
export function parseGlobalId(globalId: string): { category: string; id: string } | null {
  const parts = globalId.split('-')
  if (parts.length < 2) return null
  
  const id = parts[parts.length - 1]
  const category = parts.slice(0, -1).join('-')
  return { category, id }
}

/**
 * 특정 뉴스 항목을 전역 ID로 찾습니다.
 * 
 * @param articles - 전체 기사 배열
 * @param globalId - 전역 고유 ID
 * @returns 해당 뉴스 항목 또는 null
 */
export function findNewsByGlobalId(
  articles: Article[], 
  globalId: string
): Article | null {
  const parsed = parseGlobalId(globalId)
  if (!parsed) return null
  
  const { category, id } = parsed
  
  const article = articles.find(item => item.category === category && item.id === id)
  return article || null
}