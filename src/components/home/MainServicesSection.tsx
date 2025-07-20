'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMainServices } from '@/lib/services/dataService'
import type { MainServices } from '@/types'

const MainServicesSection = () => {
  const [mainServicesData, setMainServicesData] = useState<MainServices | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMainServicesData = async () => {
      try {
        const data = await getMainServices()
        setMainServicesData(data)
      } catch (error) {
        console.error('Error fetching main services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMainServicesData()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-wizfore-light-beige">
        <div className="container-custom mx-auto px-4 text-center">
          <div className="animate-pulse text-wizfore-text-primary">주요 사업 정보를 불러오는 중...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-wizfore-text-primary mb-6">
            {mainServicesData?.aboutMessage.title || '"주요 사업 분야"'}
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-wizfore-text-primary">
            {mainServicesData?.aboutMessage.description.split('\n\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-lg text-wizfore-text-primary"
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

        <div className="max-w-5xl mx-auto space-y-8">
          {mainServicesData?.services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-l-4 border-wizfore-coral-primary pl-8 py-6"
              >
                <div className="flex items-start gap-6">
                  {/* 번호 배지 */}
                  <div className="w-10 h-10 bg-wizfore-light-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-wizfore-coral-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  
                  {/* 서비스 내용 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-wizfore-text-primary mb-2">
                      {service.title}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* 제공 서비스 */}
                      <div className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <p className="text-wizfore-text-primary">
                          <span className="font-semibold">제공 서비스: </span>
                          {service.description}
                        </p>
                      </div>
                      
                      {/* 운영 기간 */}
                      <div className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <p className="text-wizfore-text-primary">
                          <span className="font-semibold">운영 기간: </span>
                          {service.startYear}년부터 시작
                        </p>
                      </div>
                      
                      {/* 세부 프로그램 */}
                      {service.details && service.details.length > 0 && (
                        <div className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-wizfore-coral-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <div className="text-wizfore-text-primary">
                            <span className="font-semibold">세부 프로그램:</span>
                            <div className="mt-2 ml-2 space-y-1">
                              {service.details.map((detail: string, detailIndex: number) => (
                                <div key={detailIndex} className="flex items-start text-sm text-wizfore-text-secondary">
                                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
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