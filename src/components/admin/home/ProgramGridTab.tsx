import React, { useState } from 'react'
import type { TabComponentProps } from './HomeManagement'
import type { ProgramIconMapping } from '@/types'
import { AVAILABLE_ICONS } from '@/lib/utils/iconMapper'
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, Save, X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminCard
} from '@/components/admin/ui'

export function ProgramGridTab({ data, setData }: TabComponentProps) {
  // 아이콘 매핑 관리 상태
  const [isIconMappingExpanded, setIsIconMappingExpanded] = useState(false)
  const [editingMapping, setEditingMapping] = useState<ProgramIconMapping | null>(null)
  const [isAddingMapping, setIsAddingMapping] = useState(false)
  const [formData, setFormData] = useState<{
    iconName: string
    categoryKeywords: string
  }>({
    iconName: '',
    categoryKeywords: ''
  })

  // 현재 iconMappings 가져오기
  const currentMappings = data?.sections?.programGrid?.iconMappings || []

  // iconMapping 추가 함수
  const handleAddMapping = () => {
    if (!formData.iconName || !formData.categoryKeywords.trim()) {
      alert('아이콘과 키워드를 모두 입력해주세요.')
      return
    }

    // 중복 iconName 체크
    if (currentMappings.some(mapping => mapping.iconName === formData.iconName)) {
      alert('이미 사용 중인 아이콘입니다.')
      return
    }

    const newMapping: ProgramIconMapping = {
      id: formData.iconName.toLowerCase(),
      categoryKeywords: formData.categoryKeywords.split(',').map(k => k.trim()).filter(k => k),
      iconName: formData.iconName,
      bgColor: 'bg-wizfore-light-beige',
      hoverColor: 'bg-wizfore-light-beige',
      order: currentMappings.length + 1
    }

    const updatedMappings = [...currentMappings, newMapping]
    updateIconMappings(updatedMappings)
    cancelAdding()
  }

  // iconMapping 수정 함수
  const handleEditMapping = (mapping: ProgramIconMapping) => {
    if (!formData.iconName || !formData.categoryKeywords.trim()) {
      alert('아이콘과 키워드를 모두 입력해주세요.')
      return
    }

    // 다른 매핑에서 같은 iconName 사용 중인지 체크
    if (currentMappings.some(m => m.id !== mapping.id && m.iconName === formData.iconName)) {
      alert('이미 사용 중인 아이콘입니다.')
      return
    }

    const updatedMapping: ProgramIconMapping = {
      ...mapping,
      id: formData.iconName.toLowerCase(),
      categoryKeywords: formData.categoryKeywords.split(',').map(k => k.trim()).filter(k => k),
      iconName: formData.iconName,
      bgColor: 'bg-wizfore-light-beige',
      hoverColor: 'bg-wizfore-light-beige'
    }

    const updatedMappings = currentMappings.map(m => 
      m.id === mapping.id ? updatedMapping : m
    )
    updateIconMappings(updatedMappings)
    setEditingMapping(null)
    resetForm()
  }

  // iconMapping 삭제 함수
  const handleDeleteMapping = (mapping: ProgramIconMapping) => {
    if (confirm(`"${mapping.iconName}" 아이콘 매핑을 삭제하시겠습니까?`)) {
      const updatedMappings = currentMappings.filter(m => m.id !== mapping.id)
      updateIconMappings(updatedMappings)
    }
  }

  // iconMappings 업데이트 함수
  const updateIconMappings = (mappings: ProgramIconMapping[]) => {
    setData(prev => ({
      ...prev!,
      sections: {
        ...prev!.sections,
        programGrid: {
          title: prev!.sections?.programGrid?.title || '',
          description: prev!.sections?.programGrid?.description || '',
          enabled: prev!.sections?.programGrid?.enabled || false,
          iconMappings: mappings
        }
      }
    }))
  }

  // 폼 리셋 함수
  const resetForm = () => {
    setFormData({ iconName: '', categoryKeywords: '' })
    setIsAddingMapping(false)
    setEditingMapping(null)
  }

  const cancelAdding = () => {
    setFormData({ iconName: '', categoryKeywords: '' })
    setIsAddingMapping(false)
  }

  // 편집 시작 함수
  const startEditing = (mapping: ProgramIconMapping) => {
    setEditingMapping(mapping)
    setFormData({
      iconName: mapping.iconName,
      categoryKeywords: mapping.categoryKeywords.join(', ')
    })
    setIsAddingMapping(false)
  }

  // 깊은 복사를 사용한 필드 업데이트 함수
  const updateField = (field: 'title' | 'description' | 'enabled', value: string | boolean) => {
    setData(prev => ({
      ...prev!,
      sections: {
        ...prev!.sections,
        programGrid: {
          title: field === 'title' ? value as string : prev!.sections?.programGrid?.title || '',
          description: field === 'description' ? value as string : prev!.sections?.programGrid?.description || '',
          enabled: field === 'enabled' ? value as boolean : prev!.sections?.programGrid?.enabled || false,
          iconMappings: prev!.sections?.programGrid?.iconMappings || []
        }
      }
    }))
  }

  // 추가 시작 함수
  const startAdding = () => {
    console.log('startAdding 함수가 호출되었습니다')
    setIsAddingMapping(true)
    setEditingMapping(null)
    setFormData({ iconName: '', categoryKeywords: '' })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">프로그램 그리드 섹션</h3>
        <p className="text-gray-600 mb-4">12개 세부 프로그램 목록 영역의 설정을 관리합니다.</p>
      </div>

      {/* 기본 섹션 설정 */}
      <AdminSection title="프로그램 그리드 섹션 설정" description="홈페이지의 세부 프로그램 그리드 섹션을 관리합니다.">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">섹션 활성화</label>
          <input 
            type="checkbox"
            checked={data?.sections?.programGrid?.enabled || false}
            onChange={(e) => updateField('enabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <AdminInput
          label="섹션 제목"
          value={data?.sections?.programGrid?.title || ''}
          onChange={(value) => updateField('title', value)}
          placeholder="세부 전문 프로그램"
          required
        />

        <AdminTextarea
          label="섹션 설명"
          value={data?.sections?.programGrid?.description || ''}
          onChange={(value) => updateField('description', value)}
          rows={3}
          placeholder="개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다"
        />
      </AdminSection>

      {/* 아이콘 매핑 관리 섹션 */}
      <AdminSection title="아이콘 매핑 관리" description="프로그램 카테고리별 아이콘 매핑을 관리합니다.">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <h4 className="text-lg font-semibold text-gray-900">아이콘 매핑 설정</h4>
              <span className="text-sm text-gray-500">
                ({currentMappings.length}개 매핑)
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsIconMappingExpanded(!isIconMappingExpanded)}
              className="flex items-center gap-2"
            >
              {isIconMappingExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  펼치기
                </>
              )}
            </Button>
          </div>
            
            {!isIconMappingExpanded && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p>프로그램 카테고리별 아이콘 매핑을 관리합니다.</p>
                <p className="mt-1">위 버튼을 클릭하여 설정을 확장하세요.</p>
              </div>
            )}

            {isIconMappingExpanded && (
              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                {/* 매핑 목록 */}
                <div className="space-y-3">
                  {currentMappings.length > 0 ? (
                    currentMappings.map((mapping) => {
                      const IconComponent = AVAILABLE_ICONS.find(icon => icon.name === mapping.iconName)?.component
                      const isEditing = editingMapping?.id === mapping.id
                      
                      return (
                        <div
                          key={mapping.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          {isEditing ? (
                            /* 편집 모드 */
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* 아이콘 선택 */}
                                <div>
                                  <label className="block text-xs font-medium mb-1">아이콘</label>
                                  <select
                                    value={formData.iconName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  >
                                    <option value="">선택하세요</option>
                                    {AVAILABLE_ICONS.map((icon) => (
                                      <option key={icon.name} value={icon.name}>
                                        {icon.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* 키워드 입력 */}
                                <div>
                                  <label className="block text-xs font-medium mb-1">키워드</label>
                                  <input
                                    type="text"
                                    value={formData.categoryKeywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, categoryKeywords: e.target.value }))}
                                    placeholder="콤마로 구분"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                              </div>

                              {/* 액션 버튼 */}
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={resetForm}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" />
                                  취소
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditMapping(mapping)}
                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                >
                                  <Save className="w-3 h-3" />
                                  저장
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* 일반 표시 모드 */
                            <div className="flex items-center gap-3">
                              {/* 아이콘 표시 */}
                              <div className="flex-shrink-0 w-10 h-10 bg-wizfore-light-beige rounded-lg flex items-center justify-center">
                                {IconComponent && (
                                  <IconComponent className="w-5 h-5 text-gray-700" />
                                )}
                              </div>
                              
                              {/* 정보 표시 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{mapping.iconName}</span>
                                  <span className="text-xs text-gray-500">#{mapping.order}</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  키워드: {mapping.categoryKeywords.join(', ')}
                                </div>
                              </div>
                              
                              {/* 액션 버튼 */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => startEditing(mapping)}
                                  className="p-1 hover:bg-gray-200 rounded text-blue-600"
                                  title="수정"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMapping(mapping)}
                                  className="p-1 hover:bg-gray-200 rounded text-red-600"
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>설정된 아이콘 매핑이 없습니다.</p>
                      <p className="text-sm mt-1">아래 버튼을 클릭하여 첫 번째 매핑을 추가하세요.</p>
                    </div>
                  )}
                </div>

                {/* 새 매핑 추가 폼 (isAddingMapping이 true일 때만) */}
                {isAddingMapping && (
                  <div className="border-t pt-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3">새 아이콘 매핑 추가</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {/* 아이콘 선택 */}
                        <div>
                          <label className="block text-xs font-medium mb-1">아이콘</label>
                          <select
                            value={formData.iconName}
                            onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="">선택하세요</option>
                            {AVAILABLE_ICONS.map((icon) => (
                              <option key={icon.name} value={icon.name}>
                                {icon.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 키워드 입력 */}
                        <div>
                          <label className="block text-xs font-medium mb-1">키워드</label>
                          <input
                            type="text"
                            value={formData.categoryKeywords}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoryKeywords: e.target.value }))}
                            placeholder="콤마로 구분"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelAdding}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleAddMapping}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 추가 버튼 */}
                {!isAddingMapping && !editingMapping && (
                  <div className="border-t pt-4">
                    <button
                      type="button"
                      onClick={startAdding}
                      className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      새 아이콘 매핑 추가
                    </button>
                  </div>
                )}
              </div>
            )}
        </AdminCard>
      </AdminSection>

      {/* 관련 설정 안내 */}
      <AdminSection title="관련 설정" description="프로그램 그리드와 관련된 다른 설정들은 별도 페이지에서 관리됩니다.">
        <AdminCard>
          <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            다른 페이지에서 관리
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>프로그램 이름, 목표, 내용 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>프로그램 카테고리 분류 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>프로그램 순서 → <strong>프로그램 관리</strong> 페이지</span>
            </li>
          </ul>
        </AdminCard>
      </AdminSection>
    </div>
  )
}