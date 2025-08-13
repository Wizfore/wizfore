'use client'

import { useState, useEffect, useRef } from 'react'
import { FacilitiesInfo, FacilityCategory, FacilityImage } from '@/types'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField 
} from '@/components/admin/ui'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronUp, ChevronDown, Plus, Trash2, Edit, Image as ImageIcon, Save, X } from 'lucide-react'
import { deleteFacilityImageFolder, uploadImage, deleteImage } from '@/lib/services/storageService'

interface FacilityManagementTabProps {
  data: FacilitiesInfo
  onHeroUpdate: (heroData: { title: string, description: string, imageUrl: string, defaultImageUrl: string }) => void
  onDataUpdate: (facilitiesData: FacilitiesInfo) => void
  onDataRefresh: () => void
  originalData?: FacilitiesInfo
  onCleanupRequested?: () => Promise<void>
}

export default function FacilityManagementTab({ data, onHeroUpdate, onDataUpdate, originalData, onCleanupRequested }: FacilityManagementTabProps) {
  // 새 이미지 입력 상태
  const [newImageForm, setNewImageForm] = useState({
    categoryId: '',
    description: '',
    imageUrl: ''
  })
  
  // 이미지 편집 모드 상태
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  
  // 카테고리 탭 상태
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>(() => {
    return data.categories?.[0]?.id || ''
  })

  // 새 이미지 추가 폼 표시 상태
  const [showNewImageForm, setShowNewImageForm] = useState(false)
  
  // 새 이미지 최종 ID (미리 생성)
  const [newImageId, setNewImageId] = useState<string | null>(null)

  // 새로 업로드된 이미지들을 추적하기 위한 ref
  const uploadedImagesRef = useRef<Set<string>>(new Set())

  // 다음 이미지 ID 계산 함수
  const getNextImageId = (): string => {
    const existingIds = (data.images || []).map(img => parseInt(img.id)).filter(id => !isNaN(id))
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0
    return String(maxId + 1)
  }

  // 새로 업로드된 이미지 감지
  const detectNewlyUploadedImages = () => {
    const newImages = new Set<string>()
    
    if (!originalData) return newImages
    
    // 히어로 이미지 확인 - 원본과 다르면 새로 업로드된 것으로 간주
    if (data.hero?.imageUrl && 
        data.hero.imageUrl !== originalData.hero?.imageUrl &&
        data.hero.imageUrl.trim() !== '') {
      newImages.add(data.hero.imageUrl)
    }
    
    // 갤러리 이미지들 확인
    if (data.images && originalData.images) {
      data.images.forEach(currentImage => {
        const originalImage = originalData.images.find(orig => orig.id === currentImage.id)
        
        if (currentImage.imageUrl && currentImage.imageUrl.trim() !== '') {
          if (!originalImage) {
            // 완전히 새로운 이미지 - 새 이미지 URL을 정리 대상에 추가
            newImages.add(currentImage.imageUrl)
          } else if (originalImage.imageUrl !== currentImage.imageUrl) {
            // 기존 이미지가 변경된 경우 - 새 이미지 URL을 정리 대상에 추가
            // (기존 이미지는 handleImageUpload에서 이미 삭제됨)
            newImages.add(currentImage.imageUrl)
          }
        }
      })
    }
    
    // 새 이미지 추가 폼의 임시 이미지도 확인
    if (newImageForm.imageUrl && newImageForm.imageUrl.trim() !== '') {
      newImages.add(newImageForm.imageUrl)
    }
    
    return newImages
  }

  // 업로드된 이미지들 정리
  const cleanupUploadedImages = async (imagesToClean: Set<string>) => {
    const imageUrls = Array.from(imagesToClean)
    for (const imageUrl of imageUrls) {
      try {
        await deleteImage(imageUrl)
        console.log('정리된 이미지:', imageUrl)
      } catch (error) {
        console.warn('이미지 정리 실패 (무시됨):', imageUrl, error)
      }
    }
  }

  // 카테고리가 변경되면 선택된 탭도 업데이트
  useEffect(() => {
    if (data.categories && data.categories.length > 0) {
      const currentTabExists = data.categories.some(cat => cat.id === selectedCategoryTab)
      if (!currentTabExists) {
        setSelectedCategoryTab(data.categories[0].id)
      }
    }
  }, [data.categories, selectedCategoryTab])

  // 선택된 탭이 변경되면 새 이미지 폼의 카테고리도 업데이트
  useEffect(() => {
    if (selectedCategoryTab && !newImageForm.categoryId) {
      setNewImageForm(prev => ({ ...prev, categoryId: selectedCategoryTab }))
    }
  }, [selectedCategoryTab, newImageForm.categoryId])

  // 새로 업로드된 이미지들 추적
  useEffect(() => {
    if (originalData) {
      const newlyUploadedImages = detectNewlyUploadedImages()
      uploadedImagesRef.current = newlyUploadedImages
    }
  }, [data, originalData])

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (uploadedImagesRef.current.size > 0) {
        // 비동기 작업이지만 컴포넌트가 언마운트되므로 Promise를 기다리지 않음
        cleanupUploadedImages(uploadedImagesRef.current).catch(console.warn)
      }
    }
  }, [])

  // 클린업 함수 정의 및 외부 노출
  const performCleanup = async () => {
    if (uploadedImagesRef.current.size > 0) {
      await cleanupUploadedImages(uploadedImagesRef.current)
      uploadedImagesRef.current.clear()
    }
  }

  // 외부에서 클린업 함수에 접근할 수 있도록 ref를 통해 전달
  useEffect(() => {
    if (onCleanupRequested) {
      // 부모 컴포넌트에서 클린업 함수를 호출할 수 있도록 참조 전달
      (window as { __facilityCleanup?: () => Promise<void> }).__facilityCleanup = performCleanup
    }
    
    return () => {
      delete (window as { __facilityCleanup?: () => Promise<void> }).__facilityCleanup
    }
  }, [])
  
  
  // Hero 섹션 업데이트
  const updateHero = (field: string, value: string) => {
    const updatedHero = {
      ...data.hero,
      [field]: value
    }
    onHeroUpdate(updatedHero)
  }

  // 카테고리 배열 업데이트
  const updateCategories = (categories: FacilityCategory[]) => {
    // 순서 재정렬
    const updatedCategories = categories.map((category, idx) => ({
      ...category,
      order: idx + 1
    }))

    onDataUpdate({
      ...data,
      categories: updatedCategories
    })
  }

  // 카테고리 순서 위로 이동
  const moveCategoryUp = (index: number) => {
    if (index <= 0) return
    
    const categories = [...(data.categories || [])]
    const [movedCategory] = categories.splice(index, 1)
    categories.splice(index - 1, 0, movedCategory)
    
    updateCategories(categories)
    
    // 이동된 카테고리가 현재 선택된 탭이라면 탭도 업데이트
    if (selectedCategoryTab === movedCategory.id) {
      // 탭 순서가 변경되므로 그대로 유지
    }
  }

  // 카테고리 순서 아래로 이동
  const moveCategoryDown = (index: number) => {
    if (index >= (data.categories?.length || 0) - 1) return
    
    const categories = [...(data.categories || [])]
    const [movedCategory] = categories.splice(index, 1)
    categories.splice(index + 1, 0, movedCategory)
    
    updateCategories(categories)
    
    // 이동된 카테고리가 현재 선택된 탭이라면 탭도 업데이트
    if (selectedCategoryTab === movedCategory.id) {
      // 탭 순서가 변경되므로 그대로 유지
    }
  }

  // 카테고리 추가
  const addCategory = (newCategory: FacilityCategory) => {
    const categoryWithOrder = {
      ...newCategory,
      id: newCategory.id || '',
      name: newCategory.name || '새 카테고리',
      order: (data.categories?.length || 0) + 1
    }

    updateCategories([...(data.categories || []), categoryWithOrder])
  }

  // 카테고리 제거
  const removeCategory = (index: number) => {
    const categoryToDelete = data.categories?.[index]
    if (!categoryToDelete) return

    // 해당 카테고리에 속한 이미지가 있는지 확인
    const categoryImages = (data.images || []).filter(img => img.categoryId === categoryToDelete.id)
    
    if (categoryImages.length > 0) {
      alert(`'${categoryToDelete.name}' 카테고리에 ${categoryImages.length}개의 이미지가 있습니다.\n먼저 이미지를 모두 삭제한 후 카테고리를 삭제해주세요.`)
      return
    }

    const confirmMessage = `'${categoryToDelete.name}' 카테고리를 삭제하시겠습니까?`
    if (!window.confirm(confirmMessage)) return

    // 카테고리 제거 (이미지는 이미 없음이 확인됨)
    const updatedCategories = (data.categories || []).filter((_, i) => i !== index)
    
    onDataUpdate({
      ...data,
      categories: updatedCategories
    })
  }


  // 카테고리 업데이트
  const updateCategory = (index: number, updatedCategory: FacilityCategory) => {
    const categories = [...(data.categories || [])]
    const oldCategoryId = categories[index].id
    const newCategoryId = updatedCategory.id.trim()
    
    // ID가 변경된 경우 중복 검사
    if (oldCategoryId !== newCategoryId) {
      const isDuplicateId = categories.some((cat, i) => 
        i !== index && cat.id === newCategoryId
      )
      if (isDuplicateId) {
        alert('이미 존재하는 카테고리 ID입니다.')
        return
      }
    }

    categories[index] = {
      ...updatedCategory,
      id: newCategoryId,
      name: updatedCategory.name
    }
    
    // 카테고리 ID가 변경된 경우, 해당 카테고리에 속한 이미지들의 categoryId도 업데이트
    let updatedImages = data.images || []
    if (oldCategoryId !== newCategoryId) {
      updatedImages = updatedImages.map(image => 
        image.categoryId === oldCategoryId 
          ? { ...image, categoryId: newCategoryId }
          : image
      )
      
    }
    
    // 카테고리와 이미지를 함께 업데이트
    onDataUpdate({
      ...data,
      categories: categories.map((category, idx) => ({
        ...category,
        order: idx + 1
      })),
      images: updatedImages
    })
    
    // 선택된 탭도 업데이트 (현재 선택된 카테고리의 ID가 변경된 경우)
    if (selectedCategoryTab === oldCategoryId && oldCategoryId !== newCategoryId) {
      setSelectedCategoryTab(newCategoryId)
    }
  }

  // 이미지 배열 업데이트
  const updateImages = (images: FacilityImage[]) => {
    onDataUpdate({
      ...data,
      images: images
    })
  }

  // 새 이미지 추가 (통합 폼에서)
  const addNewImage = async () => {
    const categoryId = newImageForm.categoryId || selectedCategoryTab
    if (!categoryId || !newImageForm.imageUrl.trim() || !newImageId) return

    // 해당 카테고리 이미지들의 마지막 순서 계산
    const categoryImages = (data.images || []).filter(img => img.categoryId === categoryId)
    const nextOrder = categoryImages.length > 0 
      ? Math.max(...categoryImages.map(img => img.order)) + 1 
      : 1

    const newImage: FacilityImage = {
      id: newImageId,
      description: newImageForm.description || '',
      imageUrl: newImageForm.imageUrl.trim(),
      categoryId: categoryId,
      order: nextOrder
    }

    // 새 이미지가 추가된 데이터로 업데이트 (임시 마커 제거)
    const updatedData = {
      ...data,
      images: [...(data.images || []), newImage]
    }
    // _hasNewImageFormChanges 마커 제거
    delete (updatedData as typeof updatedData & { _hasNewImageFormChanges?: boolean })._hasNewImageFormChanges
    onDataUpdate(updatedData)
    
    // 폼 초기화 및 폼 숨기기
    setNewImageForm({
      categoryId: selectedCategoryTab,
      description: '',
      imageUrl: ''
    })
    setNewImageId(null)
    setShowNewImageForm(false)
  }

  // 새 이미지 추가 폼 취소
  const cancelNewImageForm = async () => {
    // 업로드된 이미지가 있으면 해당 ID 폴더 정리
    if (newImageId && newImageForm.imageUrl) {
      try {
        await deleteFacilityImageFolder(newImageId)
      } catch (error) {
        console.warn('이미지 폴더 정리 실패 (무시됨):', error)
      }
    }
    
    // 폼 취소 시 임시 변경사항 마커 제거
    const updatedData = { ...data }
    delete (updatedData as typeof updatedData & { _hasNewImageFormChanges?: boolean })._hasNewImageFormChanges
    onDataUpdate(updatedData)
    
    setNewImageForm({
      categoryId: selectedCategoryTab,
      description: '',
      imageUrl: ''
    })
    setNewImageId(null)
    setShowNewImageForm(false)
  }



  // 카테고리 내에서 이미지 순서 위로 이동
  const moveImageUpInCategory = (imageId: string, categoryId: string) => {
    const categoryImages = (data.images || [])
      .filter(img => img.categoryId === categoryId)
      .sort((a, b) => a.order - b.order)
    
    const currentIndex = categoryImages.findIndex(img => img.id === imageId)
    
    if (currentIndex <= 0) {
      return
    }
    
    // 카테고리 내에서 배열 순서 변경
    const reorderedCategoryImages = [...categoryImages]
    const [movedImage] = reorderedCategoryImages.splice(currentIndex, 1)
    reorderedCategoryImages.splice(currentIndex - 1, 0, movedImage)
    
    // 새로운 order 값 할당 (1부터 시작)
    const updatedCategoryImages = reorderedCategoryImages.map((img, idx) => ({
      ...img,
      order: idx + 1
    }))
    
    // 전체 이미지 배열에서 해당 카테고리 이미지들만 업데이트
    const allImages = (data.images || []).map(img => {
      const updatedImg = updatedCategoryImages.find(catImg => catImg.id === img.id)
      return updatedImg || img
    })
    
    updateImages(allImages)
  }

  // 카테고리 내에서 이미지 순서 아래로 이동
  const moveImageDownInCategory = (imageId: string, categoryId: string) => {
    const categoryImages = (data.images || [])
      .filter(img => img.categoryId === categoryId)
      .sort((a, b) => a.order - b.order)
    
    const currentIndex = categoryImages.findIndex(img => img.id === imageId)
    
    if (currentIndex === -1 || currentIndex >= categoryImages.length - 1) {
      return
    }
    
    // 카테고리 내에서 배열 순서 변경
    const reorderedCategoryImages = [...categoryImages]
    const [movedImage] = reorderedCategoryImages.splice(currentIndex, 1)
    reorderedCategoryImages.splice(currentIndex + 1, 0, movedImage)
    
    // 새로운 order 값 할당 (1부터 시작)
    const updatedCategoryImages = reorderedCategoryImages.map((img, idx) => ({
      ...img,
      order: idx + 1
    }))
    
    // 전체 이미지 배열에서 해당 카테고리 이미지들만 업데이트
    const allImages = (data.images || []).map(img => {
      const updatedImg = updatedCategoryImages.find(catImg => catImg.id === img.id)
      return updatedImg || img
    })
    
    updateImages(allImages)
  }

  // 이미지 삭제
  const removeImageById = async (imageId: string) => {
    if (!window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) return

    const updatedImages = (data.images || []).filter(img => img.id !== imageId)
    updateImages(updatedImages)
    
    // 해당 이미지의 Storage 폴더 삭제
    try {
      await deleteFacilityImageFolder(imageId)
    } catch (error) {
      console.warn('이미지 폴더 삭제 실패 (무시됨):', error)
    }
  }

  // 이미지 업데이트
  const updateImageById = (imageId: string, updatedData: Partial<FacilityImage>) => {
    const images = [...(data.images || [])]
    const index = images.findIndex(img => img.id === imageId)
    if (index === -1) return
    
    images[index] = {
      ...images[index],
      ...updatedData,
      description: updatedData.description !== undefined ? updatedData.description : images[index].description
    }
    
    updateImages(images)
  }

  // 이미지 파일 업로드 처리
  const handleImageUpload = async (imageId: string, file: File) => {
    try {
      // 기존 이미지 URL 확인
      const currentImage = data.images?.find(img => img.id === imageId)
      const oldImageUrl = currentImage?.imageUrl
      
      // ID 기반 폴더에 이미지 업로드
      const imageUrl = await uploadImage(file, { 
        category: `pages/about/facilities/image/${imageId}` 
      })
      
      // 새 이미지 URL로 업데이트된 이미지 배열 생성
      const updatedImages = (data.images || []).map(img => 
        img.id === imageId ? { ...img, imageUrl } : img
      )
      
      // 부모 컴포넌트로 전체 데이터 동기화 (변경사항 감지를 위해)
      onDataUpdate({
        ...data,
        images: updatedImages
      })
      
      // 기존 이미지가 있고 새 이미지와 다르면 기존 이미지를 삭제
      if (oldImageUrl && oldImageUrl !== imageUrl && oldImageUrl.trim() !== '') {
        try {
          await deleteImage(oldImageUrl)
          console.log('기존 이미지 삭제 완료:', oldImageUrl)
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패 (무시됨):', oldImageUrl, deleteError)
        }
      }
      
      console.log('이미지 업로드 완료:', file.name)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  // 카테고리 옵션 생성
  const categoryOptions = (data.categories || []).map(cat => ({ 
    value: cat.id, 
    label: cat.name 
  }))

  // 카테고리 이름 가져오기
  const getCategoryName = (categoryId: string) => {
    return data.categories?.find(cat => cat.id === categoryId)?.name || '알 수 없음'
  }

  // 선택된 카테고리의 이미지들만 필터링
  const getFilteredImages = () => {
    return (data.images || [])
      .filter(img => img.categoryId === selectedCategoryTab)
      .sort((a, b) => a.order - b.order)
  }

  // 편집 모드 핸들러
  const startEditingImage = (imageId: string) => {
    setEditingImageId(imageId)
  }

  const cancelEditingImage = () => {
    setEditingImageId(null)
  }

  const saveImageEdit = (_imageId: string) => {
    setEditingImageId(null)
  }

  return (
    <div className="space-y-8">
      {/* Hero 섹션 */}
      <AdminSection title="히어로 섹션" description="센터 둘러보기 페이지의 상단 섹션을 관리합니다">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="제목"
            value={data.hero?.title || ''}
            onChange={(value) => updateHero('title', value)}
            placeholder="센터 둘러보기"
          />
          <AdminTextarea
            label="설명"
            value={data.hero?.description || ''}
            onChange={(value) => updateHero('description', value)}
            placeholder="다양한 시설과 환경을 만나보세요"
            rows={3}
          />
        </div>
        <AdminImageUploadField
          label="히어로 이미지"
          value={data.hero?.imageUrl}
          onChange={(imageUrl: string) => updateHero('imageUrl', imageUrl)}
          folder="pages/about/facilities/hero"
          defaultImageUrl={data.hero?.defaultImageUrl}
        />
      </AdminSection>

      {/* 카테고리 관리 */}
      <AdminSection title="카테고리 관리" description="시설 카테고리를 추가하고 관리합니다">
        <div className="space-y-4">
          {/* 카테고리 목록 */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    카테고리 목록
                  </h3>
                  <p className="text-sm text-gray-600">
                    총 {(data.categories || []).length}개의 카테고리가 있습니다.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const newCategory: FacilityCategory = { id: '', name: '', order: (data.categories?.length || 0) + 1 }
                    addCategory(newCategory)
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  새 카테고리
                </Button>
              </div>
            </div>
            <div className="p-6">
              {(data.categories || []).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-lg font-medium mb-2">카테고리가 없습니다</p>
                  <p className="text-sm">새 카테고리를 추가하여 시설 이미지를 분류해보세요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(data.categories || []).map((category, index) => {
                    const categoryImageCount = (data.images || []).filter(img => img.categoryId === category.id).length
                    
                    return (
                      <div key={`category-${index}`} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveCategoryUp(index)}
                                  disabled={index === 0}
                                  className="h-5 w-5 p-0 hover:bg-gray-200"
                                  title="위로 이동"
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveCategoryDown(index)}
                                  disabled={index === (data.categories || []).length - 1}
                                  className="h-5 w-5 p-0 hover:bg-gray-200"
                                  title="아래로 이동"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {category.name || '이름 없는 카테고리'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                ID: {category.id || '미설정'} • {categoryImageCount}개 이미지
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCategory(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="카테고리 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              카테고리 ID
                            </label>
                            <input
                              type="text"
                              value={category.id}
                              onChange={(e) => updateCategory(index, { ...category, id: e.target.value })}
                              placeholder="예: therapy, counseling"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              카테고리명
                            </label>
                            <input
                              type="text"
                              value={category.name}
                              onChange={(e) => {
                                updateCategory(index, { ...category, name: e.target.value })
                              }}
                              placeholder="카테고리명을 입력하세요"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminSection>

      {/* 이미지 관리 */}
      <AdminSection title="이미지 관리" description="카테고리별로 시설 이미지를 관리합니다">
        {categoryOptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>먼저 카테고리를 추가해주세요.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 카테고리 탭 및 이미지 목록 */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      이미지 목록
                    </h3>
                    <p className="text-sm text-gray-600">
                      총 {(data.images || []).length}개의 이미지가 있습니다.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const imageId = getNextImageId()
                      setNewImageId(imageId)
                      setNewImageForm(prev => ({ 
                        ...prev, 
                        categoryId: selectedCategoryTab || '',
                        description: '',
                        imageUrl: ''
                      }))
                      setShowNewImageForm(true)
                      // 새 이미지 폼을 열면 변경사항으로 감지
                      onDataUpdate({
                        ...data,
                        _hasNewImageFormChanges: true
                      } as typeof data & { _hasNewImageFormChanges?: boolean })
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    이미지 추가
                  </Button>
                </div>
                
                {/* 새 이미지 추가 폼 */}
                {showNewImageForm && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        새 이미지 추가
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AdminImageUploadField
                          label="이미지 추가"
                          value={newImageForm.imageUrl}
                          onChange={(imageUrl) => {
                            setNewImageForm(prev => ({ ...prev, imageUrl }))
                            // 새 이미지 추가 폼에서 이미지 업로드 시 변경사항으로 감지되도록 부모 컴포넌트에 알림
                            if (imageUrl) {
                              onDataUpdate({
                                ...data,
                                // 임시 변경사항 마커 추가 (실제로는 저장되지 않음)
                                _hasNewImageFormChanges: true
                              } as typeof data & { _hasNewImageFormChanges?: boolean })
                            }
                          }}
                          folder={newImageId ? `pages/about/facilities/image/${newImageId}` : 'pages/about/facilities/temp'}
                          defaultImageUrl="/images/facilities/defaultFacility.jpg"
                        />
                        <AdminInput
                          label="이미지 설명 (선택사항)"
                          value={newImageForm.description}
                          onChange={(value) => {
                            setNewImageForm(prev => ({ ...prev, description: value }))
                            // 설명 입력 시에도 변경사항으로 감지
                            onDataUpdate({
                              ...data,
                              _hasNewImageFormChanges: true
                            } as typeof data & { _hasNewImageFormChanges?: boolean })
                          }}
                          placeholder="이미지 설명을 입력하세요 (선택사항)"
                          className="!mb-0"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 선택</label>
                          <select 
                            value={newImageForm.categoryId || selectedCategoryTab}
                            onChange={(e) => {
                              setNewImageForm(prev => ({ ...prev, categoryId: e.target.value }))
                              // 카테고리 선택 시에도 변경사항으로 감지
                              onDataUpdate({
                                ...data,
                                _hasNewImageFormChanges: true
                              } as typeof data & { _hasNewImageFormChanges?: boolean })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelNewImageForm}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          취소
                        </Button>
                        <Button
                          type="button"
                          onClick={addNewImage}
                          disabled={!newImageForm.categoryId || !newImageForm.imageUrl.trim()}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          추가
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 카테고리 탭 */}
                {data.categories && data.categories.length > 0 && (
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {data.categories.map((category) => {
                      const categoryImageCount = (data.images || []).filter(img => img.categoryId === category.id).length
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategoryTab(category.id)}
                          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            selectedCategoryTab === category.id
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>{category.name}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              selectedCategoryTab === category.id
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {categoryImageCount}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="p-6">
                {getFilteredImages().length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {selectedCategoryTab ? `${getCategoryName(selectedCategoryTab)} 카테고리에 등록된 이미지가 없습니다.` : '등록된 이미지가 없습니다.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>썸네일</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead>카테고리</TableHead>
                          <TableHead>순서</TableHead>
                          <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredImages()
                          .map((image, index) => {
                            return (
                              <TableRow key={image.id}>
                                <TableCell>
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                      src={image.imageUrl}
                                      alt={image.description}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/facilities/defaultFacility.jpg'
                                      }}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                  {editingImageId === image.id ? (
                                    <input
                                      type="text"
                                      value={image.description}
                                      onChange={(e) => {
                                        updateImageById(image.id, { description: e.target.value })
                                      }}
                                      placeholder="이미지 설명"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                  ) : (
                                    <div className="py-2 px-3 text-sm">
                                      {image.description || ''}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingImageId === image.id ? (
                                    <select
                                      value={image.categoryId}
                                      onChange={(e) => updateImageById(image.id, { categoryId: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {categoryOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {getCategoryName(image.categoryId)}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 min-w-[2rem]">
                                      {index + 1}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveImageUpInCategory(image.id, image.categoryId)}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0 hover:bg-gray-100"
                                        title="위로 이동"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveImageDownInCategory(image.id, image.categoryId)}
                                        disabled={index === getFilteredImages().length - 1}
                                        className="h-6 w-6 p-0 hover:bg-gray-100"
                                        title="아래로 이동"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {editingImageId === image.id ? (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => saveImageEdit(image.id)}
                                          className="text-green-600 hover:text-green-700"
                                          title="저장"
                                        >
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={cancelEditingImage}
                                          className="text-gray-600 hover:text-gray-700"
                                          title="취소"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => startEditingImage(image.id)}
                                          title="편집"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const input = document.createElement('input')
                                            input.type = 'file'
                                            input.accept = 'image/*'
                                            input.onchange = (e) => {
                                              const file = (e.target as HTMLInputElement).files?.[0]
                                              if (file) {
                                                handleImageUpload(image.id, file)
                                              }
                                            }
                                            input.click()
                                          }}
                                          title="이미지 변경"
                                        >
                                          <ImageIcon className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeImageById(image.id)}
                                          className="text-red-600 hover:text-red-700"
                                          title="이미지 삭제"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminSection>
    </div>
  )
}