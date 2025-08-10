'use client'

import { motion } from 'framer-motion'
import type { Milestone } from '@/types'

interface TimelineSectionProps {
  milestones?: Milestone[]
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ milestones = [] }) => {

  // 마일스톤을 연도별로 그룹화
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const year = milestone.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(milestone)
    return acc
  }, {} as Record<string, typeof milestones>)

  // 연도를 내림차순으로 정렬
  const years = Object.keys(groupedMilestones).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wizfore-text-primary mb-4">
            연&nbsp;&nbsp;&nbsp;&nbsp;혁
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* 전체 세로 라인 */}
          <div className="absolute left-16 sm:left-20 md:left-32 lg:left-40 top-0 bottom-0 w-px bg-wizfore-coral-primary ml-3 sm:ml-4 md:ml-6"></div>
          
          {years.map((year, yearIndex) => (
            <motion.div
              key={year}
              className="relative mb-12 md:mb-16 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: yearIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* 통합 연도 레이아웃 */}
              <div className="flex">
                {/* 왼쪽 연도 */}
                <div className="w-16 sm:w-20 md:w-32 lg:w-40 flex-shrink-0 pr-2 sm:pr-3 md:pr-6 lg:pr-8">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-wizfore-coral-primary">
                    {year}
                  </div>
                </div>

                {/* 가운데 타임라인 */}
                <div className="w-6 sm:w-8 md:w-12 flex-shrink-0 flex flex-col items-center relative">
                  {/* 타임라인 점 - 선의 가운데에 위치 */}
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-wizfore-coral-primary rounded-full absolute top-0.5 md:top-1 z-10 left-1/2 transform -translate-x-1/2"></div>
                </div>

                {/* 오른쪽 내용 */}
                <div className="flex-1 pl-2 sm:pl-3 md:pl-6">
                  <div className="space-y-4 md:space-y-6">
                    {groupedMilestones[year]
                      .sort((a, b) => parseInt(b.month) - parseInt(a.month))
                      .map((milestone, index) => (
                        <motion.div
                          key={`${milestone.year}-${milestone.month}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-start"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {/* 날짜 */}
                          <div className="w-full sm:w-12 md:w-16 lg:w-20 flex-shrink-0 mb-1 sm:mb-0">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-wizfore-text-primary">
                              {milestone.month.padStart(2,"")} 월
                            </span>
                          </div>

                          {/* 내용 */}
                          <div className="flex-1 sm:ml-2 md:ml-4 lg:ml-6">
                            <p className="text-wizfore-text-secondary text-sm sm:text-base lg:text-lg leading-relaxed">
                              {milestone.event}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TimelineSection