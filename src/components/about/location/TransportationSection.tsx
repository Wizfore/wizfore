'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ContactInfo, TransportationInfo } from '@/types'
import { getImageWithFallback } from '@/lib/utils/imageUtils'

interface TransportationSectionProps {
  contact?: ContactInfo
  transportation?: TransportationInfo[]
  siteName?: string
  aboutMessage?: {
    title: string
    description: string
  }
}

const TransportationSection: React.FC<TransportationSectionProps> = ({ 
  contact,
  transportation,
  siteName = '센터',
  aboutMessage
}) => {


  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-6 md:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-wizfore-text-primary mb-4 md:mb-6">
            {aboutMessage?.title || `${siteName}로 오시는 길을 확인하세요`}
          </h2>
          {aboutMessage?.description && (
            <div className="text-sm md:text-base lg:text-lg text-wizfore-text-secondary leading-relaxed max-w-4xl mx-auto">
              <p className="whitespace-pre-line">
                {aboutMessage.description}
              </p>
            </div>
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {transportation ? transportation.map((transport, index) => (
              <motion.div
                key={transport.type}
                className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 mr-3">
                    <Image
                      src={getImageWithFallback(transport.iconPath, transport.defaultIconPath)}
                      alt={transport.type}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-wizfore-text-primary">
                    {transport.type}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-wizfore-text-secondary leading-relaxed">
                  {transport.description}
                </p>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 md:py-12">
                <p className="text-wizfore-text-secondary text-sm md:text-base lg:text-lg">교통편 정보를 불러올 수 없습니다.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TransportationSection