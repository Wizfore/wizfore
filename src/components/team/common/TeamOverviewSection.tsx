'use client'

import { motion } from 'framer-motion'
import { getIconComponent } from '@/lib/utils/iconMapper'
import { BlurFade } from '@/components/ui/blur-fade'
import type { TeamFeature } from '@/types'

interface TeamOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
  defaultTitle?: string
  defaultDescription?: string
}

const TeamOverviewSection: React.FC<TeamOverviewSectionProps> = ({ 
  aboutMessage,
  features = [],
  defaultTitle = "전문진 소개",
  defaultDescription = "위즈포레 사회서비스센터는 전문성을 갖춘 직원들이 양질의 서비스를 제공하고 있습니다."
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
            {aboutMessage?.title || defaultTitle}
          </h2>
          <p className="text-lg text-wizfore-text-secondary leading-relaxed whitespace-pre-line">
            {aboutMessage?.description || defaultDescription}
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
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-wizfore-coral-primary/10 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-2 hover:border-wizfore-coral-primary/40 hover:ring-2 hover:ring-wizfore-coral-primary hover:ring-opacity-30 focus-within:ring-2 focus-within:ring-wizfore-coral-primary focus-within:ring-opacity-50 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:scale-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
                  aria-describedby={`feature-desc-${index}`}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    <div className="text-gray-700" aria-hidden="true">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                <h3 
                  id={`feature-title-${index}`}
                  className="text-lg font-bold text-wizfore-coral-primary mb-4"
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

export default TeamOverviewSection