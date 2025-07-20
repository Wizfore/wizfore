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
      className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 hover:shadow-xl transition-all duration-300 w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      role="article"
      aria-labelledby={`program-title-${index}`}
    >
      <div className="space-y-6">
        {/* 1행: 프로그램 제목 */}
        <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-wizfore-coral-primary/30">
          <h3 
            id={`program-title-${index}`}
            className="text-2xl lg:text-3xl font-black text-wizfore-text-primary"
          >
            {program.title}
          </h3>
        </div>

        {/* 2행: 3개 섹션을 가로 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 프로그램 목표 */}
          {program.goal && (
            <div>
              <h4 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                이런 도움을 드려요
              </h4>
              <div className="space-y-2">
                {Array.isArray(program.goal) ? (
                  program.goal.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-wizfore-text-primary leading-relaxed">
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
              <h4 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                대상자
              </h4>
              <div className="space-y-1">
                {Array.isArray(program.target) ? (
                  program.target.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-1 h-1 bg-wizfore-coral-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-wizfore-text-primary leading-relaxed">
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

          {/* 주요 내용 또는 프로그램 종류 */}
          {(program.content || program.types) && (
            <div>
              <h4 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                {program.content ? '주요 내용' : '프로그램 종류'}
              </h4>
              <div className="space-y-1">
                {(program.content || program.types)?.map((item, itemIndex) => (
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