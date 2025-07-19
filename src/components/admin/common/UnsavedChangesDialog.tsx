import React from 'react'
import { AlertTriangle, Save, X } from 'lucide-react'

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onSave: () => void
  onDiscard: () => void
  onCancel: () => void
  saving?: boolean
  title?: string
  message?: string
}

export function UnsavedChangesDialog({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
  saving = false,
  title = "저장되지 않은 변경사항",
  message = "현재 페이지를 떠나면 변경사항이 손실됩니다. 어떻게 하시겠습니까?"
}: UnsavedChangesDialogProps) {
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
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              취소
            </button>
            
            <button
              onClick={onDiscard}
              disabled={saving}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50"
            >
              <X className="h-4 w-4 mr-2 inline" />
              저장하지 않음
            </button>
            
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}