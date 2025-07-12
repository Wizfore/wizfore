import { useState } from 'react'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
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
  
  const prefix = category ? `${category}_` : ''
  return `${prefix}${baseName}_${timestamp}_${random}.${extension}`
}

/**
 * 업로드 경로를 생성합니다.
 * @param category - 카테고리
 * @param fileName - 파일명
 * @returns Firebase Storage 경로
 */
export function generateUploadPath(category: string, fileName: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  
  return `news/images/${category}/${year}/${month}/${fileName}`
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
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.')
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.')
    }

    // 이미지 압축
    const compressedFile = await compressImage(file)
    
    // 파일명 생성
    const fileName = generateUniqueFileName(file.name, options.category)
    const uploadPath = generateUploadPath(options.category || 'general', fileName)
    
    // Storage 참조 생성
    const storageRef = ref(storage, uploadPath)
    
    // 업로드 실행
    if (options.onProgress) {
      // 진행률을 추적하는 업로드
      const uploadTask = uploadBytesResumable(storageRef, compressedFile)
      
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
      const snapshot = await uploadBytes(storageRef, compressedFile)
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