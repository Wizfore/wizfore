'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Heart, Calendar } from 'lucide-react'
import { getMainServices } from '@/lib/services/dataService'
import type { MainServices } from '@/types'

const serviceIcons = {
  1: Building2,
  2: Users,
  3: Heart,
  4: Calendar
}

const serviceColors = {
  1: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600'
  },
  2: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600'
  },
  3: {
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600'
  },
  4: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600'
  }
}

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
            {mainServicesData?.aboutMessage.description.split('\n\n').map((paragraph, index) => {
              const highlightKeywords = mainServicesData.aboutMessage.highlightKeywords || []
              let processedParagraph = paragraph
              
              highlightKeywords.forEach(keyword => {
                processedParagraph = processedParagraph.replace(
                  keyword,
                  `<strong className="text-wizfore-text-brand">${keyword}</strong>`
                )
              })
              
              return (
                <p 
                  key={index} 
                  className={index === 0 ? "text-lg" : "text-base text-wizfore-text-secondary"}
                  dangerouslySetInnerHTML={{ __html: processedParagraph }}
                />
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {mainServicesData?.services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => {
              const IconComponent = serviceIcons[service.order as keyof typeof serviceIcons] || Building2
              const colors = serviceColors[service.order as keyof typeof serviceColors] || serviceColors[1]
              
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${colors.bgColor} border-2 ${colors.borderColor} rounded-xl p-8 hover:shadow-lg transition-all duration-300`}
                >
                  {/* 헤더 */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-wizfore-text-primary text-xl leading-tight mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-wizfore-text-secondary">
                        ({service.startYear}년부터 운영)
                      </p>
                    </div>
                  </div>

                  {/* 설명 */}
                  <div className="mb-6">
                    <p className="text-wizfore-text-primary text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* 세부 내용 */}
                  {service.details && service.details.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-wizfore-text-primary text-sm">세부 서비스:</h4>
                      <ul className="space-y-1">
                        {service.details.map((detail: string, detailIndex: number) => (
                          <li key={detailIndex} className="text-wizfore-text-secondary text-sm flex items-start">
                            <span className="w-1.5 h-1.5 bg-wizfore-warm-brown rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )
            })}
        </div>

      </div>
    </section>
  )
}

export default MainServicesSection