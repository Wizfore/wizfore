'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AVAILABLE_ICONS } from '@/lib/utils/iconMapper'

interface IconDropdownProps {
  value: string
  onChange: (iconName: string) => void
  className?: string
}

export default function IconDropdown({ value, onChange, className = '' }: IconDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 현재 선택된 아이콘 찾기
  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value) || AVAILABLE_ICONS[0]
  const SelectedIconComponent = selectedIcon.component

  const handleIconSelect = (iconName: string) => {
    onChange(iconName)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* 드롭다운 트리거 버튼 */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <SelectedIconComponent className="h-4 w-4" />
          <span className="text-sm">{selectedIcon.label}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </Button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 드롭다운 내용 */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 p-3">
              {AVAILABLE_ICONS.map((icon) => {
                const IconComponent = icon.component
                const isSelected = icon.name === value
                
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => handleIconSelect(icon.name)}
                    className={`
                      flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-colors
                      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${isSelected ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'text-gray-700'}
                    `}
                    title={icon.label}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="truncate w-full text-center">{icon.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}