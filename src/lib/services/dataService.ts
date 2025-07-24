import { 
  getDoc, 
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DefaultSiteData } from '@/types'
import type { Article } from '@/types/community'

/**
 * 운영용 데이터 조회 서비스
 * Firebase DB에서 순수하게 데이터를 조회합니다. (fallback 없음)
 */

type ProgramType = {
  title: string
  goal?: string | string[]
  order?: number
}

type CategoryType = {
  id: string
  title: string
  description: string
  order?: number
  programs?: ProgramType[]
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
 * 사이트 기본 정보 업데이트
 */
export async function updateSiteInfo(updates: Partial<DefaultSiteData['siteInfo']>) {
  try {
    const docRef = doc(db, 'siteInfo', 'main')
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error('Error updating site info:', error)
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
      goal: string
      categoryTitle: string
      categoryId: string
      order: number
    }> = []

    categories.forEach((category: CategoryType) => {
      if (category.programs && category.programs.length > 0) {
        category.programs.forEach((program: ProgramType) => {
          // goal이 배열인 경우 · 문자로 연결, 문자열인 경우 그대로 사용
          const goalText = Array.isArray(program.goal) 
            ? program.goal.join(' · ')
            : program.goal || ''
          
          allPrograms.push({
            title: program.title,
            goal: goalText,
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
export async function getAdvisorsHero() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.advisors?.hero
  } catch (error) {
    console.error('Error fetching advisors hero message:', error)
    throw error
  }
}

/**
 * 히스토리 히어로 메시지 조회
 */
export async function getHistoryHero() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.history?.hero
  } catch (error) {
    console.error('Error fetching history hero message:', error)
    throw error
  }
}

/**
 * 위치 히어로 메시지 조회
 */
export async function getLocationHero() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.location?.hero
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
export async function getInquiryHero() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.inquiry?.hero
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
 * SNS 정보 업데이트
 */
export async function updateSnsData(snsData: any) {
  try {
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      sns: snsData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating SNS data:', error)
    throw error
  }
}

/**
 * 홈 설정 정보 조회
 */
export async function getHomeConfig() {
  try {
    // homeConfig와 siteInfo의 mainServices를 함께 가져오기
    const [homeConfigSnap, siteInfoSnap] = await Promise.all([
      getDoc(doc(db, 'homeConfig', 'main')),
      getDoc(doc(db, 'siteInfo', 'main'))
    ])
    
    let homeConfigData = {}
    let mainServicesData = null
    
    if (homeConfigSnap.exists()) {
      homeConfigData = homeConfigSnap.data()
    } else {
      throw new Error('Home config not found in database')
    }
    
    if (siteInfoSnap.exists()) {
      const siteInfo = siteInfoSnap.data()
      mainServicesData = siteInfo.mainServices
    }
    
    // mainServices 데이터를 homeConfig에 통합
    const result = {
      ...homeConfigData,
      sections: {
        ...(homeConfigData as any).sections,
        mainServices: mainServicesData ? {
          aboutMessage: mainServicesData.aboutMessage,
          services: mainServicesData.services,
          enabled: (homeConfigData as any).sections?.mainServices?.enabled || false,
          showSubPrograms: (homeConfigData as any).sections?.mainServices?.showSubPrograms || false
        } : undefined
      }
    }
    
    return result
  } catch (error) {
    console.error('Error fetching home config:', error)
    throw error
  }
}

/**
 * 홈 설정 정보 업데이트
 */
export async function updateHomeConfig(updates: Partial<any>) {
  try {
    const batch = writeBatch(db)
    
    // mainServices 데이터가 있다면 siteInfo와 homeConfig 모두 업데이트
    if (updates.sections?.mainServices) {
      const { enabled, showSubPrograms, aboutMessage, services } = updates.sections.mainServices
      
      // siteInfo의 mainServices 업데이트
      if (aboutMessage || services) {
        const siteInfoRef = doc(db, 'siteInfo', 'main')
        batch.update(siteInfoRef, {
          mainServices: {
            aboutMessage,
            services
          }
        })
      }
      
      // homeConfig의 섹션 설정 업데이트
      const homeConfigRef = doc(db, 'homeConfig', 'main')
      const homeConfigUpdates = {
        ...updates,
        sections: {
          ...updates.sections,
          mainServices: {
            enabled,
            showSubPrograms
          }
        }
      }
      batch.update(homeConfigRef, homeConfigUpdates)
    } else {
      // mainServices가 없다면 homeConfig만 업데이트
      const homeConfigRef = doc(db, 'homeConfig', 'main')
      batch.update(homeConfigRef, updates)
    }
    
    await batch.commit()
    console.log('Home config updated successfully')
  } catch (error) {
    console.error('Error updating home config:', error)
    throw error
  }
}

/**
 * 프로그램 아이콘 매핑 업데이트
 */
export async function updateProgramIconMappings(iconMappings: any[]) {
  try {
    const docRef = doc(db, 'homeConfig', 'main')
    await updateDoc(docRef, {
      'sections.programGrid.iconMappings': iconMappings
    })
    console.log('Program icon mappings updated successfully')
  } catch (error) {
    console.error('Error updating program icon mappings:', error)
    throw error
  }
}

/**
 * CategoryCards 섹션 설정 업데이트
 */
export async function updateCategoryCardsConfig(config: { title: string; description?: string; enabled: boolean }) {
  try {
    const docRef = doc(db, 'homeConfig', 'main')
    await updateDoc(docRef, {
      'sections.categoryCards': config
    })
    console.log('CategoryCards config updated successfully')
  } catch (error) {
    console.error('Error updating CategoryCards config:', error)
    throw error
  }
}

/**
 * 섹션별 표시/숨김 설정 업데이트
 */
export async function updateSectionVisibility(sectionName: string, enabled: boolean) {
  try {
    const docRef = doc(db, 'homeConfig', 'main')
    await updateDoc(docRef, {
      [`sections.${sectionName}.enabled`]: enabled
    })
    console.log(`${sectionName} visibility updated successfully`)
  } catch (error) {
    console.error(`Error updating ${sectionName} visibility:`, error)
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

/**
 * 특정 팀 카테고리 조회
 */
export async function getTeamCategory(categoryId: string) {
  try {
    const teamCategories = await getTeam()
    const category = teamCategories.find((cat: any) => cat.id === categoryId)
    
    if (!category) {
      throw new Error(`Team category '${categoryId}' not found`)
    }
    
    return category
  } catch (error) {
    console.error(`Error fetching team category '${categoryId}':`, error)
    throw error
  }
}

/**
 * 교사진 데이터 조회
 */
export async function getTeachers() {
  try {
    const teachersCategory = await getTeamCategory('teachers')
    return {
      members: teachersCategory.members || [],
      hero: teachersCategory.hero,
      aboutMessage: teachersCategory.aboutMessage,
      features: teachersCategory.features || []
    }
  } catch (error) {
    console.error('Error fetching teachers data:', error)
    throw error
  }
}

/**
 * 치료사진 데이터 조회
 */
export async function getTherapists() {
  try {
    const therapistsCategory = await getTeamCategory('therapists')
    return {
      members: therapistsCategory.members || [],
      hero: therapistsCategory.hero,
      aboutMessage: therapistsCategory.aboutMessage,
      features: therapistsCategory.features || []
    }
  } catch (error) {
    console.error('Error fetching therapists data:', error)
    throw error
  }
}

/**
 * 팀 카테고리 정보 업데이트
 */
export async function updateTeamCategory(categoryId: string, categoryData: any) {
  try {
    const teamCategories = await getTeam()
    const categoryIndex = teamCategories.findIndex((cat: any) => cat.id === categoryId)
    
    if (categoryIndex === -1) {
      throw new Error(`Team category '${categoryId}' not found`)
    }
    
    teamCategories[categoryIndex] = {
      ...teamCategories[categoryIndex],
      ...categoryData,
      id: categoryId // ID는 변경되지 않도록 보장
    }
    
    const siteInfoRef = doc(db, 'siteInfo', 'main')
    await updateDoc(siteInfoRef, {
      team: teamCategories,
      updatedAt: new Date().toISOString()
    })
    
    return teamCategories[categoryIndex]
  } catch (error) {
    console.error(`Error updating team category '${categoryId}':`, error)
    throw error
  }
}

/**
 * 치료사진 정보 업데이트
 */
export async function updateTherapists(therapistsData: any) {
  try {
    return await updateTeamCategory('therapists', therapistsData)
  } catch (error) {
    console.error('Error updating therapists data:', error)
    throw error
  }
}

/**
 * 교사진 정보 업데이트
 */
export async function updateTeachers(teachersData: any) {
  try {
    return await updateTeamCategory('teachers', teachersData)
  } catch (error) {
    console.error('Error updating teachers data:', error)
    throw error
  }
}

/**
 * Hero 섹션 데이터 조회
 */
export async function getHeroData() {
  try {
    const homeConfig = await getHomeConfig()
    // sections.hero 또는 기존 hero에서 데이터 가져오기
    const heroData = (homeConfig as any).sections?.hero || (homeConfig as any).hero
    const slides = heroData?.slides || []
    
    const enabledSlides = slides
      .filter((slide: any) => slide.enabled)
      .sort((a: any, b: any) => a.order - b.order)
    
    return {
      slides: enabledSlides,
      autoPlay: heroData?.autoPlay ?? true
    }
  } catch (error) {
    console.error('Error fetching hero data:', error)
    throw error
  }
}

/**
 * ProgramGrid 섹션 데이터 조회
 */
export async function getProgramsGridConfig() {
  try {
    const homeConfig = await getHomeConfig()
    // sections.programGrid 또는 기존 programs에서 데이터 가져오기
    const programsData = (homeConfig as any).sections?.programGrid || (homeConfig as any).programs
    
    return {
      title: programsData?.title || "세부 전문 프로그램",
      description: programsData?.description || "개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다",
      enabled: programsData?.enabled ?? true
    }
  } catch (error) {
    console.error('Error fetching programs grid config:', error)
    // DB 연결 실패 시 기본값 반환
    return {
      title: "세부 전문 프로그램",
      description: "개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다",
      enabled: true
    }
  }
}

/**
 * 공지사항 CRUD 함수들
 * community/main 문서의 news.articles.notices 배열을 직접 조작합니다.
 */

/**
 * 공지사항 목록 조회
 */
export async function getNotices(): Promise<Article[]> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    
    // notices 카테고리만 필터링
    const notices = allArticles.filter((article: Article) => article.category === 'notices')
    
    // 최신순으로 정렬
    return notices.sort((a: Article, b: Article) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (error) {
    console.error('Error fetching notices:', error)
    throw error
  }
}

/**
 * 특정 공지사항 조회
 */
export async function getNoticeById(id: string): Promise<Article | null> {
  try {
    const notices = await getNotices()
    return notices.find(notice => notice.id === id) || null
  } catch (error) {
    console.error('Error fetching notice by id:', error)
    throw error
  }
}

/**
 * 새 공지사항 생성
 */
export async function createNotice(noticeData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString()
    const notices = await getNotices()
    
    // 새 ID 생성 (기존 ID들 중 최대값 + 1)
    const maxId = notices.length > 0 
      ? Math.max(...notices.map(notice => parseInt(notice.id.replace('notice_', '')) || 0))
      : 0
    const newId = `notice_${maxId + 1}`
    
    const newNotice: Article = {
      id: newId,
      ...noticeData,
      category: 'notices', // 강제로 notices 카테고리 설정
      createdAt: now,
      updatedAt: now,
      publishedAt: noticeData.status === 'published' ? now : undefined
    }

    // Firebase에 새 공지사항 추가
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayUnion(newNotice)
    })

    return newId
  } catch (error) {
    console.error('Error creating notice:', error)
    throw error
  }
}

/**
 * 공지사항 업데이트
 */
export async function updateNotice(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    const articleIndex = allArticles.findIndex((article: Article) => article.id === id && article.category === 'notices')
    
    if (articleIndex === -1) {
      throw new Error('공지사항을 찾을 수 없습니다.')
    }

    const existingNotice = allArticles[articleIndex]
    const now = new Date().toISOString()
    
    // 업데이트된 공지사항 생성
    const updatedNotice: Article = {
      ...existingNotice,
      ...updates,
      id, // ID는 변경되지 않도록 보장
      category: 'notices', // 카테고리는 항상 notices로 유지
      updatedAt: now,
      publishedAt: updates.status === 'published' ? (existingNotice.publishedAt || now) : existingNotice.publishedAt
    }

    // 기존 공지사항 제거하고 업데이트된 것 추가
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayRemove(existingNotice)
    })
    
    await updateDoc(docRef, {
      'news.articles': arrayUnion(updatedNotice)
    })
  } catch (error) {
    console.error('Error updating notice:', error)
    throw error
  }
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(id: string): Promise<void> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    const noticeToDelete = allArticles.find((article: Article) => article.id === id && article.category === 'notices')
    
    if (!noticeToDelete) {
      throw new Error('삭제할 공지사항을 찾을 수 없습니다.')
    }

    // Firebase에서 공지사항 제거
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayRemove(noticeToDelete)
    })
  } catch (error) {
    console.error('Error deleting notice:', error)
    throw error
  }
}

