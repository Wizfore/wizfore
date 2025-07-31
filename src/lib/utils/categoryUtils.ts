import type { CategoryItem } from '@/types/common'
import { getCommunity } from '@/lib/services/dataService'

/**
 * 영어 카테고리명을 한국어로 변환합니다.
 * @param english - 영어 카테고리명
 * @returns 한국어 카테고리명
 */
export async function getCategoryLabel(english: string): Promise<string> {
  try {
    const categories = await getCategoryOptions()
    const category = categories.find(cat => cat.english === english)
    return category?.korean || english
  } catch (error) {
    // 에러가 발생한 경우 기본 매핑 사용
    const categoryMap: Record<string, string> = {
      'notices': '공지사항',
      'partnership': '협약',
      'news': '소식',
      'events': '행사',
      'awards': '수상'
    }
    return categoryMap[english] || english
  }
}

/**
 * 영어 카테고리명을 한국어로 변환합니다 (동기 버전, 기본값 사용).
 * @param english - 영어 카테고리명
 * @returns 한국어 카테고리명
 */
export function getCategoryLabelSync(english: string): string {
  const categoryMap: Record<string, string> = {
    'notices': '공지사항',
    'partnership': '협약',
    'news': '소식',
    'events': '행사',
    'awards': '수상'
  }
  
  return categoryMap[english] || english
}

/**
 * 모든 카테고리 옵션을 가져옵니다.
 * @returns 카테고리 배열
 */
export async function getCategoryOptions(): Promise<CategoryItem[]> {
  try {
    const communityData = await getCommunity()
    return communityData?.news?.categories || getDefaultCategories()
  } catch (error) {
    console.warn('카테고리 데이터 로딩 실패, 기본값 사용:', error)
    return getDefaultCategories()
  }
}

/**
 * 기본 카테고리 목록을 반환합니다.
 * @returns 기본 카테고리 배열
 */
export function getDefaultCategories(): CategoryItem[] {
  return [
    { english: 'notices', korean: '공지사항' },
    { english: 'partnership', korean: '협약' },
    { english: 'news', korean: '소식' },
    { english: 'events', korean: '행사' },
    { english: 'awards', korean: '수상' }
  ]
}

/**
 * 카테고리에 따른 뱃지 스타일을 반환합니다.
 * @param category - 카테고리 영어명
 * @returns 뱃지 스타일 정보
 */
export function getCategoryBadgeStyle(category: string) {
  const badgeStyles: Record<string, string> = {
    'notices': 'bg-blue-100 text-blue-800',
    'partnership': 'bg-green-100 text-green-800', 
    'news': 'bg-yellow-100 text-yellow-800',
    'events': 'bg-purple-100 text-purple-800',
    'awards': 'bg-red-100 text-red-800'
  }
  
  return {
    className: badgeStyles[category] || 'bg-gray-100 text-gray-800',
    label: getCategoryLabelSync(category)
  }
}

/**
 * 카테고리 필터 옵션을 가져옵니다.
 * @returns 필터 옵션 배열 (전체 포함)
 */
export async function getCategoryFilterOptions() {
  const categories = await getCategoryOptions()
  
  return [
    { value: 'all', label: '전체 카테고리' },
    ...categories.map(cat => ({ value: cat.english, label: cat.korean }))
  ]
}

/**
 * 카테고리의 유효성을 검사합니다.
 * @param category - 검사할 카테고리
 * @returns 유효한 카테고리인지 여부
 */
export async function isValidCategory(category: string): Promise<boolean> {
  try {
    const categories = await getCategoryOptions()
    return categories.some(cat => cat.english === category)
  } catch (error) {
    // 에러가 발생한 경우 기본 카테고리로 검사
    const defaultCategories = getDefaultCategories()
    return defaultCategories.some(cat => cat.english === category)
  }
}