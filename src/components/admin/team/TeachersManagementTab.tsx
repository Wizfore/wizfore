'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, User, ArrowUp, ArrowDown, Star, Target, GraduationCap, Award, FileText, Hash } from 'lucide-react'
import { TeamCategory, TeamMember, TeamFeature } from '@/types/expert'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

interface TeachersManagementTabProps {
  data: TeamCategory
  onUpdate: (data: TeamCategory) => void
}

export default function TeachersManagementTab({ data: teachersData, onUpdate }: TeachersManagementTabProps) {
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'order'>>({
    name: '',
    specialization: [],
    education: [],
    certifications: []
  })


  const updateHero = (field: 'title' | 'description' | 'imageUrl', value: string) => {
    onUpdate({
      ...teachersData,
      hero: {
        title: teachersData.hero?.title || '',
        description: teachersData.hero?.description || '',
        imageUrl: teachersData.hero?.imageUrl || '',
        [field]: value
      }
    })
  }

  const updateAboutMessage = (field: 'title' | 'description', value: string) => {
    onUpdate({
      ...teachersData,
      aboutMessage: {
        title: teachersData.aboutMessage?.title || '',
        description: teachersData.aboutMessage?.description || '',
        [field]: value
      }
    })
  }

  const resetNewMemberForm = () => {
    setNewMember({
      name: '',
      specialization: [],
      education: [],
      certifications: []
    })
  }


  const addMember = () => {
    if (!newMember.name.trim()) return
    
    const maxOrder = Math.max(...teachersData.members.map(m => m.order || 0), 0)
    const memberWithOrder = {
      ...newMember,
      order: maxOrder + 1
    }
    
    onUpdate({
      ...teachersData,
      members: [...teachersData.members, memberWithOrder]
    })
    
    resetNewMemberForm()
    setShowAddMemberForm(false)
  }


  // 멤버 관리 함수들
  const updateMember = (index: number, field: keyof TeamMember, value: any) => {
    const updatedMembers = [...teachersData.members]
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    }
    
    onUpdate({
      ...teachersData,
      members: updatedMembers
    })
  }

  const removeMember = (index: number) => {
    const updatedMembers = teachersData.members.filter((_, i) => i !== index)
    onUpdate({
      ...teachersData,
      members: updatedMembers
    })
  }

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newMembers = [...teachersData.members]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newMembers.length) {
      [newMembers[index], newMembers[newIndex]] = [newMembers[newIndex], newMembers[index]]
      
      // order 값 업데이트
      newMembers[index].order = index + 1
      newMembers[newIndex].order = newIndex + 1
      
      onUpdate({
        ...teachersData,
        members: newMembers
      })
    }
  }

  // 특징 관리 함수들
  const updateFeature = (id: string, field: keyof TeamFeature, value: any) => {
    const updatedFeatures = (teachersData.features || []).map(feature =>
      feature.id === id ? { ...feature, [field]: value } : feature
    )
    
    onUpdate({
      ...teachersData,
      features: updatedFeatures
    })
  }


  // 멤버 배열 필드 관리 함수들
  const addMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', item: string) => {
    const currentArray = teachersData.members[memberIndex][field] || []
    updateMember(memberIndex, field, [...currentArray, item])
  }

  const removeMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', itemIndex: number) => {
    const currentArray = teachersData.members[memberIndex][field] || []
    updateMember(memberIndex, field, currentArray.filter((_, i) => i !== itemIndex))
  }

  const updateMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', itemIndex: number, value: string) => {
    const currentArray = teachersData.members[memberIndex][field] || []
    const newArray = [...currentArray]
    newArray[itemIndex] = value
    updateMember(memberIndex, field, newArray)
  }

  // 새 멤버 배열 필드 관리 함수들
  const addNewMemberArrayItem = (field: 'specialization' | 'education' | 'certifications', item: string) => {
    const currentArray = newMember[field] || []
    setNewMember({ ...newMember, [field]: [...currentArray, item] })
  }

  const removeNewMemberArrayItem = (field: 'specialization' | 'education' | 'certifications', itemIndex: number) => {
    const currentArray = newMember[field] || []
    setNewMember({ ...newMember, [field]: currentArray.filter((_, i) => i !== itemIndex) })
  }

  const updateNewMemberArrayItem = (field: 'specialization' | 'education' | 'certifications', itemIndex: number, value: string) => {
    const currentArray = newMember[field] || []
    const newArray = [...currentArray]
    newArray[itemIndex] = value
    setNewMember({ ...newMember, [field]: newArray })
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">주간·방과후 교사 관리</h2>
        <p className="text-sm text-gray-600">주간·방과후 교사진의 정보와 소개를 관리할 수 있습니다.</p>
      </div>

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
              value={teachersData.hero?.title || ''}
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
              value={teachersData.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배경 이미지
            </label>
            <ImageUpload
              value={teachersData.hero?.imageUrl || ''}
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
              value={teachersData.aboutMessage?.title || ''}
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
              value={teachersData.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 설명"
            />
          </div>
        </div>
      </div>

      {/* 특징 관리 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            특징 관리 ({teachersData.features?.length || 0}개)
          </h3>
        </div>


        {/* 특징 목록 */}
        <div className="space-y-3">
          {teachersData.features?.map((feature, index) => (
            <div key={feature.id} className="p-4 bg-gray-50 rounded-lg">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="특징 제목"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="특징 설명"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              )}
            </div>
          ))}
          
          {(!teachersData.features || teachersData.features.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 특징이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 교사 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          교사 목록 ({teachersData.members.length}명)
        </h3>
        <Button onClick={() => setShowAddMemberForm(!showAddMemberForm)}>
          <Plus className="h-4 w-4 mr-2" />
          교사 추가
        </Button>
      </div>

      {/* 새 교사 추가 폼 */}
      {showAddMemberForm && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">새 교사 추가</h4>
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h5 className="text-md font-medium text-gray-800 mb-3">기본 정보</h5>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="교사 이름"
                />
              </div>
            </div>

            {/* 상세 정보 */}
            <div>
              <h5 className="text-md font-medium text-gray-800 mb-3">상세 정보</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전문분야
                  </label>
                  <MemberArrayFieldManager
                    items={newMember.specialization || []}
                    onAdd={(item) => addNewMemberArrayItem('specialization', item)}
                    onRemove={(itemIndex) => removeNewMemberArrayItem('specialization', itemIndex)}
                    onUpdate={(itemIndex, value) => updateNewMemberArrayItem('specialization', itemIndex, value)}
                    placeholder="전문분야를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학력
                  </label>
                  <MemberArrayFieldManager
                    items={newMember.education || []}
                    onAdd={(item) => addNewMemberArrayItem('education', item)}
                    onRemove={(itemIndex) => removeNewMemberArrayItem('education', itemIndex)}
                    onUpdate={(itemIndex, value) => updateNewMemberArrayItem('education', itemIndex, value)}
                    placeholder="학력을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    자격증
                  </label>
                  <MemberArrayFieldManager
                    items={newMember.certifications || []}
                    onAdd={(item) => addNewMemberArrayItem('certifications', item)}
                    onRemove={(itemIndex) => removeNewMemberArrayItem('certifications', itemIndex)}
                    onUpdate={(itemIndex, value) => updateNewMemberArrayItem('certifications', itemIndex, value)}
                    placeholder="자격증을 입력하세요"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={addMember} disabled={!newMember.name.trim()}>
                추가
              </Button>
              <Button variant="outline" onClick={() => {
                resetNewMemberForm()
                setShowAddMemberForm(false)
              }}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 교사 목록 */}
      <div className="space-y-4">
        {teachersData.members.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="h-3 w-3 text-gray-400" />
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{member.order}</span>
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

            {editingMember === index ? (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h5 className="text-sm font-semibold text-gray-900">기본 정보</h5>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 전문분야 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <h5 className="text-sm font-semibold text-gray-900">전문분야</h5>
                  </div>
                  <MemberArrayFieldManager
                    items={member.specialization || []}
                    onAdd={(item) => addMemberArrayItem(index, 'specialization', item)}
                    onRemove={(itemIndex) => removeMemberArrayItem(index, 'specialization', itemIndex)}
                    onUpdate={(itemIndex, value) => updateMemberArrayItem(index, 'specialization', itemIndex, value)}
                    placeholder="전문분야를 입력하세요"
                  />
                </div>

                {/* 학력 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <h5 className="text-sm font-semibold text-gray-900">학력</h5>
                  </div>
                  <MemberArrayFieldManager
                    items={member.education || []}
                    onAdd={(item) => addMemberArrayItem(index, 'education', item)}
                    onRemove={(itemIndex) => removeMemberArrayItem(index, 'education', itemIndex)}
                    onUpdate={(itemIndex, value) => updateMemberArrayItem(index, 'education', itemIndex, value)}
                    placeholder="학력을 입력하세요"
                  />
                </div>

                {/* 자격증 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <h5 className="text-sm font-semibold text-gray-900">자격증</h5>
                  </div>
                  <MemberArrayFieldManager
                    items={member.certifications || []}
                    onAdd={(item) => addMemberArrayItem(index, 'certifications', item)}
                    onRemove={(itemIndex) => removeMemberArrayItem(index, 'certifications', itemIndex)}
                    onUpdate={(itemIndex, value) => updateMemberArrayItem(index, 'certifications', itemIndex, value)}
                    placeholder="자격증을 입력하세요"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
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
                
                <div className="bg-gray-50 rounded-lg p-4">
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
                
                <div className="bg-gray-50 rounded-lg p-4">
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
          </div>
        ))}

        {teachersData.members.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 등록된 교사가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

// 멤버 배열 필드 관리 컴포넌트
interface MemberArrayFieldManagerProps {
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
  placeholder: string
}

function MemberArrayFieldManager({ items, onAdd, onRemove, onUpdate, placeholder }: MemberArrayFieldManagerProps) {
  const handleAdd = () => {
    onAdd('') // 빈 문자열로 새 항목 추가
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <div className="flex-1"></div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}