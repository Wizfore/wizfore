import { 
  Target, Users, Clock, Award, Home, Leaf, Smile, MapPin, Heart, BookOpen 
} from 'lucide-react'

export type ProgramType = 'therapy' | 'adult-day' | 'afterschool'

export interface IconMapperConfig {
  getIcon: (_title: string) => React.ComponentType<{ className?: string }>
  getColorClass: (_title: string) => string
}

// 치료 프로그램 아이콘/색상 매핑
export const therapyIconMapper: IconMapperConfig = {
  getIcon: (title: string) => {
    if (title.includes('언어')) return Target
    if (title.includes('인지')) return Target
    if (title.includes('놀이')) return Users
    if (title.includes('미술')) return Award
    if (title.includes('음악')) return Award
    if (title.includes('감각')) return Clock
    if (title.includes('체육') || title.includes('운동')) return Users
    if (title.includes('심리')) return Target
    return Target
  },
  getColorClass: (title: string) => {
    if (title.includes('언어')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (title.includes('인지')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (title.includes('놀이')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('미술')) return 'bg-pink-50 text-pink-700 border-pink-200'
    if (title.includes('음악')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (title.includes('감각')) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    if (title.includes('체육') || title.includes('운동')) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (title.includes('심리')) return 'bg-teal-50 text-teal-700 border-teal-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// 성인 주간활동 프로그램 아이콘/색상 매핑
export const adultDayIconMapper: IconMapperConfig = {
  getIcon: (title: string) => {
    if (title.includes('일상생활')) return Home
    if (title.includes('사회적응')) return Users
    if (title.includes('쉼') || title.includes('힐링')) return Leaf
    if (title.includes('재미') || title.includes('여가')) return Smile
    if (title.includes('지역사회')) return MapPin
    if (title.includes('건강')) return Heart
    return Target
  },
  getColorClass: (title: string) => {
    if (title.includes('일상생활')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (title.includes('사회적응')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('쉼') || title.includes('힐링')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (title.includes('재미') || title.includes('여가')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (title.includes('지역사회')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (title.includes('건강')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// 방과후 프로그램 아이콘/색상 매핑
export const afterschoolIconMapper: IconMapperConfig = {
  getIcon: (title: string) => {
    if (title.includes('토요') || title.includes('사회성')) return Users
    if (title.includes('평일') || title.includes('학습')) return BookOpen
    return Target
  },
  getColorClass: (title: string) => {
    if (title.includes('토요') || title.includes('사회성')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('평일') || title.includes('학습')) return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

// 프로그램 타입별 매퍼 반환
export const getIconMapper = (programType: ProgramType): IconMapperConfig => {
  switch (programType) {
    case 'therapy':
      return therapyIconMapper
    case 'adult-day':
      return adultDayIconMapper
    case 'afterschool':
      return afterschoolIconMapper
    default:
      return therapyIconMapper
  }
}

// 프로그램 타입별 그리드 컬럼 설정
export const getGridConfig = (programType: ProgramType): string => {
  switch (programType) {
    case 'therapy':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
    case 'adult-day':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
    case 'afterschool':
      return 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'
    default:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
  }
}