/**
 * 공지사항 상태 변경
 */
export async function updateNoticeStatus(id: string, status: Article['status']): Promise<void> {
  try {
    const updates: Partial<Article> = { status }
    
    if (status === 'published') {
      updates.publishedAt = new Date().toISOString()
    }

    await updateNotice(id, updates)
  } catch (error) {
    console.error('Error updating notice status:', error)
    throw error
  }
}

/**
 * 발행된 공지사항만 조회
 */
export async function getPublishedNotices(): Promise<Article[]> {
  try {
    const notices = await getNotices()
    return notices.filter(notice => notice.status === 'published')
  } catch (error) {
    console.error('Error fetching published notices:', error)
    throw error
  }
}



/**
 * 범용 게시글 CRUD 함수들
 * 모든 카테고리(notices, news, events, awards, partnership)를 처리합니다.
 */

/**
 * 새 게시글 생성 (모든 카테고리)
 */
export async function createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString()
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    
    // 카테고리별로 ID 생성
    const categoryArticles = allArticles.filter((article: Article) => article.category === articleData.category)
    const maxId = categoryArticles.length > 0 
      ? Math.max(...categoryArticles.map((article: Article) => parseInt(article.id.replace(`${articleData.category}_`, '')) || 0))
      : 0
    const newId = `${articleData.category}_${maxId + 1}`
    
    const newArticle: Article = {
      id: newId,
      ...articleData,
      createdAt: now,
      updatedAt: now,
      ...(articleData.status === 'published' && { publishedAt: now })
    }

    // Firebase에 새 게시글 추가
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayUnion(newArticle)
    })

    return newId
  } catch (error) {
    console.error('Error creating article:', error)
    throw error
  }
}

