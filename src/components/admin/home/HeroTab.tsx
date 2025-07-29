import type { TabComponentProps } from './HomeManagement'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

export function HeroTab({ data, setData }: TabComponentProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">히어로 섹션 관리</h3>
        <p className="text-gray-600 mb-4">메인 페이지 상단의 슬라이더 배너를 관리합니다.</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* 텍스트 컨텐츠 */}
                  <div className="space-y-3">
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
                    <div>
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
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  {/* 배경 이미지 업로드 */}
                  <div>
                    <label className="block text-xs font-medium mb-1">배경 이미지</label>
                    <ImageUpload
                      value={slide.backgroundImage || ''}
                      onChange={(url: string) => {
                        const newSlides = [...(data?.hero?.slides || [])]
                        newSlides[index] = { ...newSlides[index], backgroundImage: url }
                        setData(prev => ({
                          ...prev!,
                          hero: {
                            ...prev!.hero,
                            slides: newSlides
                          }
                        }))
                      }}
                      folder={`home/hero/slide-${slide.id}`}
                      defaultImageUrl={slide.defaultBackgroundImage}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}