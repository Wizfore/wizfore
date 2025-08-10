'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMainServices, getHomeConfig } from '@/lib/services/dataService'
import type { MainServices } from '@/types'

interface MainServicesConfig {
  enabled: boolean
  showSubPrograms: boolean
}

const MainServicesSection = () => {
  const [mainServicesData, setMainServicesData] = useState<MainServices | null>(null)
  const [config, setConfig] = useState<MainServicesConfig>({ enabled: true, showSubPrograms: true })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMainServicesData = async () => {
      try {
        const [mainServicesData, homeConfig] = await Promise.all([
          getMainServices(),
          getHomeConfig().catch(() => null)
        ])
        
        setMainServicesData(mainServicesData)
        
        // HomeConfig에서 MainServices 설정 가져오기
        if (homeConfig?.sections?.mainServices) {
          setConfig({
            enabled: homeConfig.sections.mainServices.enabled ?? true,
            showSubPrograms: homeConfig.sections.mainServices.showSubPrograms ?? true
          })
        }
      } catch (error) {
        console.error('Error fetching main services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMainServicesData()
  }, [])

  // enabled가 false면 섹션을 렌더링하지 않음
  if (!config.enabled) {
    return null
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-wizfore-soft-pink via-wizfore-soft-pink via-85% to-white">
        <div className="container-custom mx-auto px-4 text-center">
          <div className="animate-pulse text-wizfore-text-primary">주요 사업 정보를 불러오는 중...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-wizfore-soft-pink via-wizfore-soft-pink via-85% to-white">
      <div className="container-custom mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-wizfore-text-primary mb-4 md:mb-6">
            {mainServicesData?.aboutMessage.title || '"주요 사업 분야"'}
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg text-wizfore-text-primary">
            {mainServicesData?.aboutMessage.description.split('\n\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-sm md:text-base lg:text-lg text-wizfore-text-primary"
              >
                {paragraph.split(' ').map((word, wordIndex) => {
                  const highlightKeywords = mainServicesData.aboutMessage.highlightKeywords || []
                  const shouldHighlight = highlightKeywords.some(keyword => word.includes(keyword))
                  
                  return shouldHighlight ? (
                    <strong key={wordIndex} className="text-wizfore-text-brand font-semibold"> {word}</strong>
                  ) : (
                    <span key={wordIndex}> {word}</span>
                  )
                })}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8 mb-16 md:mb-24 lg:mb-32">
          {mainServicesData?.services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                className="border-l-4 border-wizfore-coral-primary pl-4 md:pl-6 lg:pl-8 py-4 md:py-6 hover:bg-wizfore-warm-beige/20 rounded-r-lg transition-all duration-300 card-hover"
              >
                <div className="flex items-start gap-3 md:gap-4 lg:gap-6">
                  {/* 번호 배지 */}
                  <div className="w-7 md:w-8 lg:w-10 h-7 md:h-8 lg:h-10 bg-wizfore-light-beige rounded-full flex items-center justify-center flex-shrink-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <span className="text-wizfore-coral-primary font-bold text-sm md:text-base lg:text-lg">{index + 1}</span>
                  </div>
                  
                  {/* 서비스 내용 */}
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-wizfore-text-primary mb-2">
                      {service.title}
                    </h3>
                    
                    <div className="space-y-2 md:space-y-3 lg:space-y-4">
                      {/* 제공 서비스 */}
                      <div className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0"></span>
                        <p className="text-xs md:text-sm lg:text-base text-wizfore-text-primary">
                          <span className="font-semibold">제공 서비스: </span>
                          {service.description}
                        </p>
                      </div>
                      
                      {/* 운영 기간 */}
                      <div className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0"></span>
                        <p className="text-xs md:text-sm lg:text-base text-wizfore-text-primary">
                          <span className="font-semibold">운영 기간: </span>
                          {service.startYear}년부터 시작
                        </p>
                      </div>
                      
                      {/* 세부 프로그램 */}
                      {config.showSubPrograms && service.details && service.details.length > 0 && (
                        <div className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0"></span>
                          <div className="text-xs md:text-sm lg:text-base text-wizfore-text-primary">
                            <span className="font-semibold">세부 프로그램:</span>
                            <div className="mt-1 md:mt-2 ml-1 md:ml-2 space-y-0.5 md:space-y-1">
                              {service.details.map((detail: string, detailIndex: number) => (
                                <div key={detailIndex} className="flex items-start text-xs md:text-sm text-wizfore-text-secondary">
                                  <span className="text-green-500 mr-1.5 md:mr-2 mt-0.5">✓</span>
                                  {detail}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

      </div>
    </section>
  )
}

export default MainServicesSection