/**
 * 게시글 업데이트 (모든 카테고리)
 */
export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    const articleIndex = allArticles.findIndex((article: Article) => article.id === id)
    
    if (articleIndex === -1) {
      throw new Error('게시글을 찾을 수 없습니다.')
    }

    const existingArticle = allArticles[articleIndex]
    const now = new Date().toISOString()
    
    // 업데이트된 게시글 생성 (undefined 값 제거)
    const baseArticle = {
      ...existingArticle,
      ...updates,
      id, // ID는 변경되지 않도록 보장
      updatedAt: now
    }
    
    // publishedAt 처리 (undefined 방지)
    if (updates.status === 'published') {
      baseArticle.publishedAt = existingArticle.publishedAt || now
    } else if (existingArticle.publishedAt) {
      baseArticle.publishedAt = existingArticle.publishedAt
    }
    
    const updatedArticle: Article = baseArticle

    // 기존 게시글 제거하고 업데이트된 것 추가
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayRemove(existingArticle)
    })
    
    await updateDoc(docRef, {
      'news.articles': arrayUnion(updatedArticle)
    })
  } catch (error) {
    console.error('Error updating article:', error)
    throw error
  }
}

/**
 * 게시글 삭제 (모든 카테고리)
 */
export async function deleteArticle(id: string): Promise<void> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    const articleToDelete = allArticles.find((article: Article) => article.id === id)
    
    if (!articleToDelete) {
      throw new Error('삭제할 게시글을 찾을 수 없습니다.')
    }

    // Firebase에서 게시글 제거
    const docRef = doc(db, 'community', 'main')
    await updateDoc(docRef, {
      'news.articles': arrayRemove(articleToDelete)
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    throw error
  }
}

