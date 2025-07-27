'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, User, ArrowUp, ArrowDown, Star, Target, GraduationCap, Award, FileText, Hash } from 'lucide-react'
import { TeamCategory, TeamMember, TeamFeature } from '@/types/expert'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

interface TherapistsManagementTabProps {
  data: TeamCategory
  onUpdate: (data: TeamCategory) => void
}

export default function TherapistsManagementTab({ data: therapistsData, onUpdate }: TherapistsManagementTabProps) {
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)

  // SnsManagementTab 패턴 적용: 깊은 복사를 사용한 필드 업데이트
  const updateField = (path: string, value: string) => {
    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
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
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    newData.members[index][field] = value
    onUpdate(newData)
  }

  // 멤버 배열 필드 업데이트 (깊은 복사 패턴 적용)
  const updateMemberArrayField = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', arrayIndex: number, value: string) => {
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    newData.members[memberIndex][field][arrayIndex] = value
    onUpdate(newData)
  }

  // 멤버 배열 필드에 새 항목 추가 (깊은 복사 패턴 적용)
  const addMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications') => {
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    if (!newData.members[memberIndex][field]) {
      newData.members[memberIndex][field] = []
    }
    newData.members[memberIndex][field].push('')
    onUpdate(newData)
  }

  // 멤버 배열 필드에서 항목 제거 (깊은 복사 패턴 적용)
  const removeMemberArrayItem = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', arrayIndex: number) => {
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    newData.members[memberIndex][field].splice(arrayIndex, 1)
    onUpdate(newData)
  }

  // 새 멤버 추가 (깊은 복사 패턴 적용)
  const addMember = () => {
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
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
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    newData.members.splice(index, 1)
    onUpdate(newData)
  }

  // 멤버 순서 변경 (깊은 복사 패턴 적용)
  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
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
    const newData = JSON.parse(JSON.stringify(therapistsData)) // 깊은 복사
    const featureIndex = newData.features?.findIndex((feature: TeamFeature) => feature.id === id)
    if (featureIndex !== undefined && featureIndex >= 0) {
      newData.features[featureIndex][field] = value
    }
    onUpdate(newData)
  }

  // 배열 필드 렌더링 함수 (센터소개관리페이지 패턴 적용)
  const renderMemberArrayField = (memberIndex: number, field: 'specialization' | 'education' | 'certifications', label: string) => {
    const items = therapistsData.members[memberIndex][field] || []
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {items.map((item, arrayIndex) => (
          <div key={arrayIndex} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateMemberArrayField(memberIndex, field, arrayIndex, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={`${label} ${arrayIndex + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeMemberArrayItem(memberIndex, field, arrayIndex)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addMemberArrayItem(memberIndex, field)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {label} 추가
        </Button>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">치료·상담사 관리</h2>
        <p className="text-sm text-gray-600">치료·상담사들의 정보와 소개를 관리할 수 있습니다.</p>
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
              value={therapistsData.hero?.title || ''}
              onChange={(e) => updateField('hero.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              페이지 설명
            </label>
            <textarea
              value={therapistsData.hero?.description || ''}
              onChange={(e) => updateField('hero.description', e.target.value)}
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
              value={therapistsData.hero?.imageUrl || ''}
              onChange={(url) => updateField('hero.imageUrl', url)}
              folder="team/therapists/hero"
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
              value={therapistsData.aboutMessage?.title || ''}
              onChange={(e) => updateField('aboutMessage.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={therapistsData.aboutMessage?.description || ''}
              onChange={(e) => updateField('aboutMessage.description', e.target.value)}
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
            특징 관리 ({therapistsData.features?.length || 0}개)
          </h3>
        </div>


        {/* 특징 목록 */}
        <div className="space-y-3">
          {therapistsData.features?.map((feature, index) => (
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
          
          {(!therapistsData.features || therapistsData.features.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 특징이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 치료사 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          치료사 목록 ({therapistsData.members.length}명)
        </h3>
        <Button onClick={addMember}>
          <Plus className="h-4 w-4 mr-2" />
          치료사 추가
        </Button>
      </div>

      {/* 치료사 목록 */}
      <div className="space-y-4">
        {therapistsData.members.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
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
                  disabled={index === therapistsData.members.length - 1}
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
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <h6 className="text-sm font-medium text-gray-800">기본 정보</h6>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMemberBasicInfo(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {renderMemberArrayField(index, 'specialization', '전문분야')}
                {renderMemberArrayField(index, 'education', '학력')}
                {renderMemberArrayField(index, 'certifications', '자격증')}
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

        {therapistsData.members.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 등록된 치료사가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

