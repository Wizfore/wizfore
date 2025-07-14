'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAboutSectionData } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import type { DefaultSiteData } from '@/types'

interface AboutSectionData {
  siteName: string
  director: DefaultSiteData['aboutInfo']['director']
}

interface AboutSectionProps {
  aboutData?: AboutSectionData
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutData }) => {
  const [data, setData] = useState<AboutSectionData | null>(aboutData || null)
  const [loading, setLoading] = useState(!aboutData)

  useEffect(() => {
    const fetchData = async () => {
      if (aboutData) {
        setData(aboutData)
        setLoading(false)
      } else {
        try {
          const fetchedData = await getAboutSectionData()
          setData(fetchedData)
        } catch (error) {
          console.error('Error fetching AboutSection data, using fallback:', error)
          // DB 실패 시 기본 데이터 사용
          setData({
            siteName: defaultSiteData.siteInfo.name,
            director: defaultSiteData.aboutInfo.director
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [aboutData])

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-300 rounded mx-auto w-80"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded w-48 ml-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const title = data?.director?.aboutMessage?.title || "함께 걷는 성장의 길"
  const description = data?.director?.aboutMessage?.description || "영유아부터 성인까지 온 가족이 함께하는 종합사회서비스센터로 개인별 특성을 고려한 맞춤형 치료서비스를 제공하고 있습니다.\n\n건강한 발달과 성장의 핵심은 전문가의 경험과 진심입니다. 각 치료영역의 깊은 전문성과 따뜻한 애정을 가진 선생님들이 동행합니다.\n\n이렇게 아이와 가족 모두의 행복한 일상을 함께 만들어갑니다."
  const messages = description.split('\n\n')
  const directorName = data?.director?.name || "원장"
  const siteName = data?.siteName || "위즈포레 사회서비스센터"

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-mindstory-gray-text mb-8">
              &ldquo;{title}&rdquo;
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1
                
                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.2) }}
                    viewport={{ once: true }}
                    className={isLastMessage ? "text-xl font-medium text-mindstory-lime" : ""}
                  >
                    {isLastMessage ? (
                      message
                    ) : (
                      <>
                        {message.split(' ').map((word, wordIndex) => {
                          const highlightKeywords = data?.director?.aboutMessage?.highlightKeywords || []
                          const shouldHighlight = highlightKeywords.some(keyword => word.includes(keyword))
                          
                          return shouldHighlight ? (
                            <strong key={wordIndex} className="text-mindstory-lime font-semibold"> {word}</strong>
                          ) : (
                            <span key={wordIndex}> {word}</span>
                          )
                        })}
                      </>
                    )}
                  </motion.p>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 text-right"
            >
              <p className="text-lg font-semibold text-mindstory-gray-text mb-1">
                {directorName}
              </p>
              <p className="text-gray-600">
                {siteName}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
