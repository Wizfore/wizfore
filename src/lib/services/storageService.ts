"use client"

import { useState } from 'react'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
  listAll
} from 'firebase/storage'
import { storage } from '@/lib/firebase'

export interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  progress: number
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void
  category?: string
}

/**
 * 이미지를 압축합니다.
 * @param file - 압축할 이미지 파일
 * @param maxWidth - 최대 너비 (기본값: 1200)
 * @param quality - 압축 품질 (기본값: 0.8)
 * @returns 압축된 파일
 */
export function compressImage(
  file: File, 
  maxWidth: number = 1200, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 비율을 유지하면서 크기 조정
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

      // blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('이미지 압축에 실패했습니다.'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 사이트 에셋에 최적화된 이미지 리사이즈를 수행합니다.
 * @param file - 리사이즈할 이미지 파일
 * @param category - 에셋 카테고리 (favicon, logo)
 * @returns 리사이즈된 파일
 */
export function resizeForSiteAsset(
  file: File, 
  category: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      let targetWidth: number
      let targetHeight: number
      let quality = 0.9

      if (category.includes('favicon')) {
        // 파비콘: 32x32 고정
        targetWidth = 32
        targetHeight = 32
        quality = 1.0 // 파비콘은 최고 품질
      } else if (category.includes('logo')) {
        // 로고: 높이 60px 기준으로 비율 유지
        const maxHeight = 60
        const ratio = Math.min(maxHeight / img.height, 1) // 확대는 하지 않음
        targetWidth = img.width * ratio
        targetHeight = img.height * ratio
      } else {
        // 기본값
        targetWidth = img.width
        targetHeight = img.height
      }

      canvas.width = targetWidth
      canvas.height = targetHeight

      // 고품질 리사이즈를 위한 설정
      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight)

      // blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('이미지 리사이즈에 실패했습니다.'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 고유한 파일명을 생성합니다.
 * @param originalName - 원본 파일명
 * @param category - 카테고리 (선택사항)
 * @returns 고유한 파일명
 */
export function generateUniqueFileName(originalName: string, category?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')
  
  // 커뮤니티 뉴스 기사의 경우 카테고리를 파일명에 포함하지 않음 (경로에서 관리)
  if (category && category.startsWith('pages/community/news/')) {
    return `${baseName}_${timestamp}_${random}.${extension}`
  }
  
  // 시설 관련 이미지의 경우 카테고리를 파일명에 포함하지 않음 (경로에서 관리)
  if (category && category.startsWith('pages/about/facilities/')) {
    return `${baseName}_${timestamp}_${random}.${extension}`
  }
  
  const prefix = category ? `${category}_` : ''
  return `${prefix}${baseName}_${timestamp}_${random}.${extension}`
}

/**
 * 업로드 경로를 생성합니다.
 * @param category - 카테고리 (예: 'pages/about/director/hero', 'pages/community/news/{articleId}', 'site-assets/favicon')
 * @param fileName - 파일명
 * @returns Firebase Storage 경로
 */
export function generateUploadPath(category: string, fileName: string): string {
  // 사이트 에셋인 경우 날짜 구분 없이 저장
  if (category.startsWith('site-assets/')) {
    return `${category}/${fileName}`
  }
  
  // 커뮤니티 뉴스 기사인 경우 articleId별로 저장
  if (category.startsWith('pages/community/news/')) {
    // category 형태: 'pages/community/news/{articleId}' 또는 'pages/community/news/1'
    return `${category}/${fileName}`
  }
  
  // 페이지별 콘텐츠인 경우 해당 경로에 저장
  if (category.startsWith('pages/')) {
    return `${category}/${fileName}`
  }
  
  // 기존 호환성을 위한 legacy 경로 처리
  const legacyMappings: Record<string, string> = {
    // About 페이지 관련
    'about-director-hero': 'pages/about/director/hero',
    'about-director': 'pages/about/director',
    'about-advisors-hero': 'pages/about/advisors/hero',
    'about-advisors': 'pages/about/advisors',
    'about-history-hero': 'pages/about/history/hero',
    'about-history': 'pages/about/history',
    'about-location-hero': 'pages/about/location/hero',
    'about-location': 'pages/about/location',
    'about-facilities-hero': 'pages/about/facilities/hero',
    'about-facilities': 'pages/about/facilities',
    
    // Programs 페이지 관련
    'programs-therapy-hero': 'pages/programs/therapy/hero',
    'programs-therapy': 'pages/programs/therapy',
    'programs-counseling-hero': 'pages/programs/counseling/hero',
    'programs-counseling': 'pages/programs/counseling',
    'programs-adult-day-hero': 'pages/programs/adult-day/hero',
    'programs-adult-day': 'pages/programs/adult-day',
    'programs-afterschool-hero': 'pages/programs/afterschool/hero',
    'programs-afterschool': 'pages/programs/afterschool',
    'programs-sports-hero': 'pages/programs/sports/hero',
    'programs-sports': 'pages/programs/sports',
    
    // Team 페이지 관련
    'team-therapists-hero': 'pages/team/therapists/hero',
    'team-therapists': 'pages/team/therapists',
    'team-teachers-hero': 'pages/team/teachers/hero',
    'team-teachers': 'pages/team/teachers',
    
    // Community 페이지 관련
    'community-hero': 'pages/community/news/hero',
    'community': 'pages/community/news',
    
    // Contact 페이지 관련
    'contact-hero': 'pages/contact/hero',
    'contact': 'pages/contact',
    
    // Home 페이지 관련
    'home-hero': 'pages/home/hero',
    'home': 'pages/home'
  }
  
  // Legacy 매핑이 있는 경우 새 경로로 변환
  if (legacyMappings[category]) {
    return `${legacyMappings[category]}/${fileName}`
  }
  
  // 매핑되지 않은 legacy 카테고리는 기본 경로로 저장
  return `legacy/${category}/${fileName}`
}

/**
 * 이미지를 Firebase Storage에 업로드합니다.
 * @param file - 업로드할 파일
 * @param options - 업로드 옵션
 * @returns 다운로드 URL
 */
export async function uploadImage(
  file: File, 
  options: UploadOptions = {}
): Promise<string> {
  try {
    // Firebase Storage 초기화 확인
    if (!storage) {
      throw new Error('Firebase Storage가 초기화되지 않았습니다.')
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.')
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.')
    }

    // 이미지 처리: 사이트 에셋은 특별한 리사이즈, 일반 이미지는 압축
    let processedFile: File
    if (options.category?.startsWith('site-assets/')) {
      processedFile = await resizeForSiteAsset(file, options.category)
    } else {
      processedFile = await compressImage(file)
    }
    
    // 파일명 생성
    const fileName = generateUniqueFileName(file.name, options.category)
    const uploadPath = generateUploadPath(options.category || 'general', fileName)
    
    // Storage 참조 생성
    const storageRef = ref(storage, uploadPath)
    
    // 업로드 실행
    if (options.onProgress) {
      // 진행률을 추적하는 업로드
      const uploadTask = uploadBytesResumable(storageRef, processedFile)
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            }
            options.onProgress?.(progress)
          },
          (error) => {
            console.error('업로드 오류:', error)
            reject(new Error('파일 업로드에 실패했습니다.'))
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadURL)
            } catch (error) {
              reject(new Error('다운로드 URL 생성에 실패했습니다.'))
            }
          }
        )
      })
    } else {
      // 일반 업로드
      const snapshot = await uploadBytes(storageRef, processedFile)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    }
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    throw error
  }
}

