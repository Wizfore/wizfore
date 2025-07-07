import { 
  getDoc, 
  doc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DefaultSiteData } from '@/types'

/**
 * 운영용 데이터 조회 서비스
 * Firebase DB에서 순수하게 데이터를 조회합니다. (fallback 없음)
 */

type ProgramType = {
  title: string
  goal?: string
  order?: number
}

type CategoryType = {
  id: string
  title: string
  description: string
  order?: number
  programs?: ProgramType[]
}

type InquiryCategory = {
  value: string
  label: string
  order: number
}

/**
 * 사이트 기본 정보 조회
 */
export async function getSiteInfo() {
  try {
    const docRef = doc(db, 'siteInfo', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Site info not found in database')
    }
  } catch (error) {
    console.error('Error fetching site info:', error)
    throw error
  }
}

/**
 * 센터 소개 정보 조회
 */
export async function getAboutInfo() {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('About info not found in database')
    }
  } catch (error) {
    console.error('Error fetching about info:', error)
    throw error
  }
}

/**
 * AboutSection용 사이트 데이터 조회 (사이트명 + 원장 정보)
 */
export async function getAboutSectionData(): Promise<{
  siteName: string
  director: DefaultSiteData['aboutInfo']['director']
}> {
  try {
    const [siteInfo, aboutInfo] = await Promise.all([
      getSiteInfo(),
      getAboutInfo()
    ])
    
    return {
      siteName: siteInfo.name,
      director: aboutInfo.director
    }
  } catch (error) {
    console.error('Error fetching AboutSection data:', error)
    throw error
  }
}

/**
 * 프로그램 정보 조회
 */
export async function getPrograms() {
  try {
    const docRef = doc(db, 'programs', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.categories
    } else {
      throw new Error('Programs not found in database')
    }
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw error
  }
}

/**
 * ProgramGrid용 모든 프로그램 데이터 조회 (모든 카테고리의 프로그램들을 플랫화)
 */
export async function getAllProgramsFlattened() {
  try {
    const categories = await getPrograms()
    const allPrograms: Array<{
      title: string
      description: string
      categoryTitle: string
      categoryId: string
      order: number
    }> = []

    categories.forEach((category: CategoryType) => {
      if (category.programs && category.programs.length > 0) {
        category.programs.forEach((program: ProgramType) => {
          allPrograms.push({
            title: program.title,
            description: program.goal || category.description,
            categoryTitle: category.title,
            categoryId: category.id,
            order: program.order || 0
          })
        })
      }
    })

    // 카테고리 순서, 그 다음 프로그램 순서로 정렬
    return allPrograms.sort((a, b) => {
      const categoryA = categories.find((c: CategoryType) => c.id === a.categoryId)
      const categoryB = categories.find((c: CategoryType) => c.id === b.categoryId)
      
      if (categoryA?.order !== categoryB?.order) {
        return (categoryA?.order || 0) - (categoryB?.order || 0)
      }
      
      return a.order - b.order
    })
  } catch (error) {
    console.error('Error fetching flattened programs:', error)
    throw error
  }
}

/**
 * 자문위원 정보 조회
 */
export async function getAdvisors() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.advisors?.list
  } catch (error) {
    console.error('Error fetching advisors:', error)
    throw error
  }
}

/**
 * 자문위원 소개 메시지 조회
 */
export async function getAdvisorsAboutMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.advisors?.aboutMessage
  } catch (error) {
    console.error('Error fetching advisors about message:', error)
    throw error
  }
}

/**
 * 자문위원 히어로 메시지 조회
 */
export async function getAdvisorsHeroMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.advisors?.heroMessage
  } catch (error) {
    console.error('Error fetching advisors hero message:', error)
    throw error
  }
}

/**
 * 히스토리 히어로 메시지 조회
 */
export async function getHistoryHeroMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.history?.heroMessage
  } catch (error) {
    console.error('Error fetching history hero message:', error)
    throw error
  }
}

/**
 * 위치 히어로 메시지 조회
 */
export async function getLocationHeroMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.location?.heroMessage
  } catch (error) {
    console.error('Error fetching location hero message:', error)
    throw error
  }
}

/**
 * 위치 소개 메시지 조회
 */
export async function getLocationAboutMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.location?.aboutMessage
  } catch (error) {
    console.error('Error fetching location about message:', error)
    throw error
  }
}

/**
 * 문의 히어로 메시지 조회
 */
export async function getInquiryHeroMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.inquiry?.heroMessage
  } catch (error) {
    console.error('Error fetching inquiry hero message:', error)
    throw error
  }
}

/**
 * 문의 소개 메시지 조회
 */
export async function getInquiryAboutMessage() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.inquiry?.aboutMessage
  } catch (error) {
    console.error('Error fetching inquiry about message:', error)
    throw error
  }
}

/**
 * 문의 카테고리 조회
 */
export async function getInquiryCategories(): Promise<string[]> {
  try {
    const aboutInfo = await getAboutInfo()
    const categories = aboutInfo.inquiry?.categories
    
    if (!Array.isArray(categories)) {
      throw new Error('Invalid categories format in database')
    }
    
    return categories
  } catch (error) {
    console.error('Error fetching inquiry categories:', error)
    throw error
  }
}

/**
 * 팀(직원) 정보 조회
 */
export async function getTeam() {
  try {
    const docRef = doc(db, 'team', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.categories
    } else {
      throw new Error('Team data not found in database')
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    throw error
  }
}

/**
 * 커뮤니티 정보 조회
 */
export async function getCommunity() {
  try {
    const docRef = doc(db, 'community', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Community data not found in database')
    }
  } catch (error) {
    console.error('Error fetching community data:', error)
    throw error
  }
}

/**
 * 홈 설정 정보 조회
 */
export async function getHomeConfig() {
  try {
    const docRef = doc(db, 'homeConfig', 'main')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Home config not found in database')
    }
  } catch (error) {
    console.error('Error fetching home config:', error)
    throw error
  }
}

/**
 * History 페이지용 데이터 조회
 */
export async function getHistoryData() {
  try {
    const aboutInfoData = await getAboutInfo()
    const siteInfoData = await getSiteInfo()
    
    return {
      milestones: aboutInfoData.history?.milestones || [],
      siteName: siteInfoData.name || ''
    }
  } catch (error) {
    console.error('Error fetching history data:', error)
    throw error
  }
}

/**
 * Location 페이지용 데이터 조회
 */
export async function getLocationData() {
  try {
    const [aboutInfoData, siteInfoData] = await Promise.all([
      getAboutInfo(),
      getSiteInfo()
    ])
    
    return {
      contact: siteInfoData.contact,
      transportation: aboutInfoData.location?.transportation || [],
      siteName: siteInfoData.name,
      address: aboutInfoData.address,
      coordinates: aboutInfoData.coordinates
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    throw error
  }
}