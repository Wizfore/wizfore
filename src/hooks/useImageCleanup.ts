import { useRef, useEffect, useCallback } from 'react'
import { deleteImage } from '@/lib/services/storageService'

/**
 * 이미지 업로드 후 저장하지 않고 페이지를 떠날 때 자동으로 업로드된 이미지를 정리하는 훅
 */
export function useImageCleanup() {
  const uploadedImagesRef = useRef<Set<string>>(new Set())
  const deletedImagesRef = useRef<Set<string>>(new Set()) // 삭제 예정인 이미지들
  const isDataSavedRef = useRef<boolean>(false)

  /**
   * 업로드된 이미지 URL을 추적 목록에 추가
   */
  const trackUploadedImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      uploadedImagesRef.current.add(imageUrl)
    }
  }, [])

  /**
   * 추적 목록에서 이미지 URL 제거 (저장 성공 시 사용)
   */
  const stopTrackingImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      uploadedImagesRef.current.delete(imageUrl)
    }
  }, [])

  /**
   * 삭제 예정인 이미지 URL을 추적 목록에 추가
   */
  const trackDeletedImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      deletedImagesRef.current.add(imageUrl)
    }
  }, [])

  /**
   * 모든 추적 중인 이미지 정리 중단 (저장 성공 시 사용)
   */
  const stopTrackingAllImages = useCallback(() => {
    uploadedImagesRef.current.clear()
    deletedImagesRef.current.clear()
    isDataSavedRef.current = true
  }, [])
  
  /**
   * 데이터가 저장되었음을 표시 (저장 성공 시 사용)
   */
  const markAsSaved = useCallback(() => {
    isDataSavedRef.current = true
  }, [])

  /**
   * 추적 중인 이미지들을 Storage에서 삭제
   */
  const cleanupUploadedImages = useCallback(async (imagesToClean?: Set<string>) => {
    const imageUrls = Array.from(imagesToClean || uploadedImagesRef.current)
    
    if (imageUrls.length === 0) {
      return
    }

    for (const imageUrl of imageUrls) {
      try {
        await deleteImage(imageUrl)
      } catch (error) {
        // 이미지 정리 실패 시 무시
      }
    }
  }, [])

  /**
   * 저장 성공 시 삭제 예정인 이미지들을 실제로 삭제
   */
  const processDeletedImages = useCallback(async () => {
    if (deletedImagesRef.current.size > 0) {
      await cleanupUploadedImages(deletedImagesRef.current)
      deletedImagesRef.current.clear()
    }
  }, [cleanupUploadedImages])

  /**
   * 수동으로 정리 작업 수행 (저장하지 않음 버튼 클릭 시 사용)
   */
  const performCleanup = useCallback(async () => {
    if (uploadedImagesRef.current.size > 0) {
      await cleanupUploadedImages(uploadedImagesRef.current)
      uploadedImagesRef.current.clear()
    }
    // 삭제 예정 이미지들은 되돌리기이므로 정리하지 않음
    deletedImagesRef.current.clear()
  }, [cleanupUploadedImages])

  // 컴포넌트 언마운트 시 자동 정리 (저장되지 않은 경우에만)
  useEffect(() => {
    return () => {
      if (uploadedImagesRef.current.size > 0 && !isDataSavedRef.current) {
        // 비동기 작업이지만 컴포넌트가 언마운트되므로 Promise를 기다리지 않음
        cleanupUploadedImages(uploadedImagesRef.current).catch(() => {})
      }
    }
  }, [cleanupUploadedImages])

  return {
    trackUploadedImage,
    stopTrackingImage,
    stopTrackingAllImages,
    trackDeletedImage,
    processDeletedImages,
    markAsSaved,
    performCleanup,
    getTrackedImages: () => Array.from(uploadedImagesRef.current),
    getDeletedImages: () => Array.from(deletedImagesRef.current)
  }
}