/**
 * Firebase Storage에서 이미지를 삭제합니다.
 * @param url - 삭제할 이미지의 다운로드 URL
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Firebase Storage 초기화 확인
    if (!storage) {
      throw new Error('Firebase Storage가 초기화되지 않았습니다.')
    }

    // URL에서 파일 경로 추출
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`
    if (!url.startsWith(baseUrl)) {
      throw new Error('유효하지 않은 Firebase Storage URL입니다.')
    }
    
    const encodedPath = url.replace(baseUrl, '').split('?')[0]
    const filePath = decodeURIComponent(encodedPath)
    
    // Storage 참조 생성 및 삭제
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
    
    console.log('이미지 삭제 완료:', filePath)
  } catch (error) {
    console.error('이미지 삭제 오류:', error)
    throw error
  }
}

/**
 * 여러 이미지를 병렬로 업로드합니다.
 * @param files - 업로드할 파일 배열
 * @param options - 업로드 옵션
 * @returns 다운로드 URL 배열
 */
export async function uploadMultipleImages(
  files: File[], 
  options: UploadOptions = {}
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, options))
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('다중 이미지 업로드 오류:', error)
    throw error
  }
}

/**
 * 이미지 업로드를 위한 React Hook
 */
export function useImageUpload(category?: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<string> => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const url = await uploadImage(file, {
        category,
        onProgress: (progressData) => {
          setProgress(progressData.progress)
        }
      })
      
      setProgress(100)
      return url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.'
      setError(errorMessage)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    upload,
    uploading,
    progress,
    error,
    reset
  }
}

