import React from 'react'
import { Save, RotateCcw, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  error?: string | null
  saveStatus?: 'idle' | 'success' | 'error'
  hasChanges?: boolean
  saving?: boolean
  onSave?: () => void
  onReset?: () => void
  actions?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  error,
  saveStatus = 'idle',
  hasChanges = false,
  saving = false,
  onSave,
  onReset,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="text-red-700">
              {error.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
          {hasChanges && (
            <p className="text-sm text-amber-600 mt-1">⚠️ 저장하지 않은 변경사항이 있습니다</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">저장되었습니다</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">저장에 실패했습니다</span>
            </div>
          )}
          
          {onReset && (
            <button
              onClick={onReset}
              disabled={!hasChanges || saving}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              <span>되돌리기</span>
            </button>
          )}
          
          {onSave && (
            <button
              onClick={onSave}
              disabled={!hasChanges || saving}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? '저장 중...' : '저장하기'}</span>
            </button>
          )}
          
          {actions}
        </div>
      </div>
    </div>
  )
}