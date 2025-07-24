'use client'

import { useState, useCallback } from 'react'
import { Monitor, Grid3X3, Settings, Briefcase, Loader2 } from 'lucide-react'
import { getHomeConfig, updateHomeConfig } from '@/lib/services/dataService'
import { defaultHomeConfig } from '@/lib/data/defaultHomeConfig'
import { useAdminForm } from '@/hooks/useAdminForm'
import { AdminTabsWithUnsavedChanges } from '@/components/admin/common/AdminTabsWithUnsavedChanges'
import { AdminPageHeader } from '@/components/admin/common/AdminPageHeader'
import { TabItem } from '@/components/admin/common/AdminTabs'
import type { HomeConfig } from '@/types'

type HomeTab = 'hero' | 'categories' | 'programs' | 'mainservices'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('hero')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<HomeTab | null>(null)
  const [dialogSaving, setDialogSaving] = useState(false)

  // fetchData 함수
  const fetchData = useCallback(async (): Promise<HomeConfig> => {
    try {
      const data = await getHomeConfig()
      return data as HomeConfig
    } catch (error) {
      console.log('홈 설정을 불러올 수 없어 기본값을 사용합니다:', error)
      return defaultHomeConfig
    }
  }, [])

  // saveData 함수
  const saveData = useCallback(async (data: HomeConfig): Promise<void> => {
    await updateHomeConfig(data)
  }, [])

  // 폼 검증 함수
  const validateHomeConfig = (data: HomeConfig): string[] => {
    const errors = []
    
    // Hero 섹션 검증
    if (data.hero?.enabled) {
      if (!data.hero.slides || data.hero.slides.length === 0) {
        errors.push('활성화된 Hero 섹션에는 최소 1개의 슬라이드가 필요합니다.')
      } else {
        data.hero.slides.forEach((slide, index) => {
          if (!slide.title.trim()) errors.push(`슬라이드 ${index + 1}의 제목은 필수입니다.`)
          if (!slide.description.trim()) errors.push(`슬라이드 ${index + 1}의 설명은 필수입니다.`)
        })
      }
    }

    // CategoryCards 섹션 검증
    if (data.sections?.categoryCards?.enabled) {
      if (!data.sections.categoryCards.title?.trim()) {
        errors.push('카테고리 카드 섹션의 제목은 필수입니다.')
      }
    }

    // ProgramGrid 섹션 검증  
    if (data.sections?.programGrid?.enabled) {
      if (!data.sections.programGrid.title?.trim()) {
        errors.push('프로그램 그리드 섹션의 제목은 필수입니다.')
      }
    }

    // MainServices 섹션 검증
    if (data.sections?.mainServices?.enabled) {
      if (!data.sections.mainServices.aboutMessage?.title?.trim()) {
        errors.push('주요 사업 분야 소개 메시지의 제목은 필수입니다.')
      }
      if (!data.sections.mainServices.aboutMessage?.description?.trim()) {
        errors.push('주요 사업 분야 소개 메시지의 설명은 필수입니다.')
      }
      
      // 서비스 목록 검증 (빈 서비스는 제외)
      data.sections.mainServices.services?.forEach((service, index) => {
        // 모든 필드가 비어있는 서비스는 검증에서 제외
        if (!service.title?.trim() && !service.description?.trim() && !service.startYear?.trim()) {
          return
        }
        
        // 하나라도 필드가 있으면 모든 필드 검증
        if (!service.title?.trim()) errors.push(`서비스 ${index + 1}의 제목은 필수입니다.`)
        if (!service.description?.trim()) errors.push(`서비스 ${index + 1}의 설명은 필수입니다.`)
        if (!service.startYear?.trim()) errors.push(`서비스 ${index + 1}의 시작년도는 필수입니다.`)
      })
    }

    return errors
  }

  const {
    data,
    setData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  } = useAdminForm<HomeConfig>({
    fetchData,
    saveData,
    defaultData: defaultHomeConfig,
    validate: validateHomeConfig
  })

  const handleTabChange = useCallback((newTab: HomeTab) => {
    if (hasChanges) {
      setPendingTab(newTab)
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(newTab)
    }
  }, [hasChanges])

  const handleSaveAndSwitch = async () => {
    setDialogSaving(true)
    try {
      await handleSave()
      if (pendingTab) {
        setActiveTab(pendingTab)
        setPendingTab(null)
      }
      setShowUnsavedDialog(false)
    } catch (error) {
      console.error('저장 실패:', error)
    } finally {
      setDialogSaving(false)
    }
  }

  const handleDiscardAndSwitch = () => {
    handleReset()
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
    setShowUnsavedDialog(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>홈페이지 설정을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  const tabs: TabItem<HomeTab>[] = [
    {
      key: 'hero',
      label: '히어로 섹션',
      icon: Monitor
    },
    {
      key: 'categories', 
      label: '카테고리 카드',
      icon: Grid3X3
    },
    {
      key: 'programs',
      label: '프로그램 그리드',
      icon: Settings
    },
    {
      key: 'mainservices',
      label: '주요 사업 분야',
      icon: Briefcase
    }
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="홈페이지 관리"
        description="메인 페이지의 레이아웃과 섹션 설정을 관리합니다"
        error={error}
        saveStatus={saveStatus}
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
      />

      <AdminTabsWithUnsavedChanges
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasChanges={hasChanges}
        showUnsavedDialog={showUnsavedDialog}
        onDialogSave={handleSaveAndSwitch}
        onDialogDiscard={handleDiscardAndSwitch}
        onDialogCancel={() => {
          setShowUnsavedDialog(false)
          setPendingTab(null)
        }}
        saving={dialogSaving}
      />

      <div className="bg-white rounded-lg border">
        {activeTab === 'hero' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">히어로 섹션 관리</h3>
              <p className="text-gray-600 mb-4">메인 페이지 상단의 슬라이더 배너를 관리합니다.</p>
            </div>

            {/* 여기서 관리하는 데이터 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ 이 페이지에서 관리</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 슬라이더 자동재생 설정</li>
                <li>• 슬라이드별 제목과 설명 텍스트</li>
                <li>• 슬라이드별 버튼 텍스트와 링크</li>
                <li>• 슬라이드별 배경 이미지</li>
                <li>• 슬라이드 순서 및 활성화 설정</li>
              </ul>
            </div>

            {/* 실제 편집 폼 영역 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3">슬라이더 설정</h4>
              
              {/* 자동재생 설정 */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">자동재생</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="autoPlay"
                    checked={data?.hero?.autoPlay || false}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      hero: {
                        ...prev!.hero,
                        autoPlay: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoPlay" className="text-sm">활성화</label>
                </div>
              </div>

              {/* 슬라이드 목록 */}
              <div>
                <h5 className="text-sm font-medium mb-2">슬라이드 목록</h5>
                <div className="space-y-3">
                  {data?.hero?.slides?.map((slide, index) => (
                    <div key={slide.id} className="border border-gray-200 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">슬라이드 {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            checked={slide.enabled}
                            onChange={(e) => {
                              const newSlides = [...(data?.hero?.slides || [])]
                              newSlides[index] = { ...newSlides[index], enabled: e.target.checked }
                              setData(prev => ({
                                ...prev!,
                                hero: {
                                  ...prev!.hero,
                                  slides: newSlides
                                }
                              }))
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs">활성화</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">제목</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const newSlides = [...(data?.hero?.slides || [])]
                              newSlides[index] = { ...newSlides[index], title: e.target.value }
                              setData(prev => ({
                                ...prev!,
                                hero: {
                                  ...prev!.hero,
                                  slides: newSlides
                                }
                              }))
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">버튼 텍스트</label>
                          <input
                            type="text"
                            value={slide.categoryText}
                            onChange={(e) => {
                              const newSlides = [...(data?.hero?.slides || [])]
                              newSlides[index] = { ...newSlides[index], categoryText: e.target.value }
                              setData(prev => ({
                                ...prev!,
                                hero: {
                                  ...prev!.hero,
                                  slides: newSlides
                                }
                              }))
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-medium mb-1">설명</label>
                        <textarea
                          value={slide.description}
                          onChange={(e) => {
                            const newSlides = [...(data?.hero?.slides || [])]
                            newSlides[index] = { ...newSlides[index], description: e.target.value }
                            setData(prev => ({
                              ...prev!,
                              hero: {
                                ...prev!.hero,
                                slides: newSlides
                              }
                            }))
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">카테고리 카드 섹션</h3>
              <p className="text-gray-600 mb-4">4대 프로그램 카테고리 영역의 설정을 관리합니다.</p>
            </div>

            {/* 여기서 관리하는 데이터 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ 이 페이지에서 관리</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 섹션 제목 ("위즈포레 프로그램")</li>
                <li>• 섹션 설명 텍스트</li>
                <li>• 섹션 활성화/비활성화</li>
              </ul>
            </div>

            {/* 다른 곳에서 관리하는 데이터 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">ℹ️ 다른 페이지에서 관리</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 카테고리별 프로그램 목록 → <strong>프로그램 관리</strong> 페이지</li>
                <li>• 카테고리 이름 및 설명 → <strong>프로그램 관리</strong> 페이지</li>
                <li>• 카테고리별 아이콘 → <strong>프로그램 관리</strong> 페이지</li>
              </ul>
            </div>

            {/* 실제 편집 폼 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3">카테고리 카드 섹션 설정</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">섹션 활성화</label>
                  <input 
                    type="checkbox"
                    checked={data?.sections?.categoryCards?.enabled || false}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        categoryCards: {
                          title: prev!.sections?.categoryCards?.title || '',
                          description: prev!.sections?.categoryCards?.description || '',
                          enabled: e.target.checked
                        }
                      }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">섹션 제목</label>
                  <input
                    type="text"
                    value={data?.sections?.categoryCards?.title || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        categoryCards: {
                          title: e.target.value,
                          description: prev!.sections?.categoryCards?.description || '',
                          enabled: prev!.sections?.categoryCards?.enabled || false
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="위즈포레 프로그램"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">섹션 설명</label>
                  <textarea
                    value={data?.sections?.categoryCards?.description || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        categoryCards: {
                          title: prev!.sections?.categoryCards?.title || '',
                          description: e.target.value,
                          enabled: prev!.sections?.categoryCards?.enabled || false
                        }
                      }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="다양한 영역의 전문 프로그램을 제공합니다"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">프로그램 그리드 섹션</h3>
              <p className="text-gray-600 mb-4">12개 세부 프로그램 목록 영역의 설정을 관리합니다.</p>
            </div>

            {/* 여기서 관리하는 데이터 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ 이 페이지에서 관리</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 섹션 제목 ("세부 전문 프로그램")</li>
                <li>• 섹션 설명 텍스트</li>
                <li>• 프로그램별 아이콘 매핑 설정</li>
                <li>• 섹션 활성화/비활성화</li>
              </ul>
            </div>

            {/* 다른 곳에서 관리하는 데이터 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">ℹ️ 다른 페이지에서 관리</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 프로그램 이름, 목표, 내용 → <strong>프로그램 관리</strong> 페이지</li>
                <li>• 프로그램 카테고리 분류 → <strong>프로그램 관리</strong> 페이지</li>
                <li>• 프로그램 순서 → <strong>프로그램 관리</strong> 페이지</li>
              </ul>
            </div>

            {/* 센터 소개 안내 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">⚠️ 참고사항</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 센터 소개 영역 ("함께 걷는 성장의 길") → <strong>About 관리</strong> 페이지</li>
              </ul>
            </div>

            {/* 실제 편집 폼 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3">프로그램 그리드 섹션 설정</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">섹션 활성화</label>
                  <input 
                    type="checkbox"
                    checked={data?.sections?.programGrid?.enabled || false}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        programGrid: {
                          title: prev!.sections?.programGrid?.title || '',
                          description: prev!.sections?.programGrid?.description || '',
                          enabled: e.target.checked,
                          iconMappings: prev!.sections?.programGrid?.iconMappings || []
                        }
                      }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">섹션 제목</label>
                  <input
                    type="text"
                    value={data?.sections?.programGrid?.title || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        programGrid: {
                          title: e.target.value,
                          description: prev!.sections?.programGrid?.description || '',
                          enabled: prev!.sections?.programGrid?.enabled || false,
                          iconMappings: prev!.sections?.programGrid?.iconMappings || []
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="세부 전문 프로그램"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">섹션 설명</label>
                  <textarea
                    value={data?.sections?.programGrid?.description || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        programGrid: {
                          title: prev!.sections?.programGrid?.title || '',
                          description: e.target.value,
                          enabled: prev!.sections?.programGrid?.enabled || false,
                          iconMappings: prev!.sections?.programGrid?.iconMappings || []
                        }
                      }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">아이콘 매핑</label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p>프로그램별 아이콘 매핑 설정 기능은 추후 구현 예정입니다.</p>
                    <p className="mt-1">현재는 자동 매핑 시스템이 작동 중입니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mainservices' && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">주요 사업 분야 섹션</h3>
              <p className="text-gray-600 mb-4">홈페이지 하단의 주요 사업 분야 영역을 완전히 관리합니다.</p>
            </div>

            {/* 여기서 관리하는 데이터 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ 이 페이지에서 관리</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 소개 메시지 (제목, 설명, 하이라이트 키워드)</li>
                <li>• 서비스 목록 (제목, 설명, 세부사항, 시작년도)</li>
                <li>• 섹션 활성화/비활성화 및 하위 프로그램 표시 설정</li>
              </ul>
            </div>

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
                    value={data?.sections?.mainServices?.aboutMessage?.title || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        mainServices: {
                          ...prev!.sections?.mainServices,
                          aboutMessage: {
                            title: e.target.value,
                            description: prev!.sections?.mainServices?.aboutMessage?.description || '',
                            highlightKeywords: prev!.sections?.mainServices?.aboutMessage?.highlightKeywords || []
                          },
                          services: prev!.sections?.mainServices?.services || [],
                          enabled: prev!.sections?.mainServices?.enabled ?? true,
                          showSubPrograms: prev!.sections?.mainServices?.showSubPrograms ?? true
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
                    {(data?.sections?.mainServices?.aboutMessage?.highlightKeywords || []).map((keyword, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => {
                            const newKeywords = [...(data?.sections?.mainServices?.aboutMessage?.highlightKeywords || [])]
                            newKeywords[index] = e.target.value
                            setData(prev => ({
                              ...prev!,
                              sections: {
                                ...prev!.sections,
                                mainServices: {
                                  ...prev!.sections?.mainServices,
                                  aboutMessage: {
                                    ...prev!.sections?.mainServices?.aboutMessage,
                                    highlightKeywords: newKeywords
                                  }
                                }
                              }
                            }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="하이라이트할 키워드"
                        />
                        <button
                          onClick={() => {
                            const newKeywords = (data?.sections?.mainServices?.aboutMessage?.highlightKeywords || []).filter((_, i) => i !== index)
                            setData(prev => ({
                              ...prev!,
                              sections: {
                                ...prev!.sections,
                                mainServices: {
                                  ...prev!.sections?.mainServices,
                                  aboutMessage: {
                                    title: prev!.sections?.mainServices?.aboutMessage?.title || '',
                                    description: prev!.sections?.mainServices?.aboutMessage?.description || '',
                                    highlightKeywords: newKeywords
                                  },
                                  services: prev!.sections?.mainServices?.services || [],
                                  enabled: prev!.sections?.mainServices?.enabled ?? true,
                                  showSubPrograms: prev!.sections?.mainServices?.showSubPrograms ?? true
                                }
                              }
                            }))
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newKeywords = [...(data?.sections?.mainServices?.aboutMessage?.highlightKeywords || []), '']
                        setData(prev => ({
                          ...prev!,
                          sections: {
                            ...prev!.sections,
                            mainServices: {
                              ...prev!.sections?.mainServices,
                              aboutMessage: {
                                title: prev!.sections?.mainServices?.aboutMessage?.title || '',
                                description: prev!.sections?.mainServices?.aboutMessage?.description || '',
                                highlightKeywords: newKeywords
                              },
                              services: prev!.sections?.mainServices?.services || [],
                              enabled: prev!.sections?.mainServices?.enabled ?? true,
                              showSubPrograms: prev!.sections?.mainServices?.showSubPrograms ?? true
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
                  value={data?.sections?.mainServices?.aboutMessage?.description || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev!,
                    sections: {
                      ...prev!.sections,
                      mainServices: {
                        ...prev!.sections?.mainServices,
                        aboutMessage: {
                          title: prev!.sections?.mainServices?.aboutMessage?.title || '',
                          description: e.target.value,
                          highlightKeywords: prev!.sections?.mainServices?.aboutMessage?.highlightKeywords || []
                        },
                        services: prev!.sections?.mainServices?.services || [],
                        enabled: prev!.sections?.mainServices?.enabled ?? true,
                        showSubPrograms: prev!.sections?.mainServices?.showSubPrograms ?? true
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
                      title: '',
                      description: '',
                      details: [],
                      startYear: '',
                      order: (data?.sections?.mainServices?.services?.length || 0) + 1
                    }
                    setData(prev => ({
                      ...prev!,
                      sections: {
                        ...prev!.sections,
                        mainServices: {
                          ...prev!.sections?.mainServices,
                          aboutMessage: {
                            title: prev!.sections?.mainServices?.aboutMessage?.title || '',
                            description: prev!.sections?.mainServices?.aboutMessage?.description || '',
                            highlightKeywords: prev!.sections?.mainServices?.aboutMessage?.highlightKeywords || []
                          },
                          services: [...(prev!.sections?.mainServices?.services || []), newService],
                          enabled: prev!.sections?.mainServices?.enabled ?? true,
                          showSubPrograms: prev!.sections?.mainServices?.showSubPrograms ?? true
                        }
                      }
                    }))
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>서비스 추가</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {(data?.sections?.mainServices?.services || []).slice().reverse().map((service, reversedIndex) => {
                  const originalIndex = (data?.sections?.mainServices?.services?.length || 0) - 1 - reversedIndex
                  return (
                    <div key={originalIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">서비스 {originalIndex + 1}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newServices = (data?.sections?.mainServices?.services || []).filter((_, i) => i !== originalIndex)
                            setData(prev => ({
                              ...prev!,
                              sections: {
                                ...prev!.sections,
                                mainServices: {
                                  ...prev!.sections?.mainServices,
                                  services: newServices
                                }
                              }
                            }))
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
                              const newServices = [...(data?.sections?.mainServices?.services || [])]
                              newServices[originalIndex] = { ...newServices[originalIndex], title: e.target.value }
                              setData(prev => ({
                                ...prev!,
                                sections: {
                                  ...prev!.sections,
                                  mainServices: {
                                    ...prev!.sections?.mainServices,
                                    services: newServices
                                  }
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
                              const newServices = [...(data?.sections?.mainServices?.services || [])]
                              newServices[originalIndex] = { ...newServices[originalIndex], startYear: e.target.value }
                              setData(prev => ({
                                ...prev!,
                                sections: {
                                  ...prev!.sections,
                                  mainServices: {
                                    ...prev!.sections?.mainServices,
                                    services: newServices
                                  }
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
                            const newServices = [...(data?.sections?.mainServices?.services || [])]
                            newServices[originalIndex] = { ...newServices[originalIndex], description: e.target.value }
                            setData(prev => ({
                              ...prev!,
                              sections: {
                                ...prev!.sections,
                                mainServices: {
                                  ...prev!.sections?.mainServices,
                                  services: newServices
                                }
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
                                    const newServices = [...(data?.sections?.mainServices?.services || [])]
                                    const newDetails = [...(newServices[originalIndex].details || [])]
                                    newDetails[detailIndex] = e.target.value
                                    newServices[originalIndex] = { ...newServices[originalIndex], details: newDetails }
                                    setData(prev => ({
                                      ...prev!,
                                      sections: {
                                        ...prev!.sections,
                                        mainServices: {
                                          ...prev!.sections?.mainServices,
                                          services: newServices
                                        }
                                      }
                                    }))
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="세부사항을 입력하세요"
                                />
                                <button
                                  onClick={() => {
                                    const newServices = [...(data?.sections?.mainServices?.services || [])]
                                    const newDetails = (newServices[originalIndex].details || []).filter((_, i) => i !== detailIndex)
                                    newServices[originalIndex] = { ...newServices[originalIndex], details: newDetails }
                                    setData(prev => ({
                                      ...prev!,
                                      sections: {
                                        ...prev!.sections,
                                        mainServices: {
                                          ...prev!.sections?.mainServices,
                                          services: newServices
                                        }
                                      }
                                    }))
                                  }}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newServices = [...(data?.sections?.mainServices?.services || [])]
                                const newDetails = [...(newServices[originalIndex].details || []), '']
                                newServices[originalIndex] = { ...newServices[originalIndex], details: newDetails }
                                setData(prev => ({
                                  ...prev!,
                                  sections: {
                                    ...prev!.sections,
                                    mainServices: {
                                      ...prev!.sections?.mainServices,
                                      services: newServices
                                    }
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

            {/* 표시 설정 섹션 */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">표시 설정</h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">섹션 표시</label>
                    <input 
                      type="checkbox"
                      checked={data?.sections?.mainServices?.enabled || false}
                      onChange={(e) => setData(prev => ({
                        ...prev!,
                        sections: {
                          ...prev!.sections,
                          mainServices: {
                            ...prev!.sections?.mainServices,
                            enabled: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">하위 프로그램 표시</label>
                    <input 
                      type="checkbox"
                      checked={data?.sections?.mainServices?.showSubPrograms || false}
                      onChange={(e) => setData(prev => ({
                        ...prev!,
                        sections: {
                          ...prev!.sections,
                          mainServices: {
                            ...prev!.sections?.mainServices,
                            showSubPrograms: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">설정 안내</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• <strong>섹션 표시</strong>: 홈페이지에서 주요 사업 분야 섹션을 보여줄지 설정합니다.</p>
                      <p>• <strong>하위 프로그램 표시</strong>: 각 사업 분야의 세부 프로그램 목록을 함께 표시할지 설정합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}