import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { FacilityCategory, FacilityImage } from '@/types'

const COLLECTION_NAME = 'aboutInfo'
const DOCUMENT_ID = 'main'

/**
 * 시설 카테고리 관련 서비스 함수들
 */
export const facilityService = {
  /**
   * 모든 시설 데이터 조회 (히어로 포함)
   */
  async getFacilities() {
    try {
      const db = getFirebaseDb(); if (!db) {
        throw new Error('Firebase not initialized')
      }
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          hero: data.facilities?.hero || {
            title: "센터 둘러보기",
            description: "다양한 시설과 환경을 만나보세요",
            imageUrl: "",
            defaultImageUrl: "/images/hero/defaultHero.jpg"
          },
          categories: data.facilities?.categories || [],
          images: data.facilities?.images || []
        }
      }
      return { 
        hero: {
          title: "센터 둘러보기",
          description: "다양한 시설과 환경을 만나보세요",
          imageUrl: "",
          defaultImageUrl: "/images/hero/defaultHero.jpg"
        },
        categories: [], 
        images: [] 
      }
    } catch (error) {
      console.error('시설 데이터 조회 실패:', error)
      throw error
    }
  },

  /**
   * 히어로 섹션 데이터만 조회
   */
  async getHeroData() {
    try {
      const db = getFirebaseDb(); if (!db) {
        throw new Error('Firebase not initialized')
      }
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data.facilities?.hero || {
          title: "센터 둘러보기",
          description: "다양한 시설과 환경을 만나보세요",
          imageUrl: "",
          defaultImageUrl: "/images/hero/defaultHero.jpg"
        }
      }
      return {
        title: "센터 둘러보기",
        description: "다양한 시설과 환경을 만나보세요",
        imageUrl: "",
        defaultImageUrl: "/images/hero/defaultHero.jpg"
      }
    } catch (error) {
      console.error('히어로 데이터 조회 실패:', error)
      throw error
    }
  },

  /**
   * 카테고리 추가
   */
  async addCategory(category: Omit<FacilityCategory, 'id'>) {
    try {
      const facilities = await this.getFacilities()
      const newId = `category_${Date.now()}`
      const newCategory: FacilityCategory = {
        ...category,
        id: newId
      }

      const updatedCategories = [...facilities.categories, newCategory]
      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: updatedCategories, 
        images: facilities.images 
      })
      
      return newCategory
    } catch (error) {
      console.error('카테고리 추가 실패:', error)
      throw error
    }
  },

  /**
   * 카테고리 수정
   */
  async updateCategory(categoryId: string, updates: Partial<Omit<FacilityCategory, 'id'>>) {
    try {
      const facilities = await this.getFacilities()
      const updatedCategories = facilities.categories.map((category: FacilityCategory) =>
        category.id === categoryId ? { ...category, ...updates } : category
      )

      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: updatedCategories, 
        images: facilities.images 
      })
    } catch (error) {
      console.error('카테고리 수정 실패:', error)
      throw error
    }
  },

  /**
   * 카테고리 삭제 (연결된 이미지도 함께 삭제)
   */
  async deleteCategory(categoryId: string) {
    try {
      const facilities = await this.getFacilities()
      const updatedCategories = facilities.categories.filter((category: FacilityCategory) => 
        category.id !== categoryId
      )
      const updatedImages = facilities.images.filter((image: FacilityImage) => 
        image.categoryId !== categoryId
      )

      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: updatedCategories, 
        images: updatedImages 
      })
    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
      throw error
    }
  },

  /**
   * 이미지 추가
   */
  async addImage(image: Omit<FacilityImage, 'id'>) {
    try {
      const facilities = await this.getFacilities()
      const newId = `image_${Date.now()}`
      const newImage: FacilityImage = {
        ...image,
        id: newId
      }

      const updatedImages = [...facilities.images, newImage]
      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: facilities.categories, 
        images: updatedImages 
      })
      
      return newImage
    } catch (error) {
      console.error('이미지 추가 실패:', error)
      throw error
    }
  },

  /**
   * 이미지 수정
   */
  async updateImage(imageId: string, updates: Partial<Omit<FacilityImage, 'id'>>) {
    try {
      const facilities = await this.getFacilities()
      const updatedImages = facilities.images.map((image: FacilityImage) =>
        image.id === imageId ? { ...image, ...updates } : image
      )

      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: facilities.categories, 
        images: updatedImages 
      })
    } catch (error) {
      console.error('이미지 수정 실패:', error)
      throw error
    }
  },

  /**
   * 이미지 삭제
   */
  async deleteImage(imageId: string) {
    try {
      const facilities = await this.getFacilities()
      const updatedImages = facilities.images.filter((image: FacilityImage) => 
        image.id !== imageId
      )

      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: facilities.categories, 
        images: updatedImages 
      })
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      throw error
    }
  },

  /**
   * 이미지를 다른 카테고리로 이동
   */
  async moveImageToCategory(imageId: string, newCategoryId: string) {
    try {
      await this.updateImage(imageId, { categoryId: newCategoryId })
    } catch (error) {
      console.error('이미지 카테고리 이동 실패:', error)
      throw error
    }
  },

  /**
   * 카테고리 순서 변경
   */
  async reorderCategories(categories: FacilityCategory[]) {
    try {
      const facilities = await this.getFacilities()
      await this.updateFacilities({ 
        hero: facilities.hero,
        categories, 
        images: facilities.images 
      })
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error)
      throw error
    }
  },

  /**
   * 이미지 순서 변경
   */
  async reorderImages(images: FacilityImage[]) {
    try {
      const facilities = await this.getFacilities()
      await this.updateFacilities({ 
        hero: facilities.hero,
        categories: facilities.categories, 
        images 
      })
    } catch (error) {
      console.error('이미지 순서 변경 실패:', error)
      throw error
    }
  },

  /**
   * 히어로 데이터 업데이트
   */
  async updateHero(heroData: { title: string, description: string, imageUrl: string, defaultImageUrl: string }) {
    try {
      const facilities = await this.getFacilities()
      await this.updateFacilities({
        hero: heroData,
        categories: facilities.categories,
        images: facilities.images
      })
    } catch (error) {
      console.error('히어로 데이터 업데이트 실패:', error)
      throw error
    }
  },

  /**
   * 시설 데이터 전체 업데이트 (내부 헬퍼 함수)
   */
  async updateFacilities(facilities: { 
    hero: { title: string, description: string, imageUrl: string, defaultImageUrl: string },
    categories: FacilityCategory[], 
    images: FacilityImage[] 
  }) {
    try {
      const db = getFirebaseDb(); if (!db) {
        throw new Error('Firebase not initialized')
      }
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
      await updateDoc(docRef, {
        'facilities.hero': facilities.hero,
        'facilities.categories': facilities.categories,
        'facilities.images': facilities.images
      })
    } catch (error) {
      console.error('시설 데이터 업데이트 실패:', error)
      throw error
    }
  }
}