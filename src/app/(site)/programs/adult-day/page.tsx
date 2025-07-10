'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Home, Users, Leaf, Smile, MapPin, Heart, Clock, Target, Award } from 'lucide-react'

export default function AdultDayPage() {
  const adultDayProgram = defaultSiteData.programs.find(p => p.id === 'adult-day')
  
  if (!adultDayProgram) {
    return <div>프로그램을 찾을 수 없습니다.</div>
  }

  // 프로그램 카테고리별 아이콘 매핑
  const getProgramIcon = (title: string) => {
    if (title.includes('일상생활')) return <Home className="w-6 h-6" />
    if (title.includes('사회적응')) return <Users className="w-6 h-6" />
    if (title.includes('쉼') || title.includes('힐링')) return <Leaf className="w-6 h-6" />
    if (title.includes('재미') || title.includes('여가')) return <Smile className="w-6 h-6" />
    if (title.includes('지역사회')) return <MapPin className="w-6 h-6" />
    if (title.includes('건강')) return <Heart className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const getProgramColor = (title: string) => {
    if (title.includes('일상생활')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (title.includes('사회적응')) return 'bg-green-50 text-green-700 border-green-200'
    if (title.includes('쉼') || title.includes('힐링')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (title.includes('재미') || title.includes('여가')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (title.includes('지역사회')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (title.includes('건강')) return 'bg-red-50 text-red-700 border-red-200'
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
            {adultDayProgram.hero?.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {adultDayProgram.hero?.description}
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
              {adultDayProgram.aboutMessage?.title}
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {adultDayProgram.aboutMessage?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 성인 주간활동 프로그램 목록 섹션 */}
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
              총 {adultDayProgram.programs.length}개의 성인 주간활동 프로그램을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {adultDayProgram.programs
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
              성인 주간활동 프로그램만의 특별한 장점들을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "개별 맞춤형",
                description: "개인의 능력과 특성에 맞춘 개별화된 활동 계획 수립 및 진행",
                icon: <Target className="w-8 h-8" />
              },
              {
                title: "다양한 활동", 
                description: "일상생활부터 여가활동까지 폭넓은 영역의 프로그램 제공",
                icon: <Smile className="w-8 h-8" />
              },
              {
                title: "사회통합 지향",
                description: "지역사회 참여를 통한 사회통합과 자립생활 역량 강화",
                icon: <Users className="w-8 h-8" />
              },
              {
                title: "전문가 지원",
                description: "각 분야 전문가들의 체계적이고 전문적인 지도 및 관리",
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

      {/* 프로그램 영역별 소개 섹션 */}
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
              프로그램 영역
            </h2>
            <p className="text-wizfore-text-secondary">
              6개 핵심 영역으로 구성된 종합적인 성인 주간활동 서비스
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "기본생활영역",
                programs: ["일상생활기술훈련", "건강생활관리"],
                color: "bg-blue-50 border-blue-200",
                icon: <Home className="w-8 h-8 text-blue-600" />
              },
              {
                title: "사회참여영역",
                programs: ["사회적응기술훈련", "지역사회활용훈련"],
                color: "bg-green-50 border-green-200",
                icon: <Users className="w-8 h-8 text-green-600" />
              },
              {
                title: "여가·문화영역",
                programs: ["쉼(힐링)프로그램", "재미(여가)프로그램"],
                color: "bg-yellow-50 border-yellow-200",
                icon: <Smile className="w-8 h-8 text-yellow-600" />
              }
            ].map((area, index) => (
              <motion.div
                key={area.title}
                className={`p-8 rounded-lg border-2 ${area.color}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  {area.icon}
                  <h3 className="text-xl font-semibold ml-3">{area.title}</h3>
                </div>
                <ul className="space-y-2">
                  {area.programs.map((program, progIndex) => (
                    <li key={progIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-current rounded-full mt-2 mr-3 flex-shrink-0 opacity-60"></span>
                      <span className="text-sm leading-relaxed">{program}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 안내 섹션 */}
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
              이용 안내
            </h2>
            <p className="text-wizfore-text-secondary">
              성인 주간활동 프로그램 이용 관련 정보를 안내합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="bg-gray-50 p-8 rounded-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  이용 대상 및 정원
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>대상:</strong> 성인 발달장애인 (만 18세 이상)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>정원:</strong> 소그룹 운영 (그룹별 4-8명)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>서류:</strong> 장애인등록증, 의사소견서 등
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-gray-50 p-8 rounded-lg"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-wizfore-warm-brown mr-4" />
                <h3 className="text-xl font-semibold text-wizfore-text-primary">
                  운영 시간 및 방법
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>운영시간:</strong> 평일 오전 10:00 ~ 오후 4:00
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>운영방법:</strong> 주 5일 정기 프로그램
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>특별활동:</strong> 월 1-2회 외부 활동 및 체험
                  </div>
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
              성인 주간활동 프로그램 문의
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed mb-8">
              성인 발달장애인의 자립생활과 사회통합을 위한 프로그램에 관심이 있으시다면 
              언제든지 연락주세요. 전문가와의 상담을 통해 적합한 서비스를 안내해드립니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-wizfore-text-secondary">전화 상담</div>
                  <div className="text-lg font-semibold text-wizfore-text-primary">051-324-0940</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-white" />
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