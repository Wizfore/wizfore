import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// 프로그램 타입 정의
export interface Program {
  id?: string
  name: string
  category: 'therapy' | 'counseling' | 'afterSchool' | 'specialSports'
  targetAge: string
  duration: string
  description: string
  fullDescription?: string
  status: 'active' | 'inactive'
  featured: boolean
  image?: string
  order?: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// 통계 데이터 타입
export interface DashboardStats {
  totalPrograms: number
  totalTherapists: number
  unreadInquiries: number
  monthlyVisitors: number
}

const COLLECTION_NAME = 'programs'

// 모든 프로그램 가져오기
export async function getAllPrograms(): Promise<Program[]> {
  try {
    const programsRef = collection(db, COLLECTION_NAME)
    const q = query(programsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Program))
  } catch (error) {
    console.error('프로그램 목록 조회 오류:', error)
    throw error
  }
}

// 카테고리별 프로그램 가져오기
export async function getProgramsByCategory(category: Program['category']): Promise<Program[]> {
  try {
    const programsRef = collection(db, COLLECTION_NAME)
    const q = query(
      programsRef, 
      where('category', '==', category),
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Program))
  } catch (error) {
    console.error('카테고리별 프로그램 조회 오류:', error)
    throw error
  }
}

// 특정 프로그램 가져오기
export async function getProgram(id: string): Promise<Program | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Program
    } else {
      return null
    }
  } catch (error) {
    console.error('프로그램 조회 오류:', error)
    throw error
  }
}

// 새 프로그램 추가
export async function addProgram(programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const programsRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(programsRef, {
      ...programData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    console.log('프로그램 추가 완료, ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('프로그램 추가 오류:', error)
    throw error
  }
}

// 프로그램 수정
export async function updateProgram(id: string, programData: Partial<Program>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...programData,
      updatedAt: serverTimestamp()
    })
    
    console.log('프로그램 수정 완료, ID:', id)
  } catch (error) {
    console.error('프로그램 수정 오류:', error)
    throw error
  }
}

// 프로그램 삭제
export async function deleteProgram(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    console.log('프로그램 삭제 완료, ID:', id)
  } catch (error) {
    console.error('프로그램 삭제 오류:', error)
    throw error
  }
}

// 추천 프로그램 가져오기
export async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    const programsRef = collection(db, COLLECTION_NAME)
    const q = query(
      programsRef, 
      where('featured', '==', true),
      where('status', '==', 'active'),
      orderBy('order', 'asc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Program))
  } catch (error) {
    console.error('추천 프로그램 조회 오류:', error)
    throw error
  }
}