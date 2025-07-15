import React from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { DefaultSiteData } from '@/types'

type SiteInfoData = DefaultSiteData['siteInfo']

interface ServicesTabProps {
  siteInfo: SiteInfoData
  onUpdate: (data: SiteInfoData) => void
}

export function ServicesTab({ siteInfo, onUpdate }: ServicesTabProps) {
  const updateAboutMessage = (field: keyof SiteInfoData['mainServices']['aboutMessage'], value: string | string[]) => {
    onUpdate({
      ...siteInfo,
      mainServices: {
        ...siteInfo.mainServices,
        aboutMessage: {
          ...siteInfo.mainServices.aboutMessage,
          [field]: value
        }
      }
    })
  }

  const updateKeywords = (keywords: string[]) => {
    updateAboutMessage('highlightKeywords', keywords)
  }

  const addKeyword = () => {
    updateKeywords([...siteInfo.mainServices.aboutMessage.highlightKeywords, ''])
  }

  const removeKeyword = (index: number) => {
    updateKeywords(siteInfo.mainServices.aboutMessage.highlightKeywords.filter((_, i) => i !== index))
  }

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...siteInfo.mainServices.aboutMessage.highlightKeywords]
    newKeywords[index] = value
    updateKeywords(newKeywords)
  }

  const addService = () => {
    const newService = {
      title: '',
      description: '',
      details: [],
      startYear: '',
      order: siteInfo.mainServices.services.length + 1
    }
    onUpdate({
      ...siteInfo,
      mainServices: {
        ...siteInfo.mainServices,
        services: [...siteInfo.mainServices.services, newService]
      }
    })
  }

  const removeService = (index: number) => {
    const newServices = siteInfo.mainServices.services.filter((_, i) => i !== index)
    onUpdate({
      ...siteInfo,
      mainServices: {
        ...siteInfo.mainServices,
        services: newServices
      }
    })
  }

  const updateService = (index: number, field: string, value: string | string[]) => {
    const newServices = [...siteInfo.mainServices.services]
    newServices[index] = { ...newServices[index], [field]: value }
    onUpdate({
      ...siteInfo,
      mainServices: {
        ...siteInfo.mainServices,
        services: newServices
      }
    })
  }

  const addServiceDetail = (serviceIndex: number) => {
    const service = siteInfo.mainServices.services[serviceIndex]
    const newDetails = [...(service.details || []), '']
    updateService(serviceIndex, 'details', newDetails)
  }

  const removeServiceDetail = (serviceIndex: number, detailIndex: number) => {
    const service = siteInfo.mainServices.services[serviceIndex]
    const newDetails = (service.details || []).filter((_, i) => i !== detailIndex)
    updateService(serviceIndex, 'details', newDetails)
  }

  const updateServiceDetail = (serviceIndex: number, detailIndex: number, value: string) => {
    const service = siteInfo.mainServices.services[serviceIndex]
    const newDetails = [...(service.details || [])]
    newDetails[detailIndex] = value
    updateService(serviceIndex, 'details', newDetails)
  }

  return (
    <div className="space-y-8">
      {/* 소개 메시지 섹션 */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">소개 메시지</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={siteInfo.mainServices.aboutMessage.title}
              onChange={(e) => updateAboutMessage('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="주요 사업 분야 제목"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              하이라이트 키워드
            </label>
            <div className="space-y-2">
              {siteInfo.mainServices.aboutMessage.highlightKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="하이라이트할 키워드"
                  />
                  <button
                    onClick={() => removeKeyword(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addKeyword}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + 키워드 추가
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            value={siteInfo.mainServices.aboutMessage.description}
            onChange={(e) => updateAboutMessage('description', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="메인 서비스 소개 내용을 입력하세요. \n\n으로 문단을 구분할 수 있습니다."
          />
        </div>
      </div>

      {/* 서비스 목록 섹션 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">서비스 목록</h2>
          <button
            onClick={addService}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="w-4 h-4" />
            <span>서비스 추가</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {siteInfo.mainServices.services.slice().reverse().map((service, reversedIndex) => {
            const originalIndex = siteInfo.mainServices.services.length - 1 - reversedIndex
            return (
              <div key={originalIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">서비스 {originalIndex + 1}</span>
                  </div>
                  <button
                    onClick={() => removeService(originalIndex)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서비스명
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(originalIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="서비스 제목을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작년도
                    </label>
                    <input
                      type="text"
                      value={service.startYear}
                      onChange={(e) => updateService(originalIndex, 'startYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 2016"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    서비스 설명
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(originalIndex, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="서비스에 대한 설명을 입력하세요"
                  />
                </div>
                
                {service.details && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      세부사항
                    </label>
                    <div className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={detail}
                            onChange={(e) => updateServiceDetail(originalIndex, detailIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="세부사항을 입력하세요"
                          />
                          <button
                            onClick={() => removeServiceDetail(originalIndex, detailIndex)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addServiceDetail(originalIndex)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        + 세부사항 추가
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}