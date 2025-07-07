'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import type { TeamMember } from '@/types'

interface TeachersListSectionProps {
  teachers: TeamMember[]
}

const TeachersListSection: React.FC<TeachersListSectionProps> = ({ teachers }) => {

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {teachers
            .sort((a, b) => a.order - b.order)
            .map((teacher, index) => (
              <BlurFade
                key={teacher.name}
                delay={0.1 + index * 0.05}
                inView
                duration={0.8}
                offset={20}
                blur="4px"
              >
                <motion.div
                  className="group bg-gradient-to-br from-white to-wizfore-light-beige/20 rounded-2xl shadow-lg p-3 lg:p-4 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-wizfore-coral-primary hover:ring-opacity-20 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:scale-100"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`teacher-name-${index}`}
                  aria-describedby={`teacher-info-${index}`}
                >
                {/* 헤더: 이름과 전문분야 */}
                <motion.div
                  className="text-center mb-6 p-5 rounded-xl bg-gradient-to-br from-wizfore-coral-primary/8 to-wizfore-soft-pink/8 border border-wizfore-coral-primary/10"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 
                    id={`teacher-name-${index}`}
                    className="text-xl lg:text-2xl font-black text-wizfore-text-primary mb-4 group-hover:text-wizfore-warm-brown transition-colors duration-300"
                  >
                    {teacher.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {teacher.specialization.map((spec, specIndex) => (
                      <span key={specIndex} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-wizfore-coral-primary/10 text-wizfore-coral-primary border border-wizfore-coral-primary/20 hover:bg-wizfore-coral-primary/15 transition-colors duration-200">
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* 상세 정보 */}
                <motion.div
                  id={`teacher-info-${index}`}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                    {/* 학력 */}
                    <div className="bg-gradient-to-r from-wizfore-warm-brown/5 to-transparent p-4 rounded-lg border border-wizfore-warm-brown/10 hover:border-wizfore-warm-brown/20 transition-colors duration-300">
                      <div className="flex items-center mb-3">
                        <GraduationCap className="w-4 h-4 text-wizfore-warm-brown mr-3 group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
                        <h4 className="text-base font-bold text-wizfore-text-primary">
                          학력
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {teacher.education.map((edu, eduIndex) => (
                          <div key={eduIndex} className="flex items-center">
                            <div className="w-1 h-1 bg-wizfore-coral-primary/60 rounded-full mr-3 flex-shrink-0" />
                            <p className="text-sm text-wizfore-text-primary leading-relaxed break-words">
                              {edu}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 자격증 */}
                    <div className="bg-gradient-to-r from-wizfore-soft-pink/8 to-transparent p-4 rounded-lg border border-wizfore-soft-pink/20 hover:border-wizfore-soft-pink/30 transition-colors duration-300">
                      <div className="flex items-center mb-3">
                        <Award className="w-4 h-4 text-wizfore-warm-brown mr-3 group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
                        <h4 className="text-base font-bold text-wizfore-text-primary">
                          자격증
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {teacher.certifications.map((cert, certIndex) => (
                          <span key={certIndex} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-wizfore-warm-brown/10 text-wizfore-warm-brown border border-wizfore-warm-brown/20">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                </motion.div>
              </motion.div>
            </BlurFade>
            ))}
        </div>
      </div>
    </section>
  )
}

export default TeachersListSection