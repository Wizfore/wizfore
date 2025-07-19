import React from 'react'
import { LucideIcon } from 'lucide-react'
import { AdminTabs, TabItem } from './AdminTabs'
import { UnsavedChangesDialog } from './UnsavedChangesDialog'

interface AdminTabsWithUnsavedChangesProps<T extends string> {
  tabs: TabItem<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  className?: string
  // 변경사항 확인 관련 props
  hasChanges?: boolean
  showUnsavedDialog?: boolean
  onDialogSave?: () => Promise<void>
  onDialogDiscard?: () => void
  onDialogCancel?: () => void
  saving?: boolean
}

export function AdminTabsWithUnsavedChanges<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  hasChanges = false,
  showUnsavedDialog = false,
  onDialogSave,
  onDialogDiscard,
  onDialogCancel,
  saving = false
}: AdminTabsWithUnsavedChangesProps<T>) {
  const handleTabClick = (tab: T) => {
    if (hasChanges && tab !== activeTab) {
      // 변경사항이 있고 다른 탭을 클릭한 경우
      onTabChange(tab)
    } else {
      // 변경사항이 없거나 같은 탭을 클릭한 경우
      onTabChange(tab)
    }
  }

  return (
    <>
      <AdminTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        className={className}
      />
      
      {showUnsavedDialog && onDialogSave && onDialogDiscard && onDialogCancel && (
        <UnsavedChangesDialog
          isOpen={showUnsavedDialog}
          onSave={onDialogSave}
          onDiscard={onDialogDiscard}
          onCancel={onDialogCancel}
          saving={saving}
          title="탭 전환 확인"
          message="현재 탭에서 변경사항이 있습니다. 다른 탭으로 이동하시겠습니까?"
        />
      )}
    </>
  )
}

export type { TabItem }