import { useState, useEffect, useCallback, useRef } from 'react'
import { useAdminForm } from './useAdminForm'

interface UseAdminFormWithUnsavedChangesProps<T> {
  fetchData: () => Promise<T>
  saveData: (data: T) => Promise<void>
  defaultData: T
  validate?: (data: T) => string[]
  cleanData?: (data: T) => T
  onTabChange?: (callback: () => void) => void
}

interface UseAdminFormWithUnsavedChangesReturn<T> {
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  originalData: T
  loading: boolean
  saving: boolean
  saveStatus: 'idle' | 'success' | 'error'
  error: string | null
  hasChanges: boolean
  handleSave: () => Promise<void>
  handleReset: () => void
  // 새로운 기능들
  showUnsavedDialog: boolean
  handleTabChange: (nextTab: string) => void
  handleDialogSave: () => Promise<void>
  handleDialogDiscard: () => void
  handleDialogCancel: () => void
  setTabChangeCallback: (callback: () => void) => void
}

export function useAdminFormWithUnsavedChanges<T>({
  fetchData,
  saveData,
  defaultData,
  validate,
  cleanData,
  onTabChange
}: UseAdminFormWithUnsavedChangesProps<T>): UseAdminFormWithUnsavedChangesReturn<T> {
  // 기존 useAdminForm 훅 사용
  const adminForm = useAdminForm({
    fetchData,
    saveData,
    defaultData,
    validate,
    cleanData
  })

  // 새로운 상태들
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null)
  const pendingCallbackRef = useRef<(() => void) | null>(null)

  // beforeunload 이벤트 처리
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (adminForm.hasChanges) {
        e.preventDefault()
        e.returnValue = '저장되지 않은 변경사항이 있습니다. 정말로 페이지를 떠나시겠습니까?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [adminForm.hasChanges])

  // 탭 전환 처리
  const handleTabChange = useCallback((nextTab: string) => {
    if (adminForm.hasChanges) {
      setPendingTabChange(nextTab)
      setShowUnsavedDialog(true)
    } else {
      // 변경사항이 없으면 바로 탭 전환
      if (onTabChange) {
        onTabChange(() => {})
      }
    }
  }, [adminForm.hasChanges, onTabChange])

  // 다이얼로그에서 저장 선택
  const handleDialogSave = useCallback(async () => {
    try {
      await adminForm.handleSave()
      setShowUnsavedDialog(false)
      
      // 저장 완료 후 탭 전환
      if (pendingCallbackRef.current) {
        pendingCallbackRef.current()
        pendingCallbackRef.current = null
      }
      setPendingTabChange(null)
    } catch (error) {
      // 저장 실패 시 다이얼로그 유지
      console.error('저장 실패:', error)
    }
  }, [adminForm])

  // 다이얼로그에서 저장하지 않음 선택
  const handleDialogDiscard = useCallback(() => {
    adminForm.handleReset()
    setShowUnsavedDialog(false)
    
    // 변경사항 버리고 탭 전환
    if (pendingCallbackRef.current) {
      pendingCallbackRef.current()
      pendingCallbackRef.current = null
    }
    setPendingTabChange(null)
  }, [adminForm])

  // 다이얼로그에서 취소 선택
  const handleDialogCancel = useCallback(() => {
    setShowUnsavedDialog(false)
    setPendingTabChange(null)
    pendingCallbackRef.current = null
  }, [])

  // 외부에서 콜백을 설정할 수 있는 함수
  const setTabChangeCallback = useCallback((callback: () => void) => {
    pendingCallbackRef.current = callback
  }, [])

  return {
    ...adminForm,
    showUnsavedDialog,
    handleTabChange,
    handleDialogSave,
    handleDialogDiscard,
    handleDialogCancel,
    setTabChangeCallback
  }
}