'use client'

import { motion } from 'framer-motion'
import { getIconComponent } from '@/lib/utils/iconMapper'
import { BlurFade } from '@/components/ui/blur-fade'
import type { TeamFeature } from '@/types'

interface TeachersOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
}

const TeachersOverviewSection: React.FC<TeachersOverviewSectionProps> = ({ 
  aboutMessage,
  features = []
}) => {

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
            {aboutMessage?.title || "전문 교육진 소개"}
          </h2>
          <p className="text-lg text-wizfore-text-secondary leading-relaxed whitespace-pre-line">
            {aboutMessage?.description || 
              `위즈포레 사회서비스센터는 여러 명의 전문 교사진이 성인 발달장애인 주간활동 프로그램과 학령기 아동 방과후 프로그램을 운영하고 있습니다. 사회복지, 특수교육, 간호 등 다양한 전문 분야의 교사들이 개별 맞춤형 교육과 돌봄 서비스를 제공합니다.`
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.sort((a, b) => a.order - b.order).map((feature, index) => {
            const IconComponent = getIconComponent(feature.iconName)
            return (
              <BlurFade
                key={feature.id}
                delay={0.2 + index * 0.1}
                inView
                duration={0.8}
                offset={20}
                blur="4px"
              >
                <motion.div
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-wizfore-light-beige/30 border border-wizfore-coral-primary/10 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-2 hover:border-wizfore-coral-primary/40 hover:ring-2 hover:ring-wizfore-coral-primary hover:ring-opacity-30 focus-within:ring-2 focus-within:ring-wizfore-coral-primary focus-within:ring-opacity-50 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:scale-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
                  aria-describedby={`feature-desc-${index}`}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-wizfore-warm-brown/15 to-wizfore-coral-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-wizfore-warm-brown/20 group-hover:to-wizfore-coral-primary/15 transition-all duration-300 motion-reduce:transition-none">
                    <div className="text-wizfore-warm-brown group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                <h3 
                  id={`feature-title-${index}`}
                  className="text-lg font-bold text-wizfore-text-primary mb-4 group-hover:text-wizfore-warm-brown transition-colors duration-300"
                >
                  {feature.title}
                </h3>
                <p 
                  id={`feature-desc-${index}`}
                  className="text-wizfore-text-secondary text-sm leading-relaxed"
                >
                  {feature.description}
                </p>
              </motion.div>
            </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TeachersOverviewSection