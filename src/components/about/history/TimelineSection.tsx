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
          <h2 className="text-4xl font-bold text-wizfore-text-primary mb-4">
            연&nbsp;&nbsp;&nbsp;&nbsp;혁
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* 전체 세로 라인 */}
          <div className="absolute left-40 top-0 bottom-0 w-px bg-gray-300 ml-6"></div>
          
          {years.map((year, yearIndex) => (
            <motion.div
              key={year}
              className="relative mb-16 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: yearIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* 전체 연도 레이아웃 */}
              <div className="flex">
                {/* 왼쪽 연도 */}
                <div className="w-40 flex-shrink-0 pr-8">
                  <div className="text-4xl font-bold text-wizfore-text-primary">
                    {year}
                  </div>
                </div>

                {/* 가운데 타임라인 */}
                <div className="w-12 flex-shrink-0 flex flex-col items-center relative">
                  {/* 타임라인 점 - 첫번째 항목과 정렬 */}
                  <div className="w-3 h-3 bg-gray-400 rounded-full absolute top-1 z-10"></div>
                </div>

                {/* 오른쪽 내용 */}
                <div className="flex-1 pl-6">
                  <div className="space-y-6">
                    {groupedMilestones[year]
                      .sort((a, b) => parseInt(b.month) - parseInt(a.month))
                      .map((milestone, index) => (
                        <motion.div
                          key={`${milestone.year}-${milestone.month}-${index}`}
                          className="flex items-start"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {/* 날짜 */}
                          <div className="w-20 flex-shrink-0">
                            <span className="text-lg font-bold text-wizfore-text-primary">
                              {milestone.month.padStart(2,"")} 월
                            </span>
                          </div>

                          {/* 내용 */}
                          <div className="flex-1 ml-6">
                            <p className="text-wizfore-text-secondary text-lg leading-relaxed">
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