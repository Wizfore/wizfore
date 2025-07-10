'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Trophy, Activity, Heart, Clock, Target, Award } from 'lucide-react'

export default function SportsPage() {
  const sportsProgram = defaultSiteData.programs.find(p => p.id === 'special-sports')
  
  if (!sportsProgram) {
    return <div>프로그램을 찾을 수 없습니다.</div>
  }

  // 프로그램 카테고리별 아이콘 매핑
  const getProgramIcon = (title: string) => {
    if (title.includes('뉴스포츠')) return <Trophy className="w-6 h-6" />
    if (title.includes('운동재활') || title.includes('특수체육')) return <Activity className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const getProgramColor = (title: string) => {
    if (title.includes('뉴스포츠')) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (title.includes('운동재활') || title.includes('특수체육')) return 'bg-red-50 text-red-700 border-red-200'
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
            {sportsProgram.hero?.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {sportsProgram.hero?.description}
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
              {sportsProgram.aboutMessage?.title}
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {sportsProgram.aboutMessage?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 특수 스포츠 프로그램 목록 섹션 */}
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
              총 {sportsProgram.programs.length}개의 특수 스포츠 프로그램을 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sportsProgram.programs
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
                          <span className="text-sm font-medium text-wizfore-text-primary">
                            {program.title.includes('뉴스포츠') ? '스포츠 종목' : '주요 내용'}
                          </span>
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

      {/* 스포츠 활동의 장점 섹션 */}
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
              특수 스포츠의 장점
            </h2>
            <p className="text-wizfore-text-secondary">
              스포츠 활동을 통해 얻을 수 있는 다양한 효과들을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "신체 기능 향상",
                description: "근력, 지구력, 균형감각 등 전반적인 신체 기능의 발달과 개선",
                icon: <Activity className="w-8 h-8" />
              },
              {
                title: "사회성 발달", 
                description: "팀 활동을 통한 협동심, 소통 능력, 리더십 등 사회적 기술 습득",
                icon: <Heart className="w-8 h-8" />
              },
              {
                title: "자신감 증진",
                description: "새로운 운동 기술 습득과 성취감을 통한 자존감과 자신감 향상",
                icon: <Trophy className="w-8 h-8" />
              },
              {
                title: "스트레스 해소",
                description: "신체 활동을 통한 스트레스 해소와 정서적 안정감 증진",
                icon: <Target className="w-8 h-8" />
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-wizfore-warm-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-wizfore-warm-brown">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-wizfore-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스포츠 종목 소개 섹션 */}
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
              뉴스포츠 종목 소개
            </h2>
            <p className="text-wizfore-text-secondary">
              누구나 쉽게 참여할 수 있는 다양한 뉴스포츠 종목들을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "플라잉디스크",
                description: "원반을 던지고 받는 운동으로 손눈협응력과 집중력 향상에 효과적",
                color: "bg-blue-50 border-blue-200 text-blue-700"
              },
              {
                name: "츄크볼",
                description: "네트에 공을 던져 튕겨내는 게임으로 협동심과 전략적 사고 발달",
                color: "bg-green-50 border-green-200 text-green-700"
              },
              {
                name: "핸들러",
                description: "가벼운 공과 패들을 이용한 운동으로 기초 체력과 순발력 향상",
                color: "bg-purple-50 border-purple-200 text-purple-700"
              },
              {
                name: "플로어볼",
                description: "실내 하키와 유사한 운동으로 순발력과 팀워크 능력 증진",
                color: "bg-orange-50 border-orange-200 text-orange-700"
              },
              {
                name: "라켓룬",
                description: "배드민턴과 테니스를 결합한 형태로 라켓 스포츠의 기초 기술 습득",
                color: "bg-pink-50 border-pink-200 text-pink-700"
              },
              {
                name: "접시콘",
                description: "콘과 접시를 이용한 게임으로 균형감각과 집중력 개발에 도움",
                color: "bg-yellow-50 border-yellow-200 text-yellow-700"
              }
            ].map((sport, index) => (
              <motion.div
                key={sport.name}
                className={`p-6 rounded-lg border-2 ${sport.color}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-3">{sport.name}</h3>
                <p className="text-sm leading-relaxed">{sport.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 스포츠이용권 안내 섹션 */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-wizfore-warm-brown/10 to-wizfore-warm-brown/5 p-8 rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
                  문체부 장애인 스포츠이용권 서비스
                </h2>
                <p className="text-wizfore-text-secondary">
                  위즈포레는 문화체육관광부 장애인 스포츠이용권 서비스 제공기관입니다
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-wizfore-text-primary mb-4">
                    스포츠이용권이란?
                  </h3>
                  <ul className="space-y-2 text-wizfore-text-secondary">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      장애인의 스포츠 활동 참여 기회 확대
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      전문적인 스포츠 지도 및 프로그램 제공
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      경제적 부담 없이 스포츠 활동 참여 가능
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-wizfore-text-primary mb-4">
                    이용 안내
                  </h3>
                  <ul className="space-y-2 text-wizfore-text-secondary">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      대상: 등록장애인 (만 5세 이상)
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      신청: 국민체육진흥공단 홈페이지
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      문의: 센터 직접 연락 (051-324-0940)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
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
              특수 스포츠 프로그램 문의
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed mb-8">
              건강한 신체 활동과 즐거운 스포츠 경험을 원하신다면 언제든지 연락주세요. 
              전문가와의 상담을 통해 적합한 스포츠 프로그램을 안내해드립니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
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