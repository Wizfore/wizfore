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
  | 'advisor-male'   // 남성 어드바이저 (교수)
  | 'advisor-female' // 여성 어드바이저 (교수)
  | 'advisor-director' // 원장/대표
  | 'advisor-police'   // 경찰/경감
  | 'teacher'        // 선생님
  | 'therapist'      // 치료사 (약사)

/**
 * Fallback 이미지 경로 매핑
 */
const FALLBACK_IMAGE_PATHS: Record<FallbackImageType, string> = {
  hero: '/images/hero/defaultHero.jpg',
  program: '/images/programs/defaultImage.jpg',
  favicon: '/icons/favicon.png',
  logo: '/icons/withoutBackground.png', // Header.tsx에서 사용하는 것과 동일한 경로
  director: '/images/director/defaultDirector.png',
  'advisor-male': '/images/advisors/defaultProfessorM.png',
  'advisor-female': '/images/advisors/defaultProfessorW.png',
  'advisor-director': '/images/advisors/defaultDirectorW.png',
  'advisor-police': '/images/advisors/defaultPoliceM.png',
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
  if (folder === 'director') {
    return 'director'
  }
  if (folder === 'advisors') {
    return determineAdvisorType({ role, gender })
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
 * 자문위원의 직책에 따라 적절한 fallback 이미지 타입을 결정
 * getAdvisorDefaultImage 로직을 fallback 시스템에 통합
 */
function determineAdvisorType(context: {
  role?: string
  gender?: 'male' | 'female'
}): FallbackImageType {
  const { role, gender } = context
  
  if (!role) {
    return gender === 'male' ? 'advisor-male' : 'advisor-female'
  }

  const roleStr = Array.isArray(role) ? role.join(' ') : role
  
  // 직책별 매핑 (getAdvisorDefaultImage 로직 기반)
  if (roleStr.includes('교수')) {
    return 'advisor-male' // defaultProfessorM.png
  } else if (roleStr.includes('원장') || roleStr.includes('대표')) {
    return 'advisor-director' // defaultDirectorW.png
  } else if (roleStr.includes('경찰') || roleStr.includes('경감')) {
    return 'advisor-police' // defaultPoliceM.png
  } else if (roleStr.includes('약사')) {
    return 'therapist' // defaultPharmacistW.png
  } else {
    return 'advisor-male' // 기본값: defaultProfessorM.png
  }
}

/**
 * 모든 fallback 이미지 경로 목록 반환 (디버깅/테스트용)
 */
export function getAllFallbackPaths(): Record<FallbackImageType, string> {
  return { ...FALLBACK_IMAGE_PATHS }
}