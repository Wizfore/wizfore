'use client'

import { Plus, Trash2 } from 'lucide-react'
import { LocationInfo, TransportationInfo } from '@/types/about'
import { Button } from '@/components/ui/button'

interface LocationManagementTabProps {
  data: LocationInfo
  onUpdate: (data: LocationInfo) => void
}

export default function LocationManagementTab({ data, onUpdate }: LocationManagementTabProps) {
  // Hero 섹션 업데이트
  const updateHero = (field: string, value: string) => {
    onUpdate({
      ...data,
      hero: {
        ...data.hero,
        [field]: value
      }
    })
  }

  // About 메시지 업데이트
  const updateAboutMessage = (field: string, value: string) => {
    onUpdate({
      ...data,
      aboutMessage: {
        ...data.aboutMessage,
        [field]: value
      }
    })
  }

  // 교통편 정보 업데이트
  const updateTransportation = (index: number, field: keyof TransportationInfo, value: string) => {
    const newTransportation = [...(data.transportation || [])]
    newTransportation[index] = {
      ...newTransportation[index],
      [field]: value
    }
    onUpdate({
      ...data,
      transportation: newTransportation
    })
  }

  // 교통편 정보 추가
  const addTransportation = () => {
    const newTransportation: TransportationInfo = {
      type: '지하철',
      description: ''
    }
    onUpdate({
      ...data,
      transportation: [...(data.transportation || []), newTransportation]
    })
  }

  // 교통편 정보 삭제
  const removeTransportation = (index: number) => {
    const newTransportation = data.transportation?.filter((_, i) => i !== index) || []
    onUpdate({
      ...data,
      transportation: newTransportation
    })
  }

  return (
    <div className="space-y-6">
      {/* Hero 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero 섹션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={data.hero?.description || ''}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero 섹션 설명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지 URL</label>
            <input
              type="url"
              value={data.hero?.imageUrl || ''}
              onChange={(e) => updateHero('imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* About 메시지 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={data.aboutMessage?.title || ''}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={data.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="소개 메시지 설명"
            />
          </div>
        </div>
      </div>

      {/* 교통편 정보 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">교통편 정보</h3>
          <Button onClick={addTransportation}>
            <Plus className="h-4 w-4 mr-2" />
            교통편 추가
          </Button>
        </div>

        <div className="space-y-4">
          {data.transportation?.map((transport, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교통수단</label>
                  <select
                    value={transport.type}
                    onChange={(e) => updateTransportation(index, 'type', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="지하철">지하철</option>
                    <option value="버스">버스</option>
                    <option value="차">차</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <input
                        type="text"
                        value={transport.description}
                        onChange={(e) => updateTransportation(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="교통편 설명"
                      />
                    </div>
                    <div className="self-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTransportation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}