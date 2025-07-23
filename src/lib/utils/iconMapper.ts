import { 
  Brain,
  Heart, 
  Users,
  Target,
  Lightbulb,
  Star,
  MessageCircle,
  Activity,
  LucideIcon
} from 'lucide-react'
import type { ProgramIconMapping } from '@/types'

// Lucide 아이콘 매핑 객체
const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Heart,
  Users,
  Target,
  Lightbulb,
  Star,
  MessageCircle,
  Activity
}

/**
 * 아이콘 이름으로 실제 아이콘 컴포넌트를 반환
 */
export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Brain // 기본값으로 Brain 아이콘 사용
}

/**
 * 프로그램 제목/카테고리를 기반으로 적절한 아이콘 매핑을 찾아 반환
 */
export function findIconMapping(
  programTitle: string, 
  categoryTitle: string, 
  iconMappings: ProgramIconMapping[]
): ProgramIconMapping | null {
  
  // 정확한 키워드 매칭을 우선 시도
  for (const mapping of iconMappings.sort((a, b) => a.order - b.order)) {
    const searchText = `${programTitle} ${categoryTitle}`.toLowerCase()
    
    // 키워드 중 하나라도 매칭되면 해당 아이콘 사용
    for (const keyword of mapping.categoryKeywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return mapping
      }
    }
  }
  
  // 매칭되는 것이 없으면 첫 번째 아이콘 사용 (기본값)
  return iconMappings.length > 0 ? iconMappings[0] : null
}

/**
 * 프로그램 목록과 아이콘 매핑을 결합하여 렌더링용 데이터 생성
 */
export function combineProgramsWithIcons(
  programs: Array<{
    title: string
    goal: string
    categoryTitle: string
    categoryId: string
    order: number
  }>,
  iconMappings: ProgramIconMapping[]
) {
  return programs.map((program) => {
    const mapping = findIconMapping(
      program.title, 
      program.categoryTitle, 
      iconMappings
    )
    
    return {
      ...program,
      icon: mapping ? getIconComponent(mapping.iconName) : getIconComponent('Brain'),
      bgColor: mapping?.bgColor || 'bg-wizfore-light-beige',
      hoverColor: mapping?.hoverColor || 'bg-wizfore-light-beige',
      iconMapping: mapping || undefined
    }
  })
}