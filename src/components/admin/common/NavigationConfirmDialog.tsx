import React from 'react'
import { AlertTriangle, X, ArrowRight } from 'lucide-react'

interface NavigationConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
}

export function NavigationConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "페이지 이동 확인",
  message = "저장하지 않은 변경사항이 있습니다. 페이지를 이동하시겠습니까?"
}: NavigationConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              취소
            </button>
            
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              이동하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}