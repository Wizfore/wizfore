'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ContactInfo, TransportationInfo } from '@/types'

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

  // DB 기반 아이콘 경로 가져오기
  const getTransportIcon = (transport: TransportationInfo) => {
    return (transport.iconPath && transport.iconPath.trim() !== '') 
      ? transport.iconPath 
      : transport.defaultIconPath
  }

  return (
    <section className="pt-16 pb-0 bg-white">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
          {aboutMessage?.title || `${siteName}로 오시는 길을 확인하세요`}
        </h2>
        {aboutMessage?.description && (
          <div className="text-lg text-wizfore-text-secondary leading-relaxed mb-8 max-w-4xl mx-auto">
            <p className="whitespace-pre-line">
              {aboutMessage.description}
            </p>
          </div>
        )}
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {transportation ? transportation.map((transport, index) => (
            <motion.div
              key={transport.type}
              className="bg-gray-50 p-8 rounded-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-3">
                  <Image
                    src={getTransportIcon(transport)}
                    alt={transport.type}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  {transport.type}
                </h3>
              </div>
              <p className="text-wizfore-text-secondary leading-relaxed">
                {transport.description}
              </p>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-wizfore-text-secondary">교통편 정보를 불러올 수 없습니다.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default TransportationSection