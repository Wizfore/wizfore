'use client'

import { motion } from 'framer-motion'
import type { DirectorInfo } from '@/types'
import { getImageWithFallback, createImageErrorHandler } from '@/lib/utils/imageUtils'

interface DirectorProfileSectionProps {
  director: DirectorInfo
}

const DirectorProfileSection: React.FC<DirectorProfileSectionProps> = ({ director }) => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-wizfore-light-beige overflow-hidden">
      <div className="container-custom mx-auto px-4">
        {/* 통합된 큰 박스 */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 전체 구조: 위/아래로 분할 */}
          <div className="flex flex-col space-y-8">
            
            {/* 위 영역: 프로필 사진 + 학력/경력/자격증 */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* 위 왼쪽: 센터장 사진 */}
              <motion.div
                className="flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {/* 프로필 이미지 */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-wizfore-coral-primary/20 to-wizfore-soft-pink/20 rounded-full" />
                  <div className="relative w-full h-full bg-wizfore-light-beige rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={getImageWithFallback(director.imageUrl, director.defaultImageUrl)} 
                      alt={`${director.name} 센터장`}
                      className="w-full h-full object-cover"
                      onError={createImageErrorHandler(director.defaultImageUrl)}
                    />
                  </div>
                </div>
                
                {/* 이름과 직책 */}
                <h3 className="text-3xl lg:text-4xl font-bold text-wizfore-text-primary mb-3">
                  {director.name} <span className="text-xl lg:text-2xl font-normal">원장</span>
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.isArray(director.position) ? (
                    director.position.map((pos, index) => (
                      <span 
                        key={index}
                        className="text-xl lg:text-2xl text-wizfore-coral-primary font-bold"
                      >
                        {pos}
                        {index < director.position.length - 1 && ' · '}
                      </span>
                    ))
                  ) : (
                    <span className="text-xl lg:text-2xl text-wizfore-coral-primary font-bold">
                      {director.position}
                    </span>
                  )}
                </div>
                </motion.div>

              {/* 위 오른쪽: 학력, 경력, 자격증 */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* 학력 */}
                <div>
                  <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    학력
                  </h4>
                  <div className="space-y-2">
                    {director.education.map((edu, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-base text-wizfore-text-primary leading-relaxed">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 경력 */}
                <div>
                  <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    경력
                  </h4>
                  <div className="space-y-2">
                    {director.career.map((career, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-base text-wizfore-text-primary leading-relaxed">{career}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                <div>
                  <h4 className="text-xl font-bold text-wizfore-text-primary mb-4 pb-2 border-b border-wizfore-coral-primary/30">
                    자격증
                  </h4>
                  <div className="space-y-2">
                    {director.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-3 flex-shrink-0" />
                        <p className="text-base text-wizfore-text-primary leading-relaxed">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 아래 영역: 위원회 활동 (전체 폭) */}
            {director.committees.length > 0 && (
              <motion.div
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold text-wizfore-text-primary mb-6 pb-2 border-b border-wizfore-coral-primary/30">
                  위원회 활동
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                  {director.committees.map((committee, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-1 h-1 rounded-full mr-3 flex-shrink-0 ${
                        committee.includes('현)') ? 'bg-red-500' : 'bg-wizfore-coral-primary'
                      }`} />
                      <p className={`text-base leading-relaxed ${
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