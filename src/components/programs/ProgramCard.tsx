'use client'

import { motion } from 'framer-motion'

interface ProgramCardProps {
  program: {
    title: string
    goal?: string | string[]
    content?: string[]
    target?: string | string[]
    types?: string[]
  }
  index: number
}

export default function ProgramCard({
  program,
  index
}: ProgramCardProps) {
  return (
    <motion.article
      className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 xl:p-10 hover:shadow-xl transition-all duration-300 w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      role="article"
      aria-labelledby={`program-title-${index}`}
    >
      <div className="space-y-4 md:space-y-6">
        {/* 1행: 프로그램 제목 */}
        <div className="pb-3 md:pb-4 border-b border-wizfore-coral-primary/30">
          <h3 
            id={`program-title-${index}`}
            className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-wizfore-text-primary mb-2 md:mb-3"
          >
            {program.title}
          </h3>
          
          {/* 프로그램 유형 배지 */}
          {program.types && program.types.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2">
              {program.types.map((type, typeIndex) => (
                <span
                  key={typeIndex}
                  className="px-2 md:px-3 py-1 bg-wizfore-coral-primary/10 text-wizfore-coral-primary text-xs md:text-sm font-medium rounded-full border border-wizfore-coral-primary/20"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2행: 3개 섹션을 가로 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* 프로그램 목표 */}
          {program.goal && (
            <div>
              <h4 className="text-sm md:text-base lg:text-lg font-semibold text-wizfore-text-primary mb-2 md:mb-3">
                이런 도움을 드려요
              </h4>
              <div className="space-y-1 md:space-y-2">
                {Array.isArray(program.goal) ? (
                  program.goal.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-wizfore-text-primary leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-wizfore-text-primary leading-relaxed">
                      {program.goal}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 대상자 */}
          {program.target && (
            <div>
              <h4 className="text-sm md:text-base lg:text-lg font-semibold text-wizfore-text-primary mb-2 md:mb-3">
                대상자
              </h4>
              <div className="space-y-1 md:space-y-2">
                {Array.isArray(program.target) ? (
                  program.target.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-wizfore-text-primary leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-wizfore-text-primary leading-relaxed">
                      {program.target}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 주요 내용 */}
          {program.content && (
            <div>
              <h4 className="text-sm md:text-base lg:text-lg font-semibold text-wizfore-text-primary mb-2 md:mb-3">
                주요 내용
              </h4>
              <div className="space-y-1 md:space-y-2">
                {program.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start">
                    <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-wizfore-text-primary leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}