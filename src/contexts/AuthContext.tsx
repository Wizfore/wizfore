'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { 
  onAuthStateChange, 
  getUserProfile, 
  type UserProfile 
} from '@/lib/services/authService'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 로그인된 사용자가 있으면 프로필 가져오기
          const profile = await getUserProfile(firebaseUser.uid)
          setUser(firebaseUser)
          setUserProfile(profile)
        } else {
          // 로그아웃 상태
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('인증 상태 처리 오류:', error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const isAuthenticated = !!user && !!userProfile && userProfile.isActive
  const isAdmin = userProfile?.role === 'admin' && userProfile?.isActive === true
  const isStaff = userProfile?.isActive === true && 
                 (userProfile?.role === 'admin' || userProfile?.role === 'staff')

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}