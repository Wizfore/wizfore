'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Target, Users, Clock, Award } from 'lucide-react'

export default function TherapyPage() {
  const therapyProgram = defaultSiteData.programs.find(p => p.id === 'therapy')
  
  if (!therapyProgram) {
    return <div>프로그램을 찾을 수 없습니다.</div>
  }

  // 프로그램 카테고리별 아이콘 매핑
  const getProgramIcon = (title: string) => {
    if (title.includes('언어')) return <Target className="w-6 h-6" />
    if (title.includes('인지')) return <Target className="w-6 h-6" />
    if (title.includes('놀이')) return <Users className="w-6 h-6" />
    if (title.includes('미술')) return <Award className="w-6 h-6" />
    if (title.includes('음악')) return <Award className="w-6 h-6" />
    if (title.includes('감각')) return <Clock className="w-6 h-6" />
    if (title.includes('체육') || title.includes('운동')) return <Users className="w-6 h-6" />
    if (title.includes('심리')) return <Target className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const getProgramColor = (title: string) => {
    if (title.includes('언어')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (title.includes('인지')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (title.includes('놀이')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('미술')) return 'bg-pink-50 text-pink-700 border-pink-200'
    if (title.includes('음악')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (title.includes('감각')) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    if (title.includes('체육') || title.includes('운동')) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (title.includes('심리')) return 'bg-teal-50 text-teal-700 border-teal-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('/images/hero/defaultHero.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {therapyProgram.hero?.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {therapyProgram.hero?.description}
          </motion.p>
        </div>
      </section>

      {/* 프로그램 개요 섹션 */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
              {therapyProgram.aboutMessage?.title}
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {therapyProgram.aboutMessage?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 치료 프로그램 목록 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {therapyProgram.programs
              .sort((a, b) => a.order - b.order)
              .map((program, index) => (
                <motion.div
                  key={program.title}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* 카드 헤더 */}
                  <div className="bg-gradient-to-r from-wizfore-warm-brown/10 to-wizfore-warm-brown/5 p-6">
                    <div className="flex items-center mb-4">
                      <div className={`inline-flex items-center p-3 rounded-full mr-4 ${getProgramColor(program.title)}`}>
                        {getProgramIcon(program.title)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-wizfore-text-primary">
                          {program.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* 카드 본문 */}
                  <div className="p-6">
                    {/* 대상 */}
                    {program.target && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Users className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                          <span className="text-sm font-medium text-wizfore-text-primary">치료 대상</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {Array.isArray(program.target) ? (
                            program.target.map((item, itemIndex) => (
                              <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                                • {item}
                              </p>
                            ))
                          ) : (
                            <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                              {program.target}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 목표 */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Target className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">치료 목표</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {Array.isArray(program.goal) ? (
                          program.goal.map((item, itemIndex) => (
                            <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                              • {item}
                            </p>
                          ))
                        ) : (
                          <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                            {program.goal}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 내용 또는 유형 */}
                    {(program.content || program.types) && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                          <span className="text-sm font-medium text-wizfore-text-primary">
                            {program.content ? '주요 내용' : '치료 유형'}
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {(program.content || program.types)?.map((item, itemIndex) => (
                            <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                              • {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* 치료 과정 섹션 */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
              치료 과정
            </h2>
            <p className="text-wizfore-text-secondary">
              체계적이고 전문적인 치료 과정을 안내합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "상담 및 접수",
                description: "전화 상담을 통한 기본 정보 수집 및 치료 일정 조정",
                icon: <Target className="w-8 h-8" />
              },
              {
                step: "2", 
                title: "초기 평가",
                description: "전문가의 정확한 진단 및 개별화된 치료 계획 수립",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "3",
                title: "개별 치료",
                description: "아동의 특성에 맞춘 1:1 맞춤형 치료 서비스 제공",
                icon: <Clock className="w-8 h-8" />
              },
              {
                step: "4",
                title: "경과 평가",
                description: "정기적인 평가를 통한 치료 효과 점검 및 계획 조정",
                icon: <Award className="w-8 h-8" />
              }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-wizfore-warm-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-wizfore-warm-brown">
                      {process.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-wizfore-warm-brown text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                  {process.title}
                </h3>
                <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}