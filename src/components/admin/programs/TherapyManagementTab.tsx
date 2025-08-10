'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Activity, FileText, Target, ArrowUp, ArrowDown, Hash } from 'lucide-react'
import type { ProgramCategory, ProgramDetail } from '@/types/program'
import { Button } from '@/components/ui/button'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard,
  AdminArrayField
} from '@/components/admin/ui'
import { useImageCleanup } from '@/hooks/useImageCleanup'

interface TherapyManagementTabProps {
  data: ProgramCategory
  onUpdate: (data: ProgramCategory) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
}

export function TherapyManagementTab({
  data,
  onUpdate,
  onUnsavedChanges
}: TherapyManagementTabProps) {
  const [editingProgram, setEditingProgram] = useState<number | null>(null)

  // 이미지 정리 훅
  const { trackUploadedImage, stopTrackingAllImages, performCleanup } = useImageCleanup()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProgram, setNewProgram] = useState<Omit<ProgramDetail, 'order'>>({
    title: '',
    target: [],
    goal: [],
    content: [],
    types: []
  })

  // SnsManagementTab 패턴 적용: 깊은 복사를 사용한 필드 업데이트
  const updateField = (path: string, value: string) => {

    // 이미지 URL 업데이트 시 추적 시작
    if (path.endsWith('.imageUrl') && value) {
      trackUploadedImage(value)
    }

    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(data)) // 깊은 복사
    let current: any = newData
    
    // 중첩 객체 경로 생성
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    // 최종 값 설정
    current[keys[keys.length - 1]] = value
    
    onUpdate(newData)
  }

  // 프로그램 관리 함수들 (깊은 복사 패턴 적용)
  const addProgram = () => {
    if (!newProgram.title.trim()) return
    
    const newData = JSON.parse(JSON.stringify(data)) // 깊은 복사
    const maxOrder = Math.max(...newData.programs.map((p: ProgramDetail) => p.order || 0), 0)
    const programWithOrder = {
      ...newProgram,
      order: maxOrder + 1
    }
    
    newData.programs.push(programWithOrder)
    onUpdate(newData)
    
    resetNewProgramForm()
    setShowAddForm(false)
  }

  const resetNewProgramForm = () => {
    setNewProgram({
      title: '',
      target: [],
      goal: [],
      content: [],
      types: []
    })
  }

  const updateProgram = (index: number, field: keyof ProgramDetail, value: any) => {
    // 이미지 URL 필드 업데이트 시 추적 시작
    if (field === 'image' && typeof value === 'string' && value) {
      trackUploadedImage(value)
    }
    
    const newData = JSON.parse(JSON.stringify(data)) // 깊은 복사
    newData.programs[index][field] = value
    onUpdate(newData)
  }

  const removeProgram = (index: number) => {
    const newData = JSON.parse(JSON.stringify(data)) // 깊은 복사
    newData.programs.splice(index, 1)
    onUpdate(newData)
  }

  const moveProgram = (index: number, direction: 'up' | 'down') => {
    const newData = JSON.parse(JSON.stringify(data)) // 깊은 복사
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newData.programs.length) {
      [newData.programs[index], newData.programs[newIndex]] = [newData.programs[newIndex], newData.programs[index]]
      
      // order 값 업데이트
      newData.programs[index].order = index + 1
      newData.programs[newIndex].order = newIndex + 1
      
      onUpdate(newData)
    }
  }

  // 배열 필드 관리 함수들
  const addArrayItem = (programIndex: number, field: 'target' | 'goal' | 'content' | 'types', item: string) => {
    if (!item.trim()) return
    const currentArray = data.programs[programIndex][field] || []
    updateProgram(programIndex, field, [...currentArray, item])
  }

  const removeArrayItem = (programIndex: number, field: 'target' | 'goal' | 'content' | 'types', itemIndex: number) => {
    const currentArray = data.programs[programIndex][field] || []
    updateProgram(programIndex, field, currentArray.filter((_, i) => i !== itemIndex))
  }

  const updateArrayItem = (programIndex: number, field: 'target' | 'goal' | 'content' | 'types', itemIndex: number, value: string) => {
    const currentArray = data.programs[programIndex][field] || []
    const updatedArray = [...currentArray]
    updatedArray[itemIndex] = value
    updateProgram(programIndex, field, updatedArray)
  }

  // ArrayFieldManager를 AdminArrayField로 대체할 예정


  // 저장 성공 시 모든 이미지 추적 중단
  const handleSaveSuccess = () => {
    stopTrackingAllImages()
    onUnsavedChanges?.(false)
  }

  // 저장하지 않음 선택 시 업로드된 이미지 정리
  const handleDiscardChanges = async () => {
    await performCleanup()
    onUnsavedChanges?.(false)
  }

  return (
    <div className="space-y-6">
      {/* 히어로 섹션 */}
      <AdminSection title="히어로 섹션" description="치료 프로그램 페이지의 히어로 섹션을 관리합니다.">
        <AdminInput
          label="페이지 제목"
          value={data.hero?.title || ''}
          onChange={(value) => updateField('hero.title', value)}
          placeholder="페이지 제목"
          required
        />
        
        <AdminTextarea
          label="페이지 설명"
          value={data.hero?.description || ''}
          onChange={(value) => updateField('hero.description', value)}
          rows={3}
          placeholder="페이지 설명"
        />
        
        <AdminImageUploadField
          label="배경 이미지 (선택사항)"
          value={data.hero?.imageUrl}
          onChange={(url) => updateField('hero.imageUrl', url)}
          folder="pages/programs/therapy/hero"
          defaultImageUrl={data.hero?.defaultImageUrl}
          helper="히어로 섹션 배경으로 사용할 이미지를 업로드하세요"
        />
      </AdminSection>

      {/* 소개 메시지 */}
      <AdminSection title="소개 메시지" description="치료 프로그램 소개 메시지를 관리합니다.">
        <AdminInput
          label="제목"
          value={data.aboutMessage?.title || ''}
          onChange={(value) => updateField('aboutMessage.title', value)}
          placeholder="소개 메시지 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={data.aboutMessage?.description || ''}
          onChange={(value) => updateField('aboutMessage.description', value)}
          rows={3}
          placeholder="소개 메시지 설명"
        />
      </AdminSection>

      {/* 프로그램 관리 */}
      <AdminSection 
        title={`프로그램 관리 (${data.programs.length}개)`}
        description="치료 프로그램 목록을 관리합니다."
        headerActions={
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            프로그램 추가
          </Button>
        }
      >
        {/* 프로그램 추가 폼 */}
        {showAddForm && (
          <AdminCard>
            <h4 className="font-medium mb-4">새 프로그램 추가</h4>
            <AdminInput
              label="프로그램명"
              value={newProgram.title}
              onChange={(value) => setNewProgram({ ...newProgram, title: value })}
              placeholder="프로그램명을 입력하세요"
              required
            />
            
            <div className="flex gap-2 mt-4">
              <Button onClick={addProgram} disabled={!newProgram.title.trim()}>
                추가
              </Button>
              <Button variant="outline" onClick={() => {
                resetNewProgramForm()
                setShowAddForm(false)
              }}>
                취소
              </Button>
            </div>
          </AdminCard>
        )}

        {/* 프로그램 목록 */}
        <div className="space-y-4">
          {data.programs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-2 text-gray-400" />
              <p>등록된 프로그램이 없습니다.</p>
              <p className="text-sm">첫 번째 프로그램을 추가해보세요.</p>
            </div>
          ) : (
            data.programs.map((program, index) => (
              <AdminCard key={index}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{program.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{program.order || index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveProgram(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveProgram(index, 'down')}
                      disabled={index === data.programs.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProgram(editingProgram === index ? null : index)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeProgram(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {editingProgram === index && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    {/* 기본 정보 */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h5 className="text-sm font-semibold text-gray-900">기본 정보</h5>
                      </div>
                      <AdminInput
                        label="프로그램명"
                        value={program.title}
                        onChange={(value) => updateProgram(index, 'title', value)}
                        placeholder="프로그램명"
                        required
                      />
                    </div>

                    {/* 대상 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <h5 className="text-sm font-semibold text-gray-900">대상</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={program.target || []}
                        onAdd={(item) => addArrayItem(index, 'target', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'target', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'target', itemIndex, value)}
                        placeholder="대상을 입력하세요"
                        newItemDefault=""
                      />
                    </div>

                    {/* 목표 */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-green-600" />
                        <h5 className="text-sm font-semibold text-gray-900">목표</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={program.goal || []}
                        onAdd={(item) => addArrayItem(index, 'goal', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'goal', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'goal', itemIndex, value)}
                        placeholder="목표를 입력하세요"
                        newItemDefault=""
                      />
                    </div>

                    {/* 내용 */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h5 className="text-sm font-semibold text-gray-900">내용</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={program.content || []}
                        onAdd={(item) => addArrayItem(index, 'content', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'content', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'content', itemIndex, value)}
                        placeholder="내용을 입력하세요"
                        newItemDefault=""
                      />
                    </div>

                    {/* 유형 */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-orange-600" />
                        <h5 className="text-sm font-semibold text-gray-900">유형</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={program.types || []}
                        onAdd={(item) => addArrayItem(index, 'types', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'types', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'types', itemIndex, value)}
                        placeholder="유형을 입력하세요"
                        newItemDefault=""
                      />
                    </div>
                  </div>
                )}

                {editingProgram !== index && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <h5 className="text-sm font-medium text-gray-900">대상</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {program.target?.length ? (
                          <ul className="space-y-1">
                            {program.target.map((target, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                {target}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <h5 className="text-sm font-medium text-gray-900">목표</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {program.goal?.length ? (
                          <ul className="space-y-1">
                            {program.goal.map((goal, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                {goal}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <h5 className="text-sm font-medium text-gray-900">내용</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {program.content?.length ? (
                          <ul className="space-y-1">
                            {program.content.map((content, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                {content}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <h5 className="text-sm font-medium text-gray-900">유형</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {program.types?.length ? (
                          <ul className="space-y-1">
                            {program.types.map((type, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                {type}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </AdminCard>
            ))
          )}
        </div>
      </AdminSection>
    </div>
  )
}