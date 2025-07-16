'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Edit2, MapPin, Car, Train, Bus } from 'lucide-react'
import { getLocationData, getLocationHero, getLocationAboutMessage, updateLocationInfo } from '@/lib/services/dataService'
import { LocationInfo, TransportationType, TransportationInfo } from '@/types/about'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export default function LocationManagementTab() {
  const [locationData, setLocationData] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingTransportation, setEditingTransportation] = useState<number | null>(null)
  const [newTransportation, setNewTransportation] = useState({
    type: '지하철' as TransportationType,
    description: ''
  })

  useEffect(() => {
    loadLocationData()
  }, [])

  const loadLocationData = async () => {
    try {
      setLoading(true)
      const [locationInfo, hero, aboutMessage] = await Promise.all([
        getLocationData(),
        getLocationHero(),
        getLocationAboutMessage()
      ])
      setLocationData({
        transportation: locationInfo?.transportation || [],
        hero: hero || { title: '', description: '', imageUrl: '' },
        aboutMessage: aboutMessage || { title: '', description: '' }
      })
    } catch (error) {
      console.error('오시는 길 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!locationData) return
    
    try {
      setSaving(true)
      await updateLocationInfo(locationData)
      alert('오시는 길 정보가 저장되었습니다.')
    } catch (error) {
      console.error('오시는 길 정보 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: 'title' | 'description' | 'imageUrl', value: string) => {
    setLocationData(prev => {
      if (!prev) return null
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: value
        }
      }
    })
  }

  const updateAboutMessage = (field: 'title' | 'description', value: string) => {
    setLocationData(prev => {
      if (!prev) return null
      return {
        ...prev,
        aboutMessage: {
          ...prev.aboutMessage,
          [field]: value
        }
      }
    })
  }

  const addTransportation = () => {
    if (!newTransportation.description.trim()) return
    
    if (locationData) {
      setLocationData({
        ...locationData,
        transportation: [...locationData.transportation, { ...newTransportation }]
      })
      setNewTransportation({
        type: '지하철' as TransportationType,
        description: ''
      })
    }
  }

  const updateTransportation = (index: number, field: 'type' | 'description', value: string) => {
    if (!locationData) return
    
    const updatedTransportation = [...locationData.transportation]
    updatedTransportation[index] = {
      ...updatedTransportation[index],
      [field]: value
    }
    
    setLocationData({
      ...locationData,
      transportation: updatedTransportation
    })
  }

  const removeTransportation = (index: number) => {
    if (!locationData) return
    
    const updatedTransportation = locationData.transportation.filter((_, i) => i !== index)
    setLocationData({
      ...locationData,
      transportation: updatedTransportation
    })
  }

  const getTransportationIcon = (type: TransportationType) => {
    switch (type) {
      case '지하철':
        return <Train className="h-4 w-4" />
      case '버스':
        return <Bus className="h-4 w-4" />
      case '차':
        return <Car className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTransportationLabel = (type: TransportationType) => {
    switch (type) {
      case '지하철':
        return '지하철'
      case '버스':
        return '버스'
      case '차':
        return '차'
      default:
        return '기타'
    }
  }

  const getTransportationColor = (type: TransportationType) => {
    switch (type) {
      case '지하철':
        return 'text-blue-600 bg-blue-50'
      case '버스':
        return 'text-green-600 bg-green-50'
      case '차':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2 text-gray-600">오시는 길 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!locationData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">오시는 길 정보를 찾을 수 없습니다.</p>
        <Button className="mt-4" onClick={loadLocationData}>
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">오시는 길 관리</h2>
          <p className="text-sm text-gray-600">센터 위치와 교통편 정보를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? '저장 중...' : '저장'}
        </Button>
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
              value={locationData.hero?.title || ''}
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
              value={locationData.hero?.description || ''}
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
              value={locationData.hero?.imageUrl || ''}
              onChange={(url) => updateHero('imageUrl', url)}
              folder="location/hero"
            />
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">안내 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={locationData.aboutMessage?.title || ''}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="안내 메시지 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={locationData.aboutMessage?.description || ''}
              onChange={(e) => updateAboutMessage('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="안내 메시지 설명"
            />
          </div>
        </div>
      </div>

      {/* 새 교통편 추가 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">새 교통편 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              교통수단
            </label>
            <select
              value={newTransportation.type}
              onChange={(e) => setNewTransportation({ ...newTransportation, type: e.target.value as TransportationType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="지하철">지하철</option>
              <option value="버스">버스</option>
              <option value="차">차</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 안내
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTransportation.description}
                onChange={(e) => setNewTransportation({ ...newTransportation, description: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTransportation()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="교통편 상세 안내"
              />
              <Button onClick={addTransportation} disabled={!newTransportation.description.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 교통편 목록 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          교통편 목록 ({locationData.transportation.length}개)
        </h3>
        <div className="space-y-3">
          {locationData.transportation.map((transport, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTransportationColor(transport.type)}`}>
                {getTransportationIcon(transport.type)}
                <span className="text-sm font-medium">
                  {getTransportationLabel(transport.type)}
                </span>
              </div>
              
              {editingTransportation === index ? (
                <div className="flex-1 flex gap-2">
                  <select
                    value={transport.type}
                    onChange={(e) => updateTransportation(index, 'type', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="지하철">지하철</option>
                    <option value="버스">버스</option>
                    <option value="차">차</option>
                  </select>
                  <input
                    type="text"
                    value={transport.description}
                    onChange={(e) => updateTransportation(index, 'description', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingTransportation(null)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTransportation(null)}
                  >
                    완료
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-700">{transport.description}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTransportation(index)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTransportation(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {locationData.transportation.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 교통편이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 교통편 미리보기 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">교통편 미리보기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationData.transportation.map((transport, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getTransportationColor(transport.type)}`}>
                {getTransportationIcon(transport.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">
                  {getTransportationLabel(transport.type)}
                </h4>
                <p className="text-sm text-gray-600 break-words">
                  {transport.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}