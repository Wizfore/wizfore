import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 저장하지 않은 변경사항이 있을 때 브라우저 이탈 시 경고를 표시하는 훅
 * 
 * @param hasChanges - 변경사항 여부
 * @param enabled - 훅 활성화 여부 (기본값: true)
 */
export function useUnsavedChangesWarning(hasChanges: boolean, enabled: boolean = true) {
  const router = useRouter()

  useEffect(() => {
    if (!enabled) return

    // 브라우저 이탈 시 경고 (새로고침, 탭 닫기, 뒤로가기 등)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        // 최신 브라우저에서는 커스텀 메시지가 표시되지 않고 기본 메시지가 표시됩니다
        e.preventDefault()
        e.returnValue = '' // Chrome requires returnValue to be set
        return '' // For older browsers
      }
    }

    // popstate 이벤트로 뒤로가기/앞으로가기 감지
    const handlePopState = (e: PopStateEvent) => {
      if (hasChanges) {
        const shouldProceed = window.confirm(
          '저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?'
        )
        
        if (!shouldProceed) {
          // 사용자가 취소한 경우 원래 위치로 돌아가기
          window.history.pushState(null, '', window.location.href)
        }
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    // 페이지 가시성 변경 시 처리 (선택사항)
    const handleVisibilityChange = () => {
      if (document.hidden && hasChanges) {
        // 페이지가 숨겨질 때 변경사항이 있으면 로그 또는 다른 처리 가능
        console.warn('페이지를 떠나는 중이며 저장하지 않은 변경사항이 있습니다.')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 정리 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [hasChanges, enabled])

  // Next.js App Router를 위한 라우터 이벤트 처리
  useEffect(() => {
    if (!enabled) return

    // 페이지 이동 시 확인
    const handleRouteChange = () => {
      if (hasChanges) {
        const shouldProceed = window.confirm(
          '저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?'
        )
        
        if (!shouldProceed) {
          // 라우팅을 중단하는 방법이 App Router에서는 제한적입니다
          // 대신 사용자에게 경고만 표시하고 개발자가 추가 처리를 할 수 있도록 합니다
          throw new Error('Route change cancelled by user')
        }
      }
    }

    // App Router에서는 router.events가 제한적이므로
    // 대신 페이지 컴포넌트에서 직접 처리하는 것을 권장합니다
    
    return () => {
      // cleanup
    }
  }, [hasChanges, enabled, router])
}

/**
 * 프로그래밍 방식으로 페이지 이동 전 확인하는 함수
 * 
 * @param hasChanges - 변경사항 여부
 * @param callback - 확인 후 실행할 콜백 함수
 * @param message - 확인 메시지 (선택사항)
 */
export function confirmNavigation(
  hasChanges: boolean, 
  callback: () => void,
  message: string = '저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?'
): void {
  if (hasChanges) {
    const shouldProceed = window.confirm(message)
    if (shouldProceed) {
      callback()
    }
  } else {
    callback()
  }
}