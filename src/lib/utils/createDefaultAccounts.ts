import { createAdminUser } from '@/lib/services/authService'

// 기본 관리자 계정 데이터
const defaultAdminAccount = {
  email: 'admin@wizfore.com',
  password: 'wizfore123',
  displayName: '시스템 관리자',
  role: 'admin' as const
}


// 기본 관리자 계정 생성
export async function createDefaultAdminAccount() {
  console.log('기본 관리자 계정 생성 시작...')
  
  try {
    const userProfile = await createAdminUser(defaultAdminAccount)
    console.log(`✅ 관리자 계정 생성 완료: ${userProfile.email}`)
    return userProfile
  } catch (error: unknown) {
    // 이미 계정이 존재하는 경우의 에러는 무시
    if (error instanceof Error && error.message.includes('이미 사용 중인 이메일')) {
      console.log('ℹ️ 관리자 계정이 이미 존재합니다.')
      return null
    }
    
    console.error('❌ 관리자 계정 생성 오류:', error)
    throw error
  }
}


// 모든 기본 계정 생성
export async function createAllDefaultAccounts() {
  console.log('🚀 기본 관리자 계정 생성 시작...')
  
  try {
    await createDefaultAdminAccount()
    
    console.log('🎉 기본 관리자 계정 생성이 완료되었습니다!')
    return true
  } catch (error) {
    console.error('💥 기본 계정 생성 중 오류 발생:', error)
    throw error
  }
}