'use client'

import { CheckCircle, Database } from 'lucide-react'

interface ProgressDialogProps {
  isOpen: boolean
  title: string
  currentStep: string
  completed: number
  total: number
  isCompleted?: boolean
}

export default function ProgressDialog({
  isOpen,
  title,
  currentStep,
  completed,
  total,
  isCompleted = false
}: ProgressDialogProps) {
  if (!isOpen) return null

  const progressPercentage = Math.round((completed / total) * 100)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        
        {/* 다이얼로그 */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-6">
            <div className="text-center">
              {isCompleted ? (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Database className="h-6 w-6 text-blue-600 animate-pulse" />
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {isCompleted ? '모든 작업이 완료되었습니다!' : `진행 중: ${currentStep}`}
              </p>
              
              {/* 프로그레스 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500">
                {completed}/{total} ({progressPercentage}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}