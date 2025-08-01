import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminArrayFieldProps, AdminUITokens, cn } from '@/types/admin-ui'
import { AdminFormField } from './AdminFormField'
import { Button } from '@/components/ui/button'

/**
 * 관리자 페이지에서 사용하는 통일된 배열 필드 컴포넌트
 * 배열 형태의 데이터를 관리하며, 추가/삭제/수정 기능을 제공합니다.
 * 
 * @example
 * // 간단한 문자열 배열 관리
 * <AdminArrayField
 *   label="전문 분야"
 *   items={specializations}
 *   onAdd={(item) => setSpecializations([...specializations, item])}
 *   onRemove={(index) => setSpecializations(specializations.filter((_, i) => i !== index))}
 *   onUpdate={(index, item) => {
 *     const updated = [...specializations]
 *     updated[index] = item
 *     setSpecializations(updated)
 *   }}
 *   newItemDefault=""
 *   placeholder="전문 분야를 입력하세요"
 * />
 * 
 * @example
 * // 커스텀 렌더링을 사용한 복잡한 객체 배열 관리
 * <AdminArrayField
 *   label="교육 과정"
 *   items={educations}
 *   onAdd={handleAddEducation}
 *   onRemove={handleRemoveEducation}
 *   onUpdate={handleUpdateEducation}
 *   newItemDefault={{ school: '', degree: '', year: '' }}
 *   renderItem={(item, index, onUpdate) => (
 *     <div className="grid grid-cols-3 gap-2">
 *       <input
 *         type="text"
 *         value={item.school}
 *         onChange={(e) => onUpdate({ ...item, school: e.target.value })}
 *         placeholder="학교명"
 *         className={AdminUITokens.input.base}
 *       />
 *       <input
 *         type="text"
 *         value={item.degree}
 *         onChange={(e) => onUpdate({ ...item, degree: e.target.value })}
 *         placeholder="학위"
 *         className={AdminUITokens.input.base}
 *       />
 *       <input
 *         type="text"
 *         value={item.year}
 *         onChange={(e) => onUpdate({ ...item, year: e.target.value })}
 *         placeholder="졸업년도"
 *         className={AdminUITokens.input.base}
 *       />
 *     </div>
 *   )}
 * />
 */
export function AdminArrayField<T = string>({
  label,
  items,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  renderItem,
  newItemDefault,
  className
}: AdminArrayFieldProps<T>) {
  const [newItem, setNewItem] = useState<T>(newItemDefault)

  const handleAdd = () => {
    onAdd(newItem)
    setNewItem(newItemDefault)
  }

  const handleUpdate = (index: number, updatedItem: T) => {
    onUpdate(index, updatedItem)
  }

  return (
    <AdminFormField label={label} className={className}>
      <div className={AdminUITokens.spacing.small}>
        {/* 기존 아이템들 */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {renderItem ? (
              <div className="flex-1">
                {renderItem(item, index, (updatedItem) => handleUpdate(index, updatedItem))}
              </div>
            ) : (
              <input
                type="text"
                value={item as string}
                onChange={(e) => handleUpdate(index, e.target.value as T)}
                className={cn(AdminUITokens.input.base, 'flex-1')}
                placeholder={placeholder || `${label} ${index + 1}`}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              title="항목 삭제"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* 새 아이템 추가 */}
        <div className="flex items-center gap-2">
          {renderItem ? (
            <div className="flex-1">
              {renderItem(newItem, -1, setNewItem)}
            </div>
          ) : (
            <input
              type="text"
              value={newItem as string}
              onChange={(e) => setNewItem(e.target.value as T)}
              placeholder={placeholder || `새 ${label} 추가`}
              className={cn(AdminUITokens.input.base, 'flex-1')}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={
              typeof newItem === 'string' 
                ? !newItem.trim() 
                : false // 객체의 경우 별도 검증 로직 필요
            }
            title="항목 추가"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* 전체 추가 버튼 (선택적) */}
        {items.length === 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            className="w-full mt-2"
            disabled={
              typeof newItem === 'string' 
                ? !newItem.trim() 
                : false
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            첫 번째 {label} 추가
          </Button>
        )}
      </div>
    </AdminFormField>
  )
}