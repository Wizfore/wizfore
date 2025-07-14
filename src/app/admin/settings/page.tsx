'use client'

import { useState, useEffect } from 'react'
import { getSiteInfo, updateSiteInfo } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Settings, Save, RotateCcw, Loader2, CheckCircle, XCircle, Plus, Trash2, GripVertical, Upload as UploadIcon } from 'lucide-react'
import SingleImageUpload from '@/components/admin/common/SingleImageUpload'
import type { DefaultSiteData } from '@/types'

type SiteInfoData = DefaultSiteData['siteInfo']

export default function SettingsPage() {
  const [siteInfo, setSiteInfo] = useState<SiteInfoData>(defaultSiteData.siteInfo)
  const [originalData, setOriginalData] = useState<SiteInfoData>(defaultSiteData.siteInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'services' | 'images'>('basic')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedData = await getSiteInfo()
        setSiteInfo(fetchedData as SiteInfoData)
        setOriginalData(fetchedData as SiteInfoData)
      } catch (err) {
        console.error('Error fetching site info:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        // 에러 시 기본 데이터 사용
        setSiteInfo(defaultSiteData.siteInfo)
        setOriginalData(defaultSiteData.siteInfo)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const validateForm = () => {
    const errors = []
    
    if (!siteInfo.name.trim()) errors.push('사이트명은 필수입니다.')
    if (!siteInfo.enName.trim()) errors.push('영문명은 필수입니다.')
    if (!siteInfo.establishedDate.trim()) errors.push('설립일은 필수입니다.')
    if (!siteInfo.purpose.trim()) errors.push('설립 목적은 필수입니다.')
    if (!siteInfo.contact.address.trim()) errors.push('주소는 필수입니다.')
    if (!siteInfo.contact.phone.trim()) errors.push('전화번호는 필수입니다.')
    if (!siteInfo.contact.email.trim()) errors.push('이메일은 필수입니다.')
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (siteInfo.contact.email && !emailRegex.test(siteInfo.contact.email)) {
      errors.push('올바른 이메일 형식을 입력해주세요.')
    }
    
    // 메인 서비스 검증 (빈 서비스는 제외)
    siteInfo.mainServices.services.forEach((service, index) => {
      // 모든 필드가 비어있는 서비스는 검증에서 제외
      if (!service.title.trim() && !service.description.trim() && !service.startYear.trim()) {
        return
      }
      
      // 하나라도 필드가 있으면 모든 필드 검증
      if (!service.title.trim()) errors.push(`메인 서비스 ${index + 1}의 제목은 필수입니다.`)
      if (!service.description.trim()) errors.push(`메인 서비스 ${index + 1}의 설명은 필수입니다.`)
      if (!service.startYear.trim()) errors.push(`메인 서비스 ${index + 1}의 시작년도는 필수입니다.`)
    })
    
    return errors
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveStatus('idle')
      
      // 폼 검증
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'))
        setSaveStatus('error')
        setTimeout(() => {
          setSaveStatus('idle')
          setError(null)
        }, 5000)
        return
      }
      
      // 저장 전 빈 서비스 제거
      const cleanedSiteInfo = {
        ...siteInfo,
        mainServices: {
          ...siteInfo.mainServices,
          services: siteInfo.mainServices.services.filter(service => 
            service.title.trim() || service.description.trim() || service.startYear.trim()
          )
        }
      }
      
      await updateSiteInfo(cleanedSiteInfo)
      setOriginalData(cleanedSiteInfo)
      setSiteInfo(cleanedSiteInfo)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      console.error('Error saving site info:', err)
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      setSaveStatus('error')
      setTimeout(() => {
        setSaveStatus('idle')
        setError(null)
      }, 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSiteInfo(originalData)
    setSaveStatus('idle')
  }

  const hasChanges = JSON.stringify(siteInfo) !== JSON.stringify(originalData)

  const tabs = [
    { key: 'basic', label: '기본 정보', icon: Settings },
    { key: 'contact', label: '연락처 정보', icon: Settings },
    { key: 'services', label: '메인 서비스', icon: Settings },
    { key: 'images', label: '이미지 설정', icon: Settings },
  ] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error && loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 에러 메시지 */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="text-red-700">
              {error.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>
          <p className="text-gray-600">사이트 기본 정보를 관리합니다</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">저장되었습니다</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">저장에 실패했습니다</span>
            </div>
          )}
          
          <button
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>되돌리기</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? '저장 중...' : '저장하기'}</span>
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트명
                </label>
                <input
                  type="text"
                  value={siteInfo.name}
                  onChange={(e) => setSiteInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영문명
                </label>
                <input
                  type="text"
                  value={siteInfo.enName}
                  onChange={(e) => setSiteInfo(prev => ({ ...prev, enName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설립일
                </label>
                <input
                  type="text"
                  value={siteInfo.establishedDate}
                  onChange={(e) => setSiteInfo(prev => ({ ...prev, establishedDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설립 목적
              </label>
              <textarea
                value={siteInfo.purpose}
                onChange={(e) => setSiteInfo(prev => ({ ...prev, purpose: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">연락처 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <textarea
                  value={siteInfo.contact.address}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, address: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.phone}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  팩스
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.fax}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, fax: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={siteInfo.contact.email}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  웹사이트
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.website}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, website: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업자번호
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.businessNumber}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, businessNumber: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  계좌정보
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.accountInfo}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, accountInfo: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평일 운영시간
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.operatingHours.weekday}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { 
                      ...prev.contact, 
                      operatingHours: { ...prev.contact.operatingHours, weekday: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주말 운영시간
                </label>
                <input
                  type="text"
                  value={siteInfo.contact.operatingHours.weekend}
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    contact: { 
                      ...prev.contact, 
                      operatingHours: { ...prev.contact.operatingHours, weekend: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지도 URL
              </label>
              <input
                type="url"
                value={siteInfo.contact.mapUrl}
                onChange={(e) => setSiteInfo(prev => ({ 
                  ...prev, 
                  contact: { ...prev.contact, mapUrl: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'services' && (
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
                    onChange={(e) => setSiteInfo(prev => ({ 
                      ...prev, 
                      mainServices: {
                        ...prev.mainServices,
                        aboutMessage: {
                          ...prev.mainServices.aboutMessage,
                          title: e.target.value
                        }
                      }
                    }))}
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
                          onChange={(e) => {
                            const newKeywords = [...siteInfo.mainServices.aboutMessage.highlightKeywords]
                            newKeywords[index] = e.target.value
                            setSiteInfo(prev => ({
                              ...prev,
                              mainServices: {
                                ...prev.mainServices,
                                aboutMessage: {
                                  ...prev.mainServices.aboutMessage,
                                  highlightKeywords: newKeywords
                                }
                              }
                            }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="하이라이트할 키워드"
                        />
                        <button
                          onClick={() => {
                            const newKeywords = siteInfo.mainServices.aboutMessage.highlightKeywords.filter((_, i) => i !== index)
                            setSiteInfo(prev => ({
                              ...prev,
                              mainServices: {
                                ...prev.mainServices,
                                aboutMessage: {
                                  ...prev.mainServices.aboutMessage,
                                  highlightKeywords: newKeywords
                                }
                              }
                            }))
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newKeywords = [...siteInfo.mainServices.aboutMessage.highlightKeywords, ""]
                        setSiteInfo(prev => ({
                          ...prev,
                          mainServices: {
                            ...prev.mainServices,
                            aboutMessage: {
                              ...prev.mainServices.aboutMessage,
                              highlightKeywords: newKeywords
                            }
                          }
                        }))
                      }}
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
                  onChange={(e) => setSiteInfo(prev => ({ 
                    ...prev, 
                    mainServices: {
                      ...prev.mainServices,
                      aboutMessage: {
                        ...prev.mainServices.aboutMessage,
                        description: e.target.value
                      }
                    }
                  }))}
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
                  onClick={() => {
                    const newService = {
                      title: "",
                      description: "",
                      startYear: "",
                      order: siteInfo.mainServices.services.length + 1
                    }
                    setSiteInfo(prev => ({
                      ...prev,
                      mainServices: {
                        ...prev.mainServices,
                        services: [...prev.mainServices.services, newService]
                      }
                    }))
                  }}
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
                        onClick={() => {
                          const newServices = siteInfo.mainServices.services.filter((_, i) => i !== originalIndex)
                          setSiteInfo(prev => ({ 
                            ...prev, 
                            mainServices: {
                              ...prev.mainServices,
                              services: newServices
                            }
                          }))
                        }}
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
                          onChange={(e) => {
                            const newServices = [...siteInfo.mainServices.services]
                            newServices[originalIndex] = { ...service, title: e.target.value }
                            setSiteInfo(prev => ({ 
                              ...prev, 
                              mainServices: {
                                ...prev.mainServices,
                                services: newServices
                              }
                            }))
                          }}
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
                          onChange={(e) => {
                            const newServices = [...siteInfo.mainServices.services]
                            newServices[originalIndex] = { ...service, startYear: e.target.value }
                            setSiteInfo(prev => ({ 
                              ...prev, 
                              mainServices: {
                                ...prev.mainServices,
                                services: newServices
                              }
                            }))
                          }}
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
                        onChange={(e) => {
                          const newServices = [...siteInfo.mainServices.services]
                          newServices[originalIndex] = { ...service, description: e.target.value }
                          setSiteInfo(prev => ({ 
                            ...prev, 
                            mainServices: {
                              ...prev.mainServices,
                              services: newServices
                            }
                          }))
                        }}
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
                                onChange={(e) => {
                                  const newServices = [...siteInfo.mainServices.services]
                                  const newDetails = [...(service.details || [])]
                                  newDetails[detailIndex] = e.target.value
                                  newServices[originalIndex] = { ...service, details: newDetails }
                                  setSiteInfo(prev => ({ 
                                    ...prev, 
                                    mainServices: {
                                      ...prev.mainServices,
                                      services: newServices
                                    }
                                  }))
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="세부사항을 입력하세요"
                              />
                              <button
                                onClick={() => {
                                  const newServices = [...siteInfo.mainServices.services]
                                  const newDetails = (service.details || []).filter((_, i) => i !== detailIndex)
                                  newServices[originalIndex] = { ...service, details: newDetails }
                                  setSiteInfo(prev => ({ 
                                    ...prev, 
                                    mainServices: {
                                      ...prev.mainServices,
                                      services: newServices
                                    }
                                  }))
                                }}
                                className="text-red-600 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newServices = [...siteInfo.mainServices.services]
                              const newDetails = [...(service.details || []), ""]
                              newServices[originalIndex] = { ...service, details: newDetails }
                              setSiteInfo(prev => ({ 
                                ...prev, 
                                mainServices: {
                                  ...prev.mainServices,
                                  services: newServices
                                }
                              }))
                            }}
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
        )}

        {activeTab === 'images' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">이미지 설정</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 파비콘 설정 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
                  <UploadIcon className="w-5 h-5" />
                  <span>파비콘</span>
                </h3>
                
                {/* 파일 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 업로드
                  </label>
                  <SingleImageUpload
                    imageUrl={siteInfo.faviconUrl}
                    onImageChange={(url) => setSiteInfo(prev => ({ ...prev, faviconUrl: url }))}
                    category="favicon"
                    accept={['.ico', '.png']}
                    maxFileSize={1024 * 1024} // 1MB
                  />
                </div>
                
                {/* 또는 URL 직접 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    또는 URL 직접 입력
                  </label>
                  <input
                    type="url"
                    value={siteInfo.faviconUrl || ""}
                    onChange={(e) => setSiteInfo(prev => ({ ...prev, faviconUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    브라우저 탭에 표시되는 작은 아이콘 이미지 URL
                  </p>
                </div>
              </div>
              
              {/* 헤더 로고 설정 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
                  <UploadIcon className="w-5 h-5" />
                  <span>헤더 로고</span>
                </h3>
                
                {/* 파일 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 업로드
                  </label>
                  <SingleImageUpload
                    imageUrl={siteInfo.headerLogoUrl}
                    onImageChange={(url) => setSiteInfo(prev => ({ ...prev, headerLogoUrl: url }))}
                    category="logo"
                    accept={['.png', '.jpg', '.jpeg', '.svg']}
                    maxFileSize={2 * 1024 * 1024} // 2MB
                  />
                </div>
                
                {/* 또는 URL 직접 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    또는 URL 직접 입력
                  </label>
                  <input
                    type="url"
                    value={siteInfo.headerLogoUrl || ""}
                    onChange={(e) => setSiteInfo(prev => ({ ...prev, headerLogoUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    웹사이트 상단에 표시되는 로고 이미지 URL
                  </p>
                </div>
              </div>
            </div>
            
            {/* 전체 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">💡 이미지 업로드 방법</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>파일 업로드:</strong> 드래그 앤 드롭 또는 클릭하여 파일을 선택하면 자동으로 Firebase Storage에 업로드됩니다.</p>
                <p><strong>URL 입력:</strong> 외부 호스팅 서비스의 이미지 URL을 직접 입력할 수 있습니다.</p>
                <p><strong>자동 최적화:</strong> 업로드된 이미지는 자동으로 적절한 크기로 리사이즈됩니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}