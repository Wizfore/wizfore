/**
 * 이미지 fallback 처리를 위한 유틸리티 함수들
 */

/**
 * 이미지 URL과 기본 이미지 URL을 받아서 적절한 이미지 URL을 반환합니다.
 * @param imageUrl - 우선 사용할 이미지 URL
 * @param defaultImageUrl - imageUrl이 없을 때 사용할 기본 이미지 URL
 * @param fallbackPlaceholder - 모든 이미지가 없을 때 사용할 기본 placeholder
 * @returns 사용할 이미지 URL
 */
export const getImageWithFallback = (
  imageUrl?: string, 
  defaultImageUrl?: string,
  fallbackPlaceholder: string = '/icons/logo.png'
): string => {
  // 우선 imageUrl이 유효한지 확인
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl
  }
  
  // imageUrl이 없으면 defaultImageUrl 확인
  if (defaultImageUrl && defaultImageUrl.trim() !== '') {
    return defaultImageUrl
  }
  
  // 둘 다 없으면 fallback placeholder 반환
  return fallbackPlaceholder
}

/**
 * 이미지가 로드에 실패했을 때 사용할 에러 핸들러를 생성합니다.
 * @param defaultImageUrl - 에러 시 사용할 기본 이미지 URL
 * @param fallbackPlaceholder - 기본 이미지도 실패할 때 사용할 placeholder
 * @returns 이미지 에러 핸들러 함수
 */
export const createImageErrorHandler = (
  defaultImageUrl?: string,
  fallbackPlaceholder: string = '/images/default-placeholder.png'
) => {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    
    // 현재 src가 defaultImageUrl이 아니고, defaultImageUrl이 존재하면 시도
    if (target.src !== defaultImageUrl && defaultImageUrl && defaultImageUrl.trim() !== '') {
      target.src = defaultImageUrl
    } else {
      // defaultImageUrl도 실패하거나 없으면 fallback placeholder 사용
      target.src = fallbackPlaceholder
    }
  }
}

/**
 * 이미지 URL이 유효한지 확인합니다.
 * @param imageUrl - 확인할 이미지 URL
 * @returns 이미지 URL이 유효하면 true, 아니면 false
 */
export const isValidImageUrl = (imageUrl?: string): boolean => {
  return !!(imageUrl && imageUrl.trim() !== '')
}