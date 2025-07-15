import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TabItem<T extends string> {
  key: T
  label: string
  icon: LucideIcon
}

interface AdminTabsProps<T extends string> {
  tabs: TabItem<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  className?: string
}

export function AdminTabs<T extends string>({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}: AdminTabsProps<T>) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export type { TabItem }