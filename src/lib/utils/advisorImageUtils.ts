// 자문위원 이미지 관련 유틸리티 함수들

/**
 * 자문위원의 직책에 따라 기본 이미지 경로를 결정하는 함수
 * @param position 직책 배열 또는 문자열
 * @returns 기본 이미지 경로
 */
export const getAdvisorDefaultImage = (position: string[] | string = []): string => {
  const positionArray = Array.isArray(position) ? position : [position].filter(Boolean)
  const positionStr = positionArray.join(' ')
  
  if (positionStr.includes('교수')) {
    return '/images/advisors/defaultProfessorM.png'
  } else if (positionStr.includes('원장') || positionStr.includes('대표')) {
    return '/images/advisors/defaultDirectorW.png'
  } else if (positionStr.includes('경찰') || positionStr.includes('경감')) {
    return '/images/advisors/defaultPoliceM.png'
  } else if (positionStr.includes('약사')) {
    return '/images/advisors/defaultPharmacistW.png'
  } else {
    return '/images/advisors/defaultProfessorM.png' // 기본값
  }
}

/**
 * 자문위원의 직책에 따라 표시할 제목을 결정하는 함수
 * @param position 직책 배열 또는 문자열
 * @returns 표시할 제목
 */
export const getAdvisorTitle = (position: string[] | string = []): string => {
  const positionArray = Array.isArray(position) ? position : [position].filter(Boolean)
  const positionStr = positionArray.join(' ')
  
  if (positionStr.includes('교수')) return '교수'
  if (positionStr.includes('원장')) return '원장'
  if (positionStr.includes('대표')) return '대표'
  if (positionStr.includes('약사')) return '약사'
  if (positionStr.includes('경찰') || positionStr.includes('경감')) return '경찰'
  return '전문가'
}