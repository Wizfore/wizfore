import type { TabComponentProps } from './HomeManagement'

export function MainServicesTab({ data, setData }: TabComponentProps) {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">주요 사업 분야 섹션</h3>
        <p className="text-gray-600 mb-4">홈페이지 하단의 주요 사업 분야 영역을 완전히 관리합니다.</p>
      </div>

      {/* 소개 메시지 섹션 */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">소개 메시지</h2>
        
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
            placeholder="메인 서비스 소개 내용을 입력하세요. \\n\\n으로 문단을 구분할 수 있습니다."
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
  )
}