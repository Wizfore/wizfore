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

// 문의 타입 정의
export interface Inquiry {
  id?: string
  name: string
  phone: string
  email: string
  category: string
  message: string
  status: 'unread' | 'replied' | 'resolved'
  adminNote?: string
  replyContent?: string
  createdAt?: Timestamp
  repliedAt?: Timestamp | null
}

const COLLECTION_NAME = 'inquiries'

// 모든 문의 가져오기
export async function getAllInquiries(): Promise<Inquiry[]> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const inquiriesRef = collection(db, COLLECTION_NAME)
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Inquiry))
  } catch (error) {
    console.error('문의 목록 조회 오류:', error)
    throw error
  }
}

// 상태별 문의 가져오기
export async function getInquiriesByStatus(status: Inquiry['status']): Promise<Inquiry[]> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const inquiriesRef = collection(db, COLLECTION_NAME)
    const q = query(
      inquiriesRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Inquiry))
  } catch (error) {
    console.error('상태별 문의 조회 오류:', error)
    throw error
  }
}

// 특정 문의 가져오기
export async function getInquiry(id: string): Promise<Inquiry | null> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Inquiry
    } else {
      return null
    }
  } catch (error) {
    console.error('문의 조회 오류:', error)
    throw error
  }
}

// 새 문의 추가 (고객이 작성)
export async function addInquiry(inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'repliedAt'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const inquiriesRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(inquiriesRef, {
      ...inquiryData,
      status: 'unread',
      createdAt: serverTimestamp(),
      repliedAt: null
    })
    
    console.log('문의 추가 완료, ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('문의 추가 오류:', error)
    throw error
  }
}

// 문의 답변하기
export async function replyToInquiry(id: string, replyContent: string, adminNote?: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      status: 'replied',
      replyContent,
      adminNote: adminNote || '',
      repliedAt: serverTimestamp()
    })
    
    console.log('문의 답변 완료, ID:', id)
  } catch (error) {
    console.error('문의 답변 오류:', error)
    throw error
  }
}

// 문의 상태 변경
export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      status,
      ...(status === 'resolved' && { repliedAt: serverTimestamp() })
    })
    
    console.log('문의 상태 변경 완료, ID:', id)
  } catch (error) {
    console.error('문의 상태 변경 오류:', error)
    throw error
  }
}

// 문의 삭제
export async function deleteInquiry(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    console.log('문의 삭제 완료, ID:', id)
  } catch (error) {
    console.error('문의 삭제 오류:', error)
    throw error
  }
}

// 미답변 문의 수 가져오기
export async function getUnreadInquiriesCount(): Promise<number> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized')
    }
    
    const inquiriesRef = collection(db, COLLECTION_NAME)
    const q = query(inquiriesRef, where('status', '==', 'unread'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.size
  } catch (error) {
    console.error('미답변 문의 수 조회 오류:', error)
    throw error
  }
}