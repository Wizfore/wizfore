'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, FileText, Users, Clock, Target } from 'lucide-react'
import type { ProgramCategory, ProgramDetail } from '@/types/program'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProgramManagementTabProps {
  data: ProgramCategory
  onUpdate: (data: ProgramCategory) => void
  title: string
  description: string
}

export function ProgramManagementTab({
  data,
  onUpdate,
  title,
  description
}: ProgramManagementTabProps) {
  const [editingProgram, setEditingProgram] = useState<ProgramDetail | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddProgram = () => {
    setShowAddForm(true)
    setEditingProgram(null)
  }

  const handleEditProgram = (program: ProgramDetail) => {
    setEditingProgram(program)
    setShowAddForm(true)
  }

  const handleDeleteProgram = (programId: string) => {
    const updatedPrograms = data.programs.filter(p => (p.id || p.title) !== programId)
    onUpdate({
      ...data,
      programs: updatedPrograms
    })
  }

  const handleSaveProgram = (program: ProgramDetail) => {
    if (editingProgram) {
      // 수정
      const updatedPrograms = data.programs.map(p => 
        (p.id || p.title) === (editingProgram.id || editingProgram.title) ? program : p
      )
      onUpdate({
        ...data,
        programs: updatedPrograms
      })
    } else {
      // 추가
      onUpdate({
        ...data,
        programs: [...data.programs, program]
      })
    }
    setShowAddForm(false)
    setEditingProgram(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          프로그램 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">총 프로그램</p>
                <p className="text-2xl font-bold">{data.programs.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">활성 프로그램</p>
                <p className="text-2xl font-bold">
                  {data.programs.filter(p => p.status === 'active' || !p.status).length}개
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">준비 중</p>
                <p className="text-2xl font-bold">
                  {data.programs.filter(p => p.status === 'preparation').length}개
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 프로그램 목록 */}
      <div className="space-y-4">
        <h4 className="text-base font-medium">등록된 프로그램</h4>
        
        {data.programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">프로그램이 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">
                  첫 번째 프로그램을 추가해보세요.
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddProgram} className="inline-flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    프로그램 추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-base">{program.title}</CardTitle>
                      <Badge 
                        variant={program.status === 'active' || !program.status ? 'default' : 'secondary'}
                      >
                        {program.status === 'active' || !program.status ? '운영 중' : '준비 중'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProgram(program)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProgram(program.id || program.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{program.description || program.goal?.join(', ') || '설명이 없습니다.'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">대상:</span>
                      <span className="ml-1 font-medium">{program.targetAudience || program.target?.join(', ') || '미정'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">정원:</span>
                      <span className="ml-1 font-medium">{program.capacity || '미정'}명</span>
                    </div>
                  </div>

                  {program.schedule && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">일정:</span>
                        <span className="ml-1">{program.schedule}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 프로그램 추가/수정 폼 - 추후 별도 컴포넌트로 분리 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingProgram ? '프로그램 수정' : '프로그램 추가'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              프로그램 상세 편집 기능은 개발 중입니다.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProgram(null)
                }}
              >
                취소
              </Button>
              <Button onClick={() => setShowAddForm(false)}>
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}