'use client'

import { motion } from 'framer-motion'

interface SportsOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
}

export default function SportsOverviewSection({
  aboutMessage,
  features = []
}: SportsOverviewSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        {/* About Message */}
        {aboutMessage && (
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
              {aboutMessage.title}
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {aboutMessage.description}
            </p>
          </motion.div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-wizfore-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-wizfore-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}