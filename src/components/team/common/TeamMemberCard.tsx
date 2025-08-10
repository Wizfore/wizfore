'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'
import { BlurFade } from '@/components/ui/blur-fade'
import type { TeamMember } from '@/types'

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  memberType: 'teachers' | 'therapists'
  labels?: {
    education?: string
    certifications?: string
  }
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  index, 
  memberType,
  labels = {}
}) => {
  const memberLabel = memberType === 'teachers' ? 'teacher' : 'therapist'
  const educationLabel = labels.education || '학력'
  const certificationsLabel = labels.certifications || '자격증'

  return (
    <BlurFade
      key={member.name}
      delay={0.1 + index * 0.05}
      inView
      duration={0.8}
      offset={20}
      blur="4px"
    >
      <motion.div
        className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-3 md:p-4 lg:p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-wizfore-coral-primary hover:ring-opacity-20 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:scale-100"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        tabIndex={0}
        role="article"
        aria-labelledby={`${memberLabel}-name-${index}`}
        aria-describedby={`${memberLabel}-info-${index}`}
      >
        {/* 헤더: 이름과 전문분야 */}
        <motion.div
          className="text-center mb-4 md:mb-6 p-3 md:p-4 lg:p-5 rounded-xl bg-gradient-to-br from-wizfore-coral-primary/8 to-wizfore-soft-pink/8 border border-wizfore-coral-primary/10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 
            id={`${memberLabel}-name-${index}`}
            className="text-lg md:text-xl lg:text-2xl font-black text-wizfore-text-primary mb-2 md:mb-4"
          >
            {member.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {member.specialization.map((spec, specIndex) => (
              <span key={specIndex} className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium bg-wizfore-coral-primary/10 text-wizfore-coral-primary border border-wizfore-coral-primary/20 hover:bg-wizfore-coral-primary/15 transition-colors duration-200">
                {spec}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 상세 정보 */}
        <motion.div
          id={`${memberLabel}-info-${index}`}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* 학력 */}
          <div className="bg-gradient-to-r from-wizfore-warm-brown/5 to-transparent p-3 md:p-4 rounded-lg border border-wizfore-warm-brown/10 hover:border-wizfore-warm-brown/20 transition-colors duration-300">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-wizfore-coral-primary mr-2 md:mr-3 group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
              <h4 className="text-sm md:text-base font-bold text-wizfore-text-primary">
                {educationLabel}
              </h4>
            </div>
            <div className="space-y-1">
              {member.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="flex items-center">
                  <div className="w-1 h-1 bg-wizfore-coral-primary/60 rounded-full mr-3 flex-shrink-0" />
                  <p className="text-xs md:text-sm text-wizfore-text-primary leading-relaxed break-words">
                    {edu}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 자격증 */}
          <div className="bg-gradient-to-r from-wizfore-soft-pink/8 to-transparent p-3 md:p-4 rounded-lg border border-wizfore-soft-pink/20 hover:border-wizfore-soft-pink/30 transition-colors duration-300">
            <div className="flex items-center mb-3">
              <Award className="w-3 h-3 md:w-4 md:h-4 text-wizfore-coral-primary mr-2 md:mr-3 group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
              <h4 className="text-sm md:text-base font-bold text-wizfore-text-primary">
                {certificationsLabel}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.certifications.map((cert, certIndex) => (
                <span key={certIndex} className="inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs font-medium text-wizfore-text-primary border border-wizfore-warm-brown/20">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </BlurFade>
  )
}

export default TeamMemberCard