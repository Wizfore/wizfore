'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationContextType {
  // 저장되지 않은 변경사항이 있는지 여부
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (hasChanges: boolean) => void
  
  // 안전한 내비게이션 함수
  safeNavigate: (url: string) => void
  
  // 확인 다이얼로그 상태
  showNavigationDialog: boolean
  setShowNavigationDialog: (show: boolean) => void
  
  // 대기 중인 URL
  pendingUrl: string | null
  
  // 다이얼로그 액션
  confirmNavigation: () => void
  cancelNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showNavigationDialog, setShowNavigationDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  const safeNavigate = useCallback((url: string) => {
    if (hasUnsavedChanges) {
      setPendingUrl(url)
      setShowNavigationDialog(true)
    } else {
      router.push(url)
    }
  }, [hasUnsavedChanges, router])

  const confirmNavigation = useCallback(() => {
    if (pendingUrl) {
      setHasUnsavedChanges(false)
      setShowNavigationDialog(false)
      router.push(pendingUrl)
      setPendingUrl(null)
    }
  }, [pendingUrl, router])

  const cancelNavigation = useCallback(() => {
    setShowNavigationDialog(false)
    setPendingUrl(null)
  }, [])

  const value: NavigationContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    safeNavigate,
    showNavigationDialog,
    setShowNavigationDialog,
    pendingUrl,
    confirmNavigation,
    cancelNavigation
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}