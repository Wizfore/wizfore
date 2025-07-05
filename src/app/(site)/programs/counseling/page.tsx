'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Brain, Users, Heart, FileText, Target, Award } from 'lucide-react'

export default function CounselingPage() {
  const counselingProgram = defaultSiteData.programs.find(p => p.id === 'counseling')
  
  if (!counselingProgram) {
    return <div>프로그램을 찾을 수 없습니다.</div>
  }

  // 프로그램 카테고리별 아이콘 매핑
  const getProgramIcon = (title: string) => {
    if (title.includes('검사') || title.includes('평가')) return <Brain className="w-6 h-6" />
    if (title.includes('사회성') || title.includes('그룹')) return <Users className="w-6 h-6" />
    if (title.includes('부모') || title.includes('가족')) return <Heart className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const getProgramColor = (title: string) => {
    if (title.includes('검사') || title.includes('평가')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (title.includes('사회성') || title.includes('그룹')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('부모') || title.includes('가족')) return 'bg-pink-50 text-pink-700 border-pink-200'
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
            {counselingProgram.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            정확한 진단과 개별화된 상담을 통한 최적의 치료 계획
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
              상담 프로그램 소개
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {counselingProgram.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 상담 프로그램 목록 섹션 */}
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
              총 {counselingProgram.programs.length}개의 전문 상담 프로그램을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {counselingProgram.programs
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
                        <span className="text-sm font-medium text-wizfore-text-primary">상담 목표</span>
                      </div>
                      <p className="text-wizfore-text-secondary text-sm leading-relaxed pl-6">
                        {program.goal}
                      </p>
                    </div>

                    {/* 내용 또는 유형 */}
                    {(program.content || program.types) && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                          <span className="text-sm font-medium text-wizfore-text-primary">
                            {program.content ? '주요 내용' : program.types ? '검사 유형' : '프로그램 내용'}
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

      {/* 상담 과정 섹션 */}
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
              상담 과정
            </h2>
            <p className="text-wizfore-text-secondary">
              체계적이고 전문적인 상담 과정을 안내합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "초기 상담",
                description: "전화 또는 방문 상담을 통한 기본 정보 수집 및 상담 일정 조정",
                icon: <Heart className="w-8 h-8" />
              },
              {
                step: "2", 
                title: "종합 평가",
                description: "발달검사, 지능검사, 심리검사 등을 통한 정확한 진단",
                icon: <Brain className="w-8 h-8" />
              },
              {
                step: "3",
                title: "계획 수립",
                description: "평가 결과를 바탕으로 개별화된 상담 및 치료 계획 수립",
                icon: <FileText className="w-8 h-8" />
              },
              {
                step: "4",
                title: "상담 진행",
                description: "개별 상담, 그룹 상담, 부모 상담 등 맞춤형 상담 서비스 제공",
                icon: <Users className="w-8 h-8" />
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

      {/* 특별 프로그램 섹션 */}
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
              특별 프로그램
            </h2>
            <p className="text-wizfore-text-secondary">
              다양한 연령과 상황에 맞는 맞춤형 상담 서비스
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
                <Users className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  사회성 그룹치료
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  또래 관계 형성 및 사회적 기술 습득
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  소그룹 활동을 통한 상호작용 기회 제공
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  사회정서 원예치료 및 심리운동 프로그램
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
                <Heart className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  부모상담/부모코칭
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  가족 기능 강화 및 양육 역량 향상
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  개인상담, 부부상담, 자녀양육코칭
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  가족문화상담을 통한 가족 관계 개선
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 문의 섹션 */}
      <section className="py-16 bg-wizfore-warm-brown/5">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
              상담 예약 문의
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed mb-8">
              정확한 진단과 전문적인 상담이 필요하시다면 언제든지 연락주세요. 
              전문가와의 상담을 통해 최적의 지원 방향을 안내해드립니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-wizfore-text-secondary">전화 상담</div>
                  <div className="text-lg font-semibold text-wizfore-text-primary">051-324-0940</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-wizfore-text-secondary">운영 시간</div>
                  <div className="text-lg font-semibold text-wizfore-text-primary">평일 09:00 ~ 19:00</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}