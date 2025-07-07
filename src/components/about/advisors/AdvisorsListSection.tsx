'use client'

import { motion } from 'framer-motion'
import type { AdvisorInfo } from '@/types'

interface AdvisorsListSectionProps {
  advisors: AdvisorInfo[]
  aboutMessage?: {
    title: string
    description: string
  }
  loading?: boolean
}

const AdvisorsListSection: React.FC<AdvisorsListSectionProps> = ({ advisors = [], aboutMessage, loading = false }) => {
  // 자문위원 전문분야별 기본 이미지 결정
  const getDefaultImage = (position: string[] | string = []) => {
    const positionArray = Array.isArray(position) ? position : [position].filter(Boolean)
    const positionStr = positionArray.join(' ')
    if (positionStr.includes('교수')) {
      return '/images/advisors/defaultProfessorM.png'
    } else if (positionStr.includes('원장') || positionStr.includes('대표')) {
      return '/images/advisors/defaultDirectorW.png'
    } else if (positionStr.includes('경찰') || positionStr.includes('경감')) {
      return '/images/advisors/defaultPoliceM.png'
    } else if (positionStr.includes('약사')) {
      return '/images/advisors/defaultPharmacistW.png'
    } else {
      return '/images/advisors/defaultProfessorM.png' // 기본값
    }
  }

  const getAdvisorTitle = (position: string[] | string = []) => {
    const positionArray = Array.isArray(position) ? position : [position].filter(Boolean)
    const positionStr = positionArray.join(' ')
    if (positionStr.includes('교수')) return '교수'
    if (positionStr.includes('원장')) return '원장'
    if (positionStr.includes('대표')) return '대표'
    if (positionStr.includes('약사')) return '약사'
    if (positionStr.includes('경찰') || positionStr.includes('경감')) return '경찰'
    return '전문가'
  }

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden">
      <div className="container-custom mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {aboutMessage?.title && (
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
              {aboutMessage.title}
            </h2>
          )}
          {aboutMessage?.description && (
            <div className="text-lg text-wizfore-text-secondary leading-relaxed mb-12">
              <p className="whitespace-pre-line">
                {aboutMessage.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* 자문위원 목록 */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {loading ? (
            // 로딩 스켈레톤
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 animate-pulse">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                  <div className="flex flex-col items-center justify-center lg:col-span-1">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gray-200 rounded-full mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : advisors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-wizfore-text-secondary text-lg">자문위원 정보가 없습니다.</p>
            </div>
          ) : (
            advisors
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((advisor, index) => (
                <motion.div
                  key={`${advisor.name}-${advisor.order || index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 lg:p-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* 전체 구조: 좌우로 분할 (1:2 비율) */}
                  <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* 좌측: 프로필 아이콘 및 기본 정보 */}
                    <motion.div
                      className="flex flex-col items-center justify-center text-center lg:col-span-1"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* 프로필 이미지 */}
                      <div className="relative w-40 h-40 lg:w-48 lg:h-48 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-wizfore-coral-primary/20 to-wizfore-soft-pink/20 rounded-full" />
                        <div className="relative w-full h-full bg-wizfore-light-beige rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img 
                            src={advisor.imageUrl || getDefaultImage(advisor.position)} 
                            alt={`${advisor.name} 자문위원`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = getDefaultImage(advisor.position)
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* 이름과 직책 */}
                      <h3 className="text-2xl lg:text-3xl font-black text-wizfore-text-primary mb-2">
                        {advisor.name || '이름 없음'}
                      </h3>
                      <p className="text-lg lg:text-xl text-wizfore-coral-primary font-bold mb-4">
                        {getAdvisorTitle(advisor.position)}
                      </p>
                    </motion.div>

                    {/* 우측: 상세 정보 */}
                    <motion.div
                      className="space-y-6 lg:col-span-2"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {/* 현재 직책 */}
                      {advisor.position && Array.isArray(advisor.position) && advisor.position.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                            현재 직책
                          </h4>
                          <div className="space-y-1">
                            {advisor.position.map((pos, posIndex) => (
                              <div key={posIndex} className="flex items-center">
                                <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                                <p className="text-base text-wizfore-text-primary leading-relaxed break-words">
                                  {pos}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 학력 */}
                      {advisor.education && Array.isArray(advisor.education) && advisor.education.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                            학력
                          </h4>
                          <div className="space-y-1">
                            {advisor.education.map((edu, eduIndex) => (
                              <div key={eduIndex} className="flex items-center">
                                <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                                <p className="text-base text-wizfore-text-primary leading-relaxed break-words">
                                  {edu}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 주요 경력 */}
                      {advisor.career && Array.isArray(advisor.career) && advisor.career.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                            주요 경력
                          </h4>
                          <div className="space-y-2">
                            {advisor.career.map((career, careerIndex) => (
                              <div key={careerIndex} className="flex items-center">
                                <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                                <p className="text-base text-wizfore-text-primary leading-relaxed break-words">
                                  {career}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
    </section>
  )
}

export default AdvisorsListSection