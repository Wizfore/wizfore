/**
 * Fallback 이미지 매핑 유틸리티
 * 관리자 페이지에서 이미지가 없을 때 사용할 기본 이미지 경로를 제공
 */

export type FallbackImageType = 
  | 'hero'           // 히어로 섹션
  | 'program'        // 프로그램 이미지
  | 'favicon'        // 파비콘
  | 'logo'           // 로고
  | 'director'       // 센터장
  | 'advisor-male'   // 남성 어드바이저
  | 'advisor-female' // 여성 어드바이저
  | 'teacher'        // 선생님
  | 'therapist'      // 치료사

/**
 * Fallback 이미지 경로 매핑
 */
const FALLBACK_IMAGE_PATHS: Record<FallbackImageType, string> = {
  hero: '/images/hero/defaultHero.jpg',
  program: '/images/programs/defaultImage.jpg',
  favicon: '/favicon.ico',
  logo: '/icons/withoutBackground.png', // Header.tsx에서 사용하는 것과 동일한 경로
  director: '/images/director/defaultDirector.png',
  'advisor-male': '/images/advisors/defaultProfessorM.png',
  'advisor-female': '/images/advisors/defaultProfessorW.png',
  teacher: '/images/advisors/defaultDirectorW.png',
  therapist: '/images/advisors/defaultPharmacistW.png'
}

/**
 * 특정 타입에 대한 fallback 이미지 경로를 반환
 */
export function getFallbackImagePath(type: FallbackImageType): string {
  return FALLBACK_IMAGE_PATHS[type]
}

/**
 * 컨텍스트를 기반으로 적절한 fallback 이미지 타입을 결정
 */
export function determineFallbackType(context: {
  category?: string
  folder?: string
  role?: string
  gender?: 'male' | 'female'
}): FallbackImageType {
  const { category, folder, role, gender } = context

  // 사이트 에셋 처리
  if (category?.includes('favicon')) {
    return 'favicon'
  }
  if (category?.includes('logo')) {
    return 'logo'
  }

  // 폴더 기반 처리
  if (folder === 'hero-images' || folder === 'hero') {
    return 'hero'
  }
  if (folder === 'program-images' || folder === 'programs') {
    return 'program'
  }

  // 역할 기반 처리
  if (role === 'director' || role === '센터장') {
    return 'director'
  }
  if (role === 'teacher' || role === '선생님') {
    return 'teacher'
  }
  if (role === 'therapist' || role === '치료사') {
    return 'therapist'
  }

  // 어드바이저 처리 (성별 고려)
  if (role === 'advisor' || role === '어드바이저') {
    return gender === 'male' ? 'advisor-male' : 'advisor-female'
  }

  // 팀 멤버 처리 (기본적으로 성별 고려)
  if (folder === 'team' || folder === 'members') {
    return gender === 'male' ? 'advisor-male' : 'advisor-female'
  }

  // 기본값: 프로그램 이미지
  return 'program'
}

/**
 * 컨텍스트를 기반으로 fallback 이미지 경로를 직접 반환
 */
export function getFallbackImageForContext(context: {
  category?: string
  folder?: string
  role?: string
  gender?: 'male' | 'female'
}): string {
  const type = determineFallbackType(context)
  return getFallbackImagePath(type)
}

/**
 * 팀 멤버의 역할과 성별에 따른 적절한 fallback 이미지 반환
 */
export function getTeamMemberFallback(role?: string, gender?: 'male' | 'female'): string {
  if (!role) {
    return getFallbackImagePath(gender === 'male' ? 'advisor-male' : 'advisor-female')
  }

  const normalizedRole = role.toLowerCase()
  
  if (normalizedRole.includes('센터장') || normalizedRole.includes('director')) {
    return getFallbackImagePath('director')
  }
  
  if (normalizedRole.includes('선생님') || normalizedRole.includes('teacher')) {
    return getFallbackImagePath('teacher')
  }
  
  if (normalizedRole.includes('치료사') || normalizedRole.includes('therapist')) {
    return getFallbackImagePath('therapist')
  }

  // 기본값: 성별에 따른 어드바이저 이미지
  return getFallbackImagePath(gender === 'male' ? 'advisor-male' : 'advisor-female')
}

/**
 * 모든 fallback 이미지 경로 목록 반환 (디버깅/테스트용)
 */
export function getAllFallbackPaths(): Record<FallbackImageType, string> {
  return { ...FALLBACK_IMAGE_PATHS }
}