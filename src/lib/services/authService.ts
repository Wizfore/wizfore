import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// 사용자 역할 타입
export type UserRole = 'admin' | 'staff' | 'viewer'

// 사용자 프로필 타입
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt?: Date | null | object
  lastLogin?: Date | null | object
  isActive: boolean
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string
  password: string
}

// 회원가입 요청 타입
export interface SignupRequest {
  email: string
  password: string
  displayName: string
  role: UserRole
}

// 이메일/비밀번호로 로그인
export async function loginWithEmail({ email, password }: LoginRequest): Promise<UserProfile> {
  try {
    if (!auth) {
      throw new Error('인증 서비스가 초기화되지 않았습니다.')
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Firestore에서 사용자 프로필 가져오기
    const userProfile = await getUserProfile(user.uid)
    
    if (!userProfile) {
      throw new Error('사용자 프로필을 찾을 수 없습니다.')
    }

    if (!userProfile.isActive) {
      throw new Error('비활성화된 계정입니다. 관리자에게 문의하세요.')
    }

    // 마지막 로그인 시간 업데이트
    await updateLastLogin(user.uid)

    console.log('로그인 성공:', userProfile)
    return userProfile
  } catch (error: unknown) {
    console.error('로그인 오류:', error)
    
    // Firebase 에러 메시지를 한국어로 변환
    const errorCode = error instanceof Error && 'code' in error ? (error as { code: string }).code : 'unknown'
    const errorMessage = getKoreanErrorMessage(errorCode)
    throw new Error(errorMessage)
  }
}

// 로그아웃
export async function logout(): Promise<void> {
  try {
    if (!auth) {
      throw new Error('인증 서비스가 초기화되지 않았습니다.')
    }
    
    await signOut(auth)
    console.log('로그아웃 성공')
  } catch (error) {
    console.error('로그아웃 오류:', error)
    throw new Error('로그아웃 중 오류가 발생했습니다.')
  }
}

// 새 관리자 계정 생성 (기존 관리자만 가능)
export async function createAdminUser({ email, password, displayName, role }: SignupRequest): Promise<UserProfile> {
  try {
    if (!auth || !db) {
      throw new Error('Firebase 서비스가 초기화되지 않았습니다.')
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 프로필 업데이트
    await updateProfile(user, {
      displayName: displayName
    })

    // Firestore에 사용자 프로필 저장
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      role: role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    console.log('관리자 계정 생성 성공:', userProfile)
    return userProfile
  } catch (error: unknown) {
    console.error('계정 생성 오류:', error)
    
    const errorCode = error instanceof Error && 'code' in error ? (error as { code: string }).code : 'unknown'
    const errorMessage = getKoreanErrorMessage(errorCode)
    throw new Error(errorMessage)
  }
}

// 사용자 프로필 가져오기
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!db) {
      console.error('Firestore가 초기화되지 않았습니다.')
      return null
    }
    
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    } else {
      return null
    }
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error)
    return null
  }
}

// 마지막 로그인 시간 업데이트
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    if (!db) {
      console.error('Firestore가 초기화되지 않았습니다.')
      return
    }
    
    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, {
      lastLogin: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('마지막 로그인 시간 업데이트 오류:', error)
  }
}

// 인증 상태 변경 리스너
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    console.error('Auth가 초기화되지 않았습니다.')
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// 현재 사용자 가져오기
export function getCurrentUser(): User | null {
  if (!auth) {
    console.error('Auth가 초기화되지 않았습니다.')
    return null
  }
  return auth.currentUser
}

// Firebase 에러 코드를 한국어 메시지로 변환
function getKoreanErrorMessage(errorCode: string): string {
  const errorMessages: { [key: string]: string } = {
    'auth/invalid-email': '올바르지 않은 이메일 주소입니다.',
    'auth/user-disabled': '사용이 중단된 계정입니다.',
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자리 이상이어야 합니다.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
    'auth/requires-recent-login': '보안을 위해 다시 로그인해주세요.'
  }

  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.'
}

// 관리자 권한 확인
export function hasAdminPermission(userProfile: UserProfile | null): boolean {
  return userProfile?.role === 'admin' && userProfile?.isActive === true
}

// 직원 이상 권한 확인
export function hasStaffPermission(userProfile: UserProfile | null): boolean {
  return userProfile?.isActive === true && 
         (userProfile?.role === 'admin' || userProfile?.role === 'staff')
}