import { 
  Brain,
  Heart, 
  Users,
  Target,
  Lightbulb,
  Star,
  MessageCircle,
  Activity,
  User,
  GraduationCap,
  Award,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  BookOpen,
  Zap,
  Settings,
  Smile,
  ThumbsUp,
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
  Activity,
  User,
  GraduationCap,
  Award,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  BookOpen,
  Zap,
  Settings,
  Smile,
  ThumbsUp
}

// 드롭다운에서 사용할 아이콘 목록
export const AVAILABLE_ICONS = [
  { name: 'Brain', component: Brain, label: '뇌' },
  { name: 'Heart', component: Heart, label: '하트' },
  { name: 'Users', component: Users, label: '사용자들' },
  { name: 'Target', component: Target, label: '타겟' },
  { name: 'Lightbulb', component: Lightbulb, label: '전구' },
  { name: 'Star', component: Star, label: '별' },
  { name: 'MessageCircle', component: MessageCircle, label: '메시지' },
  { name: 'Activity', component: Activity, label: '활동' },
  { name: 'User', component: User, label: '사용자' },
  { name: 'GraduationCap', component: GraduationCap, label: '졸업모자' },
  { name: 'Award', component: Award, label: '상장' },
  { name: 'FileText', component: FileText, label: '문서' },
  { name: 'Shield', component: Shield, label: '방패' },
  { name: 'CheckCircle', component: CheckCircle, label: '체크' },
  { name: 'Clock', component: Clock, label: '시계' },
  { name: 'BookOpen', component: BookOpen, label: '책' },
  { name: 'Zap', component: Zap, label: '번개' },
  { name: 'Settings', component: Settings, label: '설정' },
  { name: 'Smile', component: Smile, label: '웃음' },
  { name: 'ThumbsUp', component: ThumbsUp, label: '좋아요' }
]

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