'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Users, BookOpen, Calendar, Clock, Target, Award } from 'lucide-react'

export default function AfterschoolPage() {
  const afterschoolProgram = defaultSiteData.programs.find(p => p.id === 'afterschool')
  
  if (!afterschoolProgram) {
    return <div>프로그램을 찾을 수 없습니다.</div>
  }

  // 프로그램 카테고리별 아이콘 매핑
  const getProgramIcon = (title: string) => {
    if (title.includes('토요') || title.includes('사회성')) return <Users className="w-6 h-6" />
    if (title.includes('평일') || title.includes('학습')) return <BookOpen className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const getProgramColor = (title: string) => {
    if (title.includes('토요') || title.includes('사회성')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('평일') || title.includes('학습')) return 'bg-blue-50 text-blue-700 border-blue-200'
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
            {afterschoolProgram.heroMessage?.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            학령기 아동의 발달과 사회성 향상을 위한 집단 프로그램
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
              방과후 프로그램 소개
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {afterschoolProgram.heroMessage?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 방과후 프로그램 목록 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
              제공 프로그램
            </h2>
            <p className="text-wizfore-text-secondary">
              총 {afterschoolProgram.programs.length}개의 방과후 프로그램을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {afterschoolProgram.programs
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
                    {/* 목표 */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Target className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">프로그램 목표</span>
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

                    {/* 내용 */}
                    {program.content && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                          <span className="text-sm font-medium text-wizfore-text-primary">주요 내용</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {program.content.map((item, itemIndex) => (
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

      {/* 프로그램 특징 섹션 */}
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
              프로그램 특징
            </h2>
            <p className="text-wizfore-text-secondary">
              방과후 프로그램만의 특별한 장점들을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "소그룹 활동",
                description: "4-6명의 소그룹으로 구성하여 개별 관심과 집단 활동의 균형을 맞춘 프로그램",
                icon: <Users className="w-8 h-8" />
              },
              {
                title: "체계적 커리큘럼", 
                description: "연령과 발달 수준에 맞춘 단계별 학습 과정으로 구성된 교육 프로그램",
                icon: <BookOpen className="w-8 h-8" />
              },
              {
                title: "정기적 운영",
                description: "주 1-2회 정기적 운영으로 지속적이고 안정적인 발달 지원 제공",
                icon: <Calendar className="w-8 h-8" />
              },
              {
                title: "전문가 지도",
                description: "각 분야 전문가의 체계적인 지도를 통한 질 높은 교육 서비스",
                icon: <Award className="w-8 h-8" />
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-wizfore-warm-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-wizfore-warm-brown">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 운영 안내 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
              운영 안내
            </h2>
            <p className="text-wizfore-text-secondary">
              방과후 프로그램 참여 관련 정보를 안내합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  토요방과후 (사회성교실)
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>운영시간:</strong> 토요일 오전 10:00 ~ 12:00
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>대상:</strong> 학령기 아동 (초등학생)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>정원:</strong> 4-6명 소그룹
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  평일방과후 (기초학습교실)
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>운영시간:</strong> 평일 오후 3:00 ~ 5:00
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>대상:</strong> 학령기 아동 (초등학생)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>정원:</strong> 4-6명 소그룹
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}