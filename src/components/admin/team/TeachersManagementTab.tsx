'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, User, ArrowUp, ArrowDown, Star, Target, GraduationCap, Award, FileText, Hash } from 'lucide-react'
import { TeamCategory, TeamMember, TeamFeature } from '@/types/expert'
import { Button } from '@/components/ui/button'
import { 
  AdminSection, 
  AdminInput, 
  AdminTextarea, 
  AdminImageUploadField,
  AdminCard,
  AdminArrayField
} from '@/components/admin/ui'
import IconDropdown from '@/components/admin/common/IconDropdown'

interface TeachersManagementTabProps {
  data: TeamCategory
  onUpdate: (data: TeamCategory) => void
}

export default function TeachersManagementTab({ data: teachersData, onUpdate }: TeachersManagementTabProps) {
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)

  // SnsManagementTab 패턴 적용: 깊은 복사를 사용한 필드 업데이트
  const updateField = (path: string, value: string) => {
    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
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

  // 멤버 기본 정보 업데이트 (깊은 복사 패턴 적용)
  const updateMemberBasicInfo = (index: number, field: keyof TeamMember, value: string | number) => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    newData.members[index][field] = value
    onUpdate(newData)
  }

  // 멤버 배열 필드 업데이트 (깊은 복사 패턴 적용)
  const updateMemberArrayField = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', arrayIndex: number, value: string) => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    newData.members[memberIndex][field][arrayIndex] = value
    onUpdate(newData)
  }

  // 멤버 배열 필드에 새 항목 추가 (깊은 복사 패턴 적용)
  const addMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications') => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    if (!newData.members[memberIndex][field]) {
      newData.members[memberIndex][field] = []
    }
    newData.members[memberIndex][field].push('')
    onUpdate(newData)
  }

  // 멤버 배열 필드에서 항목 제거 (깊은 복사 패턴 적용)
  const removeMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', arrayIndex: number) => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    newData.members[memberIndex][field].splice(arrayIndex, 1)
    onUpdate(newData)
  }

  // 새 멤버 추가 (깊은 복사 패턴 적용)
  const addMember = () => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    const maxOrder = Math.max(...newData.members.map((m: TeamMember) => m.order || 0), 0)
    const newMember: TeamMember = {
      name: '',
      specialization: [],
      education: [],
      certifications: [],
      order: maxOrder + 1
    }
    newData.members.push(newMember)
    onUpdate(newData)
  }

  // 멤버 제거 (깊은 복사 패턴 적용)
  const removeMember = (index: number) => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    newData.members.splice(index, 1)
    onUpdate(newData)
  }

  // 멤버 순서 변경 (깊은 복사 패턴 적용)
  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newData.members.length) {
      [newData.members[index], newData.members[newIndex]] = [newData.members[newIndex], newData.members[index]]
      
      // order 값 업데이트
      newData.members[index].order = index + 1
      newData.members[newIndex].order = newIndex + 1
      
      onUpdate(newData)
    }
  }

  // 특징 업데이트 (깊은 복사 패턴 적용)
  const updateFeature = (id: string, field: keyof TeamFeature, value: any) => {
    const newData = JSON.parse(JSON.stringify(teachersData)) // 깊은 복사
    const featureIndex = newData.features?.findIndex((feature: TeamFeature) => feature.id === id)
    if (featureIndex !== undefined && featureIndex >= 0) {
      newData.features[featureIndex][field] = value
    }
    onUpdate(newData)
  }

  // AdminArrayField로 대체됨


  return (
    <div className="space-y-6">
      {/* 히어로 섹션 */}
      <AdminSection title="히어로 섹션" description="주간·방과후 교사 페이지의 히어로 섹션을 관리합니다.">
        <AdminInput
          label="페이지 제목"
          value={teachersData.hero?.title || ''}
          onChange={(value) => updateField('hero.title', value)}
          placeholder="페이지 제목"
          required
        />
        
        <AdminTextarea
          label="페이지 설명"
          value={teachersData.hero?.description || ''}
          onChange={(value) => updateField('hero.description', value)}
          rows={3}
          placeholder="페이지 설명"
        />
        
        <AdminImageUploadField
          label="배경 이미지 (선택사항)"
          value={teachersData.hero?.imageUrl}
          onChange={(url) => updateField('hero.imageUrl', url)}
          folder="pages/team/teachers/hero"
          defaultImageUrl={teachersData.hero?.defaultImageUrl}
          helper="히어로 섹션 배경으로 사용할 이미지를 업로드하세요"
        />
      </AdminSection>

      {/* 소개 메시지 */}
      <AdminSection title="소개 메시지" description="주간·방과후 교사 소개 메시지를 관리합니다.">
        <AdminInput
          label="제목"
          value={teachersData.aboutMessage?.title || ''}
          onChange={(value) => updateField('aboutMessage.title', value)}
          placeholder="소개 메시지 제목"
          required
        />
        
        <AdminTextarea
          label="설명"
          value={teachersData.aboutMessage?.description || ''}
          onChange={(value) => updateField('aboutMessage.description', value)}
          rows={3}
          placeholder="소개 메시지 설명"
        />
      </AdminSection>

      {/* 특징 관리 */}
      <AdminSection title={`특징 관리 (${teachersData.features?.length || 0}개)`} description="주간·방과후 교사팀의 특징을 관리합니다.">
        <div className="space-y-3">
          {teachersData.features?.map((feature, index) => (
            <AdminCard key={feature.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{feature.iconName}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingFeature(editingFeature === feature.id ? null : feature.id)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              
              {editingFeature === feature.id ? (
                <div className="space-y-3">
                  <AdminInput
                    label="제목"
                    value={feature.title}
                    onChange={(value) => updateFeature(feature.id, 'title', value)}
                    placeholder="특징 제목"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      아이콘
                    </label>
                    <IconDropdown
                      value={feature.iconName}
                      onChange={(iconName) => updateFeature(feature.id, 'iconName', iconName)}
                    />
                  </div>
                  
                  <AdminTextarea
                    label="설명"
                    value={feature.description}
                    onChange={(value) => updateFeature(feature.id, 'description', value)}
                    rows={2}
                    placeholder="특징 설명"
                  />
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              )}
            </AdminCard>
          ))}
          
          {(!teachersData.features || teachersData.features.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-2 text-gray-400" />
              <p>아직 등록된 특징이 없습니다.</p>
            </div>
          )}
        </div>
      </AdminSection>

      {/* 교사 관리 */}
      <AdminSection 
        title={`교사 관리 (${teachersData.members.length}명)`}
        description="주간·방과후 교사진을 관리합니다."
        headerActions={
          <Button onClick={addMember}>
            <Plus className="w-4 h-4 mr-2" />
            교사 추가
          </Button>
        }
      >
        <div className="space-y-4">
          {teachersData.members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-2 text-gray-400" />
              <p>등록된 교사가 없습니다.</p>
              <p className="text-sm">첫 번째 교사를 추가해보세요.</p>
            </div>
          ) : (
            teachersData.members.map((member, index) => (
              <AdminCard key={index}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{member.order || index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveMember(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveMember(index, 'down')}
                      disabled={index === teachersData.members.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMember(editingMember === index ? null : index)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeMember(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {editingMember === index && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    {/* 기본 정보 */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h5 className="text-sm font-semibold text-gray-900">기본 정보</h5>
                      </div>
                      <AdminInput
                        label="이름"
                        value={member.name}
                        onChange={(value) => updateMemberBasicInfo(index, 'name', value)}
                        placeholder="교사 이름"
                        required
                      />
                    </div>

                    {/* 전문분야 */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-green-600" />
                        <h5 className="text-sm font-semibold text-gray-900">전문분야</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={member.specialization || []}
                        onAdd={(item) => {
                          const newData = JSON.parse(JSON.stringify(teachersData))
                          if (!newData.members[index].specialization) {
                            newData.members[index].specialization = []
                          }
                          newData.members[index].specialization.push(item)
                          onUpdate(newData)
                        }}
                        onRemove={(itemIndex) => removeMemberArrayItem(index, 'specialization', itemIndex)}
                        onUpdate={(itemIndex, value) => updateMemberArrayField(index, 'specialization', itemIndex, value)}
                        placeholder="전문분야를 입력하세요"
                        newItemDefault=""
                      />
                    </div>

                    {/* 학력 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <h5 className="text-sm font-semibold text-gray-900">학력</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={member.education || []}
                        onAdd={(item) => {
                          const newData = JSON.parse(JSON.stringify(teachersData))
                          if (!newData.members[index].education) {
                            newData.members[index].education = []
                          }
                          newData.members[index].education.push(item)
                          onUpdate(newData)
                        }}
                        onRemove={(itemIndex) => removeMemberArrayItem(index, 'education', itemIndex)}
                        onUpdate={(itemIndex, value) => updateMemberArrayField(index, 'education', itemIndex, value)}
                        placeholder="학력을 입력하세요"
                        newItemDefault=""
                      />
                    </div>

                    {/* 자격증 */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-purple-600" />
                        <h5 className="text-sm font-semibold text-gray-900">자격증</h5>
                      </div>
                      <AdminArrayField
                        label=""
                        items={member.certifications || []}
                        onAdd={(item) => {
                          const newData = JSON.parse(JSON.stringify(teachersData))
                          if (!newData.members[index].certifications) {
                            newData.members[index].certifications = []
                          }
                          newData.members[index].certifications.push(item)
                          onUpdate(newData)
                        }}
                        onRemove={(itemIndex) => removeMemberArrayItem(index, 'certifications', itemIndex)}
                        onUpdate={(itemIndex, value) => updateMemberArrayField(index, 'certifications', itemIndex, value)}
                        placeholder="자격증을 입력하세요"
                        newItemDefault=""
                      />
                    </div>
                  </div>
                )}

                {editingMember !== index && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <h5 className="text-sm font-medium text-gray-900">전문분야</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.specialization?.length ? (
                          <ul className="space-y-1">
                            {member.specialization.map((spec, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                {spec}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">없음</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <h5 className="text-sm font-medium text-gray-900">학력</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.education?.length ? (
                          <ul className="space-y-1">
                            {member.education.map((edu, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                {edu}
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
                        <Award className="h-4 w-4 text-purple-600" />
                        <h5 className="text-sm font-medium text-gray-900">자격증</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.certifications?.length ? (
                          <ul className="space-y-1">
                            {member.certifications.map((cert, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                {cert}
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

