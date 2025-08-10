'use client'

import { motion } from 'framer-motion'
import type { DirectorInfo } from '@/types'
import { getImageWithFallback, createImageErrorHandler } from '@/lib/utils/imageUtils'

interface DirectorProfileSectionProps {
  director: DirectorInfo
}

const DirectorProfileSection: React.FC<DirectorProfileSectionProps> = ({ director }) => {
  return (
    <section className="relative py-8 md:py-12 lg:py-16 bg-white overflow-hidden">
      <div className="container-custom mx-auto px-4 md:px-6 lg:px-8">
        {/* 통합된 큰 박스 */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 전체 구조: 위/아래로 분할 */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            
            {/* 위 영역: 프로필 사진 + 학력/경력/자격증 */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              
              {/* 위 왼쪽: 센터장 사진 */}
              <motion.div
                className="flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {/* 프로필 이미지 */}
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 mx-auto mb-3 md:mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-wizfore-coral-primary/20 to-wizfore-soft-pink/20 rounded-full" />
                  <div className="relative w-full h-full bg-wizfore-light-beige rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg">
                    <img 
                      src={getImageWithFallback(director.imageUrl, director.defaultImageUrl)} 
                      alt={`${director.name} 센터장`}
                      className="w-full h-full object-cover"
                      onError={createImageErrorHandler(director.defaultImageUrl)}
                    />
                  </div>
                </div>
                
                {/* 이름과 직책 */}
                <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-wizfore-text-primary mb-2 md:mb-3">
                  {director.name} <span className="text-sm md:text-base lg:text-lg xl:text-xl font-normal">원장</span>
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.isArray(director.position) ? (
                    director.position.map((pos, index) => (
                      <span 
                        key={index}
                        className="text-xs md:text-sm lg:text-base xl:text-lg text-wizfore-coral-primary font-bold"
                      >
                        {pos}
                        {index < director.position.length - 1 && ' · '}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs md:text-sm lg:text-base xl:text-lg text-wizfore-coral-primary font-bold">
                      {director.position}
                    </span>
                  )}
                </div>
                </motion.div>

              {/* 위 오른쪽: 학력, 경력, 자격증 */}
              <motion.div
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* 학력 */}
                <div>
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-wizfore-text-primary mb-3 md:mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    학력
                  </h4>
                  <div className="space-y-1 md:space-y-2">
                    {director.education.map((edu, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-xs md:text-sm lg:text-base text-wizfore-text-primary leading-relaxed">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 경력 */}
                <div>
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-wizfore-text-primary mb-3 md:mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    경력
                  </h4>
                  <div className="space-y-1 md:space-y-2">
                    {director.career.map((career, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-xs md:text-sm lg:text-base text-wizfore-text-primary leading-relaxed">{career}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                <div>
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-wizfore-text-primary mb-3 md:mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    자격증
                  </h4>
                  <div className="space-y-1 md:space-y-2">
                    {director.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-xs md:text-sm lg:text-base text-wizfore-text-primary leading-relaxed">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 아래 영역: 위원회 활동 (전체 폭) */}
            {director.committees.length > 0 && (
              <motion.div
                className="pt-4 md:pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base md:text-lg lg:text-xl font-bold text-wizfore-text-primary mb-4 md:mb-6 pb-2 border-b border-wizfore-coral-primary/30">
                  위원회 활동
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-2 md:gap-y-3">
                  {director.committees.map((committee, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-1 h-1 rounded-full mr-3 flex-shrink-0 ${
                        committee.includes('현)') ? 'bg-red-500' : 'bg-wizfore-coral-primary'
                      }`} />
                      <p className={`text-xs md:text-sm lg:text-base leading-relaxed ${
                        committee.includes('현)') 
                          ? 'text-red-600 font-medium' 
                          : 'text-wizfore-text-primary'
                      }`}>
                        {committee}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DirectorProfileSection