/**
 * Firebase Storage 폴더 전체를 삭제합니다.
 * @param folderPath - 삭제할 폴더 경로 (예: 'pages/community/news/article-123')
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  try {
    // Firebase Storage 초기화 확인
    if (!storage) {
      throw new Error('Firebase Storage가 초기화되지 않았습니다.')
    }

    console.log(`폴더 삭제 시작: ${folderPath}`)
    
    const folderRef = ref(storage, folderPath)
    const result = await listAll(folderRef)
    
    if (result.items.length === 0) {
      console.log(`폴더가 비어있거나 존재하지 않습니다: ${folderPath}`)
      return
    }
    
    // 모든 파일을 병렬로 삭제
    const deletePromises = result.items.map(async (item) => {
      try {
        await deleteObject(item)
        console.log(`파일 삭제 완료: ${item.name}`)
      } catch (error) {
        console.error(`파일 삭제 실패: ${item.name}`, error)
        throw error
      }
    })
    
    await Promise.all(deletePromises)
    console.log(`폴더 삭제 완료: ${folderPath} (${result.items.length}개 파일)`)
    
  } catch (error) {
    console.error(`폴더 삭제 오류: ${folderPath}`, error)
    throw new Error(`폴더 삭제에 실패했습니다: ${folderPath}`)
  }
}

/**
 * 커뮤니티 뉴스 기사의 모든 이미지를 삭제합니다.
 * @param articleId - 기사 ID
 */
export async function deleteArticleImages(articleId: string): Promise<void> {
  const folderPath = `pages/community/news/${articleId}`
  await deleteFolder(folderPath)
}

/**
 * 여러 이미지 URL 목록에서 삭제된 이미지들을 Storage에서 제거합니다.
 * @param previousImages - 이전 이미지 URL 목록
 * @param currentImages - 현재 이미지 URL 목록
 */
export async function cleanupRemovedImages(
  previousImages: string[], 
  currentImages: string[]
): Promise<void> {
  try {
    const removedImages = previousImages.filter(prevUrl => 
      !currentImages.includes(prevUrl)
    )
    
    if (removedImages.length === 0) {
      return
    }
    
    console.log(`제거된 이미지 정리 시작: ${removedImages.length}개`)
    
    const deletePromises = removedImages.map(async (imageUrl) => {
      try {
        await deleteImage(imageUrl)
        console.log(`제거된 이미지 정리 완료: ${imageUrl}`)
      } catch (error) {
        console.warn(`이미지 정리 실패 (무시됨): ${imageUrl}`, error)
        // 이미 삭제된 이미지이거나 접근 불가능한 경우 무시
      }
    })
    
    await Promise.all(deletePromises)
    console.log(`이미지 정리 작업 완료: ${removedImages.length}개 처리`)
    
  } catch (error) {
    console.error('이미지 정리 작업 오류:', error)
    // 정리 작업 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}

/**
 * 임시 기사 폴더의 이미지들을 실제 기사 ID 폴더로 이동합니다.
 * @param tempArticleId - 임시 기사 ID
 * @param realArticleId - 실제 기사 ID
 */
/**
 * 예약된 게시글 ID의 Storage 폴더를 삭제합니다.
 * 게시글 작성 취소 시 사용됩니다.
 */
export async function cleanupReservedArticleId(reservedId: string): Promise<void> {
  try {
    const folderPath = `pages/community/news/${reservedId}`
    console.log(`🧹 예약된 ID Storage 정리 시작: ${reservedId}`)
    await deleteFolder(folderPath)
    console.log(`✅ 예약된 ID Storage 정리 완료: ${reservedId}`)
  } catch (error) {
    console.warn(`⚠️  예약된 ID Storage 정리 실패 (무시됨): ${reservedId}`, error)
    // 정리 실패는 무시 (이미 없을 수도 있음)
  }
}

/**
 * 시설 이미지의 Storage 폴더를 삭제합니다.
 * @param imageId - 시설 이미지 ID
 */
export async function deleteFacilityImageFolder(imageId: string): Promise<void> {
  try {
    const folderPath = `pages/about/facilities/image/${imageId}`
    console.log(`🧹 시설 이미지 Storage 정리 시작: ${imageId}`)
    await deleteFolder(folderPath)
    console.log(`✅ 시설 이미지 Storage 정리 완료: ${imageId}`)
  } catch (error) {
    console.warn(`⚠️  시설 이미지 Storage 정리 실패 (무시됨): ${imageId}`, error)
    // 정리 실패는 무시 (이미 없을 수도 있음)
  }
}

/**
 * 임시 시설 이미지의 Storage 폴더를 삭제합니다.
 * @param tempId - 임시 이미지 ID
 */
export async function cleanupTempFacilityImage(tempId: string): Promise<void> {
  try {
    const folderPath = `pages/about/facilities/temp-${tempId}`
    console.log(`🧹 임시 시설 이미지 Storage 정리 시작: ${tempId}`)
    await deleteFolder(folderPath)
    console.log(`✅ 임시 시설 이미지 Storage 정리 완료: ${tempId}`)
  } catch (error) {
    console.warn(`⚠️  임시 시설 이미지 Storage 정리 실패 (무시됨): ${tempId}`, error)
    // 정리 실패는 무시 (이미 없을 수도 있음)
  }
}

