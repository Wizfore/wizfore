import { useRef, useEffect, useCallback } from 'react'
import { deleteImage } from '@/lib/services/storageService'

/**
 * 이미지 업로드 후 저장하지 않고 페이지를 떠날 때 자동으로 업로드된 이미지를 정리하는 훅
 */
export function useImageCleanup() {
  const uploadedImagesRef = useRef<Set<string>>(new Set())

  /**
   * 업로드된 이미지 URL을 추적 목록에 추가
   */
  const trackUploadedImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      uploadedImagesRef.current.add(imageUrl)
      console.log('이미지 추적 시작:', imageUrl)
    }
  }, [])

  /**
   * 추적 목록에서 이미지 URL 제거 (저장 성공 시 사용)
   */
  const stopTrackingImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      uploadedImagesRef.current.delete(imageUrl)
      console.log('이미지 추적 중단:', imageUrl)
    }
  }, [])

  /**
   * 모든 추적 중인 이미지 정리 중단 (저장 성공 시 사용)
   */
  const stopTrackingAllImages = useCallback(() => {
    uploadedImagesRef.current.clear()
    console.log('모든 이미지 추적 중단')
  }, [])

  /**
   * 추적 중인 이미지들을 Storage에서 삭제
   */
  const cleanupUploadedImages = useCallback(async (imagesToClean?: Set<string>) => {
    const imageUrls = Array.from(imagesToClean || uploadedImagesRef.current)
    
    if (imageUrls.length === 0) {
      return
    }

    console.log('이미지 정리 시작:', imageUrls)
    
    for (const imageUrl of imageUrls) {
      try {
        await deleteImage(imageUrl)
        console.log('정리된 이미지:', imageUrl)
      } catch (error) {
        console.warn('이미지 정리 실패:', imageUrl, error)
      }
    }
    
    console.log(`${imageUrls.length}개 이미지 정리 완료`)
  }, [])

  /**
   * 수동으로 정리 작업 수행 (저장하지 않음 버튼 클릭 시 사용)
   */
  const performCleanup = useCallback(async () => {
    if (uploadedImagesRef.current.size > 0) {
      await cleanupUploadedImages(uploadedImagesRef.current)
      uploadedImagesRef.current.clear()
    }
  }, [cleanupUploadedImages])

  // 컴포넌트 언마운트 시 자동 정리
  useEffect(() => {
    return () => {
      if (uploadedImagesRef.current.size > 0) {
        // 비동기 작업이지만 컴포넌트가 언마운트되므로 Promise를 기다리지 않음
        cleanupUploadedImages(uploadedImagesRef.current).catch(console.warn)
      }
    }
  }, [cleanupUploadedImages])

  return {
    trackUploadedImage,
    stopTrackingImage,
    stopTrackingAllImages,
    performCleanup,
    getTrackedImages: () => Array.from(uploadedImagesRef.current)
  }
}