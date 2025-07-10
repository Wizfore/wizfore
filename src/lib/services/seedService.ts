import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  limit,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { defaultSiteData } from '@/lib/data/defaultSiteData'

/**
 * 초기 데이터 설정 전용 서비스
 * defaultSiteData를 사용하여 Firebase DB에 초기 데이터를 설정합니다.
 */

/**
 * Firebase 컬렉션에 데이터가 존재하는지 확인
 */
export async function checkCollectionExists(collectionName: string): Promise<boolean> {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, limit(1))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error(`Error checking collection ${collectionName}:`, error)
    return false
  }
}

/**
 * 카테고리의 모든 관련 컬렉션에 데이터가 존재하는지 확인
 */
export async function checkCategoryDataExists(categoryId: string): Promise<boolean> {
  const categoryCollections = getCategoryCollections(categoryId)
  
  try {
    const results = await Promise.all(
      categoryCollections.map(collectionName => checkCollectionExists(collectionName))
    )
    
    // 하나라도 데이터가 있으면 true 반환
    return results.some(exists => exists)
  } catch (error) {
    console.error(`Error checking category ${categoryId}:`, error)
    return false
  }
}

/**
 * 카테고리별 관련 컬렉션 목록 반환
 */
function getCategoryCollections(categoryId: string): string[] {
  switch (categoryId) {
    case 'site-info':
      return ['siteInfo']
    case 'about-info':
      return ['aboutInfo']
    case 'programs':
      return ['programs']
    case 'team':
      return ['team']
    case 'community':
      return ['community']
    case 'home-config':
      return ['homeConfig']
    case 'site-assets':
      return ['siteAssets']
    default:
      return []
  }
}

/**
 * 사이트 기본 정보 데이터 추가
 */
async function addSiteInfoData() {
  const { siteInfo } = defaultSiteData
  
  // 통합된 사이트 정보 데이터 추가
  await setDoc(doc(db, 'siteInfo', 'main'), {
    ...siteInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 센터 소개 데이터 추가
 */
async function addAboutInfoData() {
  const { aboutInfo } = defaultSiteData
  
  // 통합된 센터 소개 데이터 추가
  await setDoc(doc(db, 'aboutInfo', 'main'), {
    ...aboutInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 프로그램 데이터 추가
 */
async function addProgramsData() {
  const { programs } = defaultSiteData
  
  // 통합된 프로그램 데이터 추가 (defaultImageUrl 포함)
  await setDoc(doc(db, 'programs', 'main'), {
    categories: programs,
    defaultImageUrl: '/images/programs/defaultImage.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 팀(직원) 데이터 추가
 */
async function addTeamData() {
  const { team } = defaultSiteData
  
  // 통합된 팀 데이터 추가
  await setDoc(doc(db, 'team', 'main'), {
    categories: team,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 커뮤니티 데이터 추가
 */
async function addCommunityData() {
  const { community } = defaultSiteData
  
  // 통합된 커뮤니티 데이터 추가
  await setDoc(doc(db, 'community', 'main'), {
    ...community,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 홈 설정 데이터 추가
 */
async function addHomeConfigData() {
  const { homeConfig } = defaultSiteData
  
  // 홈 설정 데이터 추가
  await setDoc(doc(db, 'homeConfig', 'main'), {
    ...homeConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

/**
 * 사이트 에셋 데이터 추가
 */
// async function addSiteAssetsData() {
//   const { siteAssets } = defaultSiteData
  
//   // 사이트 에셋 데이터 추가
//   await setDoc(doc(db, 'siteAssets', 'main'), {
//     assets: siteAssets,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   })
// }

/**
 * 카테고리별 기본 데이터 추가 메인 함수
 */
export async function addDefaultDataByCategory(categoryId: string): Promise<void> {
  try {
    console.log(`Adding default data for category: ${categoryId}`)
    
    switch (categoryId) {
      case 'site-info':
        await addSiteInfoData()
        break
      case 'about-info':
        await addAboutInfoData()
        break
      case 'programs':
        await addProgramsData()
        break
      case 'team':
        await addTeamData()
        break
      case 'community':
        await addCommunityData()
        break
      case 'home-config':
        await addHomeConfigData()
        break
      // case 'site-assets':
      //   await addSiteAssetsData()
      //   break
      default:
        throw new Error(`Unknown category: ${categoryId}`)
    }
    
    console.log(`Successfully added default data for category: ${categoryId}`)
  } catch (error) {
    console.error(`Error adding default data for category ${categoryId}:`, error)
    throw error
  }
}

/**
 * 모든 카테고리의 데이터 존재 여부 확인
 */
export async function checkAllCategoriesDataStatus(): Promise<Record<string, boolean>> {
  const categories = ['site-info', 'about-info', 'programs', 'team', 'community', 'home-config', 'site-assets']
  const results: Record<string, boolean> = {}
  
  for (const categoryId of categories) {
    results[categoryId] = await checkCategoryDataExists(categoryId)
  }
  
  return results
}

/**
 * 컬렉션의 모든 문서 삭제
 */
async function deleteCollection(collectionName: string): Promise<void> {
  const collectionRef = collection(db, collectionName)
  const snapshot = await getDocs(collectionRef)
  
  if (snapshot.empty) return
  
  const batch = writeBatch(db)
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })
  
  await batch.commit()
  console.log(`Deleted all documents from ${collectionName}`)
}

/**
 * 특정 카테고리의 모든 데이터 삭제
 */
export async function deleteCategoryData(categoryId: string): Promise<void> {
  try {
    console.log(`Deleting data for category: ${categoryId}`)
    const collections = getCategoryCollections(categoryId)
    
    for (const collectionName of collections) {
      await deleteCollection(collectionName)
    }
    
    console.log(`Successfully deleted data for category: ${categoryId}`)
  } catch (error) {
    console.error(`Error deleting data for category ${categoryId}:`, error)
    throw error
  }
}

/**
 * 모든 기본 데이터 삭제
 */
export async function deleteAllDefaultData(): Promise<void> {
  try {
    console.log('Starting to delete all default data')
    
    const allCollections = [
      'siteInfo', 'aboutInfo', 'programs', 'team', 'community', 'homeConfig', 'siteAssets'
    ]
    
    // 배치 처리로 성능 향상
    const batchPromises = allCollections.map(collectionName => deleteCollection(collectionName))
    await Promise.all(batchPromises)
    
    console.log('Successfully deleted all default data')
  } catch (error) {
    console.error('Error deleting all default data:', error)
    throw error
  }
}

/**
 * 모든 기본 데이터 추가
 */
export async function addAllDefaultData(onProgress?: (completed: number, total: number, current: string) => void): Promise<void> {
  try {
    console.log('Starting to add all default data')
    
    const categories = [
      { id: 'site-info', name: '사이트 기본 정보' },
      { id: 'about-info', name: '센터 소개' },
      { id: 'programs', name: '프로그램 정보' },
      { id: 'team', name: '전문가 정보' },
      { id: 'community', name: '커뮤니티' },
      { id: 'home-config', name: '홈페이지 설정' },
      { id: 'site-assets', name: '사이트 에셋' }
    ]
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      
      if (onProgress) {
        onProgress(i, categories.length, category.name)
      }
      
      await addDefaultDataByCategory(category.id)
    }
    
    if (onProgress) {
      onProgress(categories.length, categories.length, '완료')
    }
    
    console.log('Successfully added all default data')
  } catch (error) {
    console.error('Error adding all default data:', error)
    throw error
  }
}