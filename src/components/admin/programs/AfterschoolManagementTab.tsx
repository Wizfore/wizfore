'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, FileText, Target, ArrowUp, ArrowDown, Hash } from 'lucide-react'
import type { ProgramCategory, ProgramDetail } from '@/types/program'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

interface AfterschoolManagementTabProps {
  data: ProgramCategory
  onUpdate: (data: ProgramCategory) => void
}

export function AfterschoolManagementTab({
  data,
  onUpdate
}: AfterschoolManagementTabProps) {
  const [editingProgram, setEditingProgram] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProgram, setNewProgram] = useState<Omit<ProgramDetail, 'order'>>({
    title: '',
    target: [],
    goal: [],
    content: [],
    types: []
  })

  // Hero 섹션 업데이트
  const updateHero = (field: 'title' | 'description' | 'imageUrl', value: string) => {
    onUpdate({
      ...data,
      hero: {
        title: data.hero?.title || '',
        description: data.hero?.description || '',
        imageUrl: data.hero?.imageUrl || '',
        [field]: value
      }
    })
  }

  // About Message 업데이트
  const updateAboutMessage = (field: 'title' | 'description', value: string) => {
    onUpdate({
      ...data,
      aboutMessage: {
        title: data.aboutMessage?.title || '',
        description: data.aboutMessage?.description || '',
        [field]: value
      }
    })
  }

  // 프로그램 관리 함수들
  const addProgram = () => {
    if (!newProgram.title.trim()) return
    
    const maxOrder = Math.max(...data.programs.map(p => p.order || 0), 0)
    const programWithOrder = {
      ...newProgram,
      order: maxOrder + 1
    }
    
    onUpdate({
      ...data,
      programs: [...data.programs, programWithOrder]
    })
    
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
    const updatedPrograms = [...data.programs]
    updatedPrograms[index] = {
      ...updatedPrograms[index],
      [field]: value
    }
    
    onUpdate({
      ...data,
      programs: updatedPrograms
    })
  }

  const removeProgram = (index: number) => {
    const updatedPrograms = data.programs.filter((_, i) => i !== index)
    onUpdate({
      ...data,
      programs: updatedPrograms
    })
  }

  const moveProgram = (index: number, direction: 'up' | 'down') => {
    const newPrograms = [...data.programs]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newPrograms.length) {
      [newPrograms[index], newPrograms[newIndex]] = [newPrograms[newIndex], newPrograms[index]]
      
      // order 값 업데이트
      newPrograms[index].order = index + 1
      newPrograms[newIndex].order = newIndex + 1
      
      onUpdate({
        ...data,
        programs: newPrograms
      })
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

  // 배열 필드 관리 컴포넌트
  const ArrayFieldManager = ({ 
    items, 
    onAdd, 
    onRemove, 
    onUpdate, 
    placeholder 
  }: {
    items: string[]
    onAdd: (item: string) => void
    onRemove: (index: number) => void
    onUpdate: (index: number, value: string) => void
    placeholder: string
  }) => {
    const [newItem, setNewItem] = useState('')

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAdd(newItem)
                setNewItem('')
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => {
              onAdd(newItem)
              setNewItem('')
            }}
            disabled={!newItem.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 히어로 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">히어로 섹션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 제목
            </label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 설명
            </label>
            <textarea
              value={data.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배경 이미지 (선택사항)
            </label>
            <ImageUpload
              value={data.hero?.imageUrl || ''}
              onChange={(url: string) => updateHero('imageUrl', url)}
              folder="hero-images"
            />
          </div>
        </div>
      </div>

      {/* 소개 메시지 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={data.aboutMessage?.title || ''}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={data.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 설명"
            />
          </div>
        </div>
      </div>

      {/* 프로그램 관리 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            프로그램 관리 ({data.programs.length}개)
          </h3>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            프로그램 추가
          </Button>
        </div>

        {/* 프로그램 추가 폼 */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">새 프로그램 추가</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  프로그램명
                </label>
                <input
                  type="text"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="프로그램명을 입력하세요"
                />
              </div>
            </div>
            
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
          </div>
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
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-500" />
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          프로그램명
                        </label>
                        <input
                          type="text"
                          value={program.title}
                          onChange={(e) => updateProgram(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* 대상 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <h5 className="text-sm font-semibold text-gray-900">대상</h5>
                      </div>
                      <ArrayFieldManager
                        items={program.target || []}
                        onAdd={(item) => addArrayItem(index, 'target', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'target', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'target', itemIndex, value)}
                        placeholder="대상을 입력하세요"
                      />
                    </div>

                    {/* 목표 */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-green-600" />
                        <h5 className="text-sm font-semibold text-gray-900">목표</h5>
                      </div>
                      <ArrayFieldManager
                        items={program.goal || []}
                        onAdd={(item) => addArrayItem(index, 'goal', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'goal', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'goal', itemIndex, value)}
                        placeholder="목표를 입력하세요"
                      />
                    </div>

                    {/* 내용 */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h5 className="text-sm font-semibold text-gray-900">내용</h5>
                      </div>
                      <ArrayFieldManager
                        items={program.content || []}
                        onAdd={(item) => addArrayItem(index, 'content', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'content', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'content', itemIndex, value)}
                        placeholder="내용을 입력하세요"
                      />
                    </div>

                    {/* 유형 */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-orange-600" />
                        <h5 className="text-sm font-semibold text-gray-900">유형</h5>
                      </div>
                      <ArrayFieldManager
                        items={program.types || []}
                        onAdd={(item) => addArrayItem(index, 'types', item)}
                        onRemove={(itemIndex) => removeArrayItem(index, 'types', itemIndex)}
                        onUpdate={(itemIndex, value) => updateArrayItem(index, 'types', itemIndex, value)}
                        placeholder="유형을 입력하세요"
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}