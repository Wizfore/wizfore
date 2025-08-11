'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { getSiteInfo } from '@/lib/services/dataService'
import type { ContactInfo } from '@/types'
import { getImageWithFallback } from '@/lib/utils/imageUtils'

interface FooterData {
  contact: ContactInfo
  siteName: string
  footerLogoUrl: string
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [data, setData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteInfo = await getSiteInfo()
        const logoUrl = getImageWithFallback(siteInfo.headerLogoUrl, siteInfo.defaultHeaderLogoUrl)
        setData({
          contact: siteInfo.contact,
          siteName: siteInfo.name,
          footerLogoUrl: logoUrl
        })
      } catch (error) {
        console.error('Error fetching footer data:', error)
        // 에러 시에도 기본 구조는 유지
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 로딩 중이거나 데이터가 없을 때는 기본 구조만 표시
  if (loading || !data) {
    return (
      <footer className="bg-white text-wizfore-text-primary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center">
              <p className="text-sm sm:text-base text-wizfore-text-secondary">지도를 불러오는 중...</p>
            </div>
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left lg:pl-4 xl:pl-8">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-12 sm:h-16 bg-gray-200 rounded w-24 sm:w-32 mx-auto lg:mx-0"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-1/2 mx-auto lg:mx-0"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/5 sm:w-2/3 mx-auto lg:mx-0"></div>
              </div>
            </div>
          </div>
          <div className="pt-2 mt-20 sm:mt-32 md:mt-40 text-center">
            <p className="text-xs sm:text-sm text-wizfore-text-light">
              © {currentYear} 센터. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }

  const { contact, siteName, footerLogoUrl } = data

  return (
    <footer className="bg-white text-wizfore-text-primary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
        <motion.div 
          className="flex flex-col lg:flex-row gap-6 md:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 좌측: 지도 */}
          <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={contact.mapUrl}
              width="100%"
              height="300"
              className="sm:h-80 md:h-96 lg:h-[500px] w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="위즈포레 위치"
            />
          </div>

          {/* 우측: 센터 정보 */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left lg:pl-4 xl:pl-8">
            {/* 센터 로고 */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <img 
                src={footerLogoUrl} 
                alt={siteName}
                className="h-12 sm:h-16 w-auto object-contain"
              />
            </div>

            {/* 주소 */}
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-wizfore-text-primary">주&nbsp;&nbsp;&nbsp;소</h4>
              <div className="flex items-start justify-center lg:justify-start space-x-2">
                <MapPin size={14} className="sm:w-4 sm:h-4 text-wizfore-coral-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-wizfore-text-secondary leading-relaxed max-w-xs lg:max-w-none break-words">
                  {contact.address}
                </p>
              </div>
            </div>

            {/* 연락처 */}
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-wizfore-text-primary">대&nbsp;표&nbsp;번&nbsp;호</h4>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <Phone size={14} className="sm:w-4 sm:h-4 text-wizfore-coral-secondary" />
                <span className="text-base sm:text-lg font-bold text-wizfore-coral-primary">
                  {contact.phone}
                </span>
              </div>
            </div>

            {/* 팩스 */}
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-wizfore-text-primary">팩&nbsp;&nbsp;&nbsp;스</h4>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <Phone size={14} className="sm:w-4 sm:h-4 text-wizfore-coral-secondary" />
                <span className="text-xs sm:text-sm text-wizfore-text-secondary">
                  {contact.fax}
                </span>
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-wizfore-text-primary">이&nbsp;메&nbsp;일</h4>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <Mail size={14} className="sm:w-4 sm:h-4 text-wizfore-coral-secondary" />
                <span className="text-xs sm:text-sm text-wizfore-text-secondary break-all">
                  {contact.email}
                </span>
              </div>
            </div>

            {/* 운영시간 */}
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-wizfore-text-primary">운&nbsp;영&nbsp;시&nbsp;간</h4>
              <div className="space-y-1 text-xs sm:text-sm text-wizfore-text-secondary">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-wizfore-coral-secondary" />
                  <span>평일: {contact.operatingHours.weekday}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-wizfore-coral-secondary" />
                  <span>주말/공휴일: {contact.operatingHours.weekend}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Information Section */}
        <div className="mt-16 sm:mt-24 md:mt-32 lg:mt-40 text-center">
          <div className="text-xs sm:text-sm text-wizfore-text-light flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>사업자등록번호: {contact.businessNumber}</span>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center space-x-1">
              <Mail size={10} className="sm:w-3 sm:h-3" />
              <span className="break-all">{contact.email}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-2 sm:pt-4">
          <div className="text-center border-t border-gray-200 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-wizfore-text-light">
              © {currentYear} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