/**
 * 특정 게시글 조회
 */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const communityData = await getCommunity()
    const allArticles = communityData?.news?.articles || []
    return allArticles.find((article: Article) => article.id === id) || null
  } catch (error) {
    console.error('Error fetching article by id:', error)
    throw error
  }
}

/**
 * 메인 서비스 정보 조회
 */
export async function getMainServices() {
  try {
    const siteInfo = await getSiteInfo()
    return siteInfo.mainServices
  } catch (error) {
    console.error('Error fetching main services:', error)
    throw error
  }
}

/**
 * 센터장 정보 업데이트
 */
export async function updateDirectorInfo(directorData: any) {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    await updateDoc(docRef, {
      director: directorData
    })
  } catch (error) {
    console.error('Error updating director info:', error)
    throw error
  }
}

/**
 * 센터 발자취 정보 업데이트
 */
export async function updateHistoryInfo(historyData: any) {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    await updateDoc(docRef, {
      history: historyData
    })
  } catch (error) {
    console.error('Error updating history info:', error)
    throw error
  }
}

/**
 * 전문 자문위원 정보 업데이트
 */
export async function updateAdvisorsInfo(advisorsData: any) {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    await updateDoc(docRef, {
      advisors: advisorsData
    })
  } catch (error) {
    console.error('Error updating advisors info:', error)
    throw error
  }
}

/**
 * 오시는 길 정보 업데이트
 */
export async function updateLocationInfo(locationData: any) {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    await updateDoc(docRef, {
      location: locationData
    })
  } catch (error) {
    console.error('Error updating location info:', error)
    throw error
  }
}

/**
 * 센터 발자취 통계 정보 조회
 */
export async function getHistoryStats() {
  try {
    const aboutInfo = await getAboutInfo()
    return aboutInfo.history?.stats
  } catch (error) {
    console.error('Error fetching history stats:', error)
    throw error
  }
}

/**
 * 센터 발자취 통계 정보 업데이트
 */
export async function updateHistoryStats(statsData: any) {
  try {
    const docRef = doc(db, 'aboutInfo', 'main')
    await updateDoc(docRef, {
      'history.stats': statsData
    })
  } catch (error) {
    console.error('Error updating history stats:', error)
    throw error
  }
}