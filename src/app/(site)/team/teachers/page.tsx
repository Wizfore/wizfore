'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Users, GraduationCap, Award, Heart, Shield, BookOpen, Stethoscope, Building } from 'lucide-react'

export default function TeachersPage() {
  const teacherCategory = defaultSiteData.team.find(category => category.id === 'teachers')
  const teachers = teacherCategory?.members || []
  
  // 역할별 아이콘 매핑
  const getRoleIcon = (specialization: string[]) => {
    const spec = specialization[0] || ''
    if (spec.includes('시설장')) return <Building className="w-6 h-6" />
    if (spec.includes('실장') || spec.includes('전담')) return <Shield className="w-6 h-6" />
    if (spec.includes('사회복지')) return <Heart className="w-6 h-6" />
    if (spec.includes('간호')) return <Stethoscope className="w-6 h-6" />
    if (spec.includes('학습') || spec.includes('인지')) return <BookOpen className="w-6 h-6" />
    return <Users className="w-6 h-6" />
  }

  const getRoleColor = (specialization: string[]) => {
    const spec = specialization[0] || ''
    if (spec.includes('시설장')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (spec.includes('실장') || spec.includes('전담')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (spec.includes('사회복지')) return 'bg-green-50 text-green-700 border-green-200'
    if (spec.includes('간호')) return 'bg-red-50 text-red-700 border-red-200'
    if (spec.includes('학습') || spec.includes('인지')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  // 역할별 통계
  const roleStats = [
    { name: '시설장', count: teachers.filter(t => t.specialization.some(s => s.includes('시설장'))).length },
    { name: '전담인력/실장', count: teachers.filter(t => t.specialization.some(s => s.includes('실장') || s.includes('전담'))).length },
    { name: '사회복지사', count: teachers.filter(t => t.specialization.some(s => s.includes('사회복지'))).length },
    { name: '간호교사', count: teachers.filter(t => t.specialization.some(s => s.includes('간호'))).length },
    { name: '인지학습교사', count: teachers.filter(t => t.specialization.some(s => s.includes('학습') || s.includes('인지'))).length }
  ]

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
            주간·방과후 교사
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            성인 주간활동과 방과후 프로그램을 전담하는 전문 교사진을 소개합니다
          </motion.p>
        </div>
      </section>

      {/* 개요 섹션 */}
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
              전문 교육진 소개
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              위즈포레 사회서비스센터는 {teachers.length}명의 전문 교사진이 
              성인 발달장애인 주간활동 프로그램과 학령기 아동 방과후 프로그램을 운영하고 있습니다. 
              사회복지, 특수교육, 간호 등 다양한 전문 분야의 교사들이 
              개별 맞춤형 교육과 돌봄 서비스를 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 역할별 통계 섹션 */}
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
              역할별 현황
            </h2>
            <p className="text-wizfore-text-secondary">
              각 역할별 전문 교사 현황을 확인해보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {roleStats.map((role, index) => (
              <motion.div
                key={role.name}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-wizfore-warm-brown/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-wizfore-warm-brown">
                    {getRoleIcon([role.name])}
                  </div>
                </div>
                <div className="text-2xl font-bold text-wizfore-warm-brown mb-1">
                  {role.count}
                </div>
                <p className="text-wizfore-text-primary text-sm font-medium">{role.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 교사진 목록 섹션 */}
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
              주간·방과후 교사 소개
            </h2>
            <p className="text-wizfore-text-secondary">
              총 {teachers.length}명의 전문 교사가 함께합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teachers
              .sort((a, b) => a.order - b.order)
              .map((teacher, index) => (
                <motion.div
                  key={teacher.name}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* 카드 헤더 */}
                  <div className="bg-gradient-to-r from-wizfore-warm-brown/10 to-wizfore-warm-brown/5 p-6 text-center">
                    <div className="w-20 h-20 bg-wizfore-warm-brown/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-wizfore-warm-brown">
                        {getRoleIcon(teacher.specialization)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-wizfore-text-primary mb-3">
                      {teacher.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {teacher.specialization.map((spec, specIndex) => (
                        <div 
                          key={specIndex} 
                          className={`inline-block px-3 py-1 rounded-full text-sm border ${getRoleColor([spec])}`}
                        >
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 카드 본문 */}
                  <div className="p-6">
                    {/* 학력 */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">학력</span>
                      </div>
                      <p className="text-wizfore-text-secondary text-sm leading-relaxed pl-6">
                        {teacher.education}
                      </p>
                    </div>

                    {/* 자격증 */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">자격증</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {teacher.certifications.map((cert, certIndex) => (
                          <p key={certIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                            • {cert}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* 프로그램 연계 섹션 */}
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
              담당 프로그램
            </h2>
            <p className="text-wizfore-text-secondary">
              주간·방과후 교사진이 운영하는 전문 프로그램들을 소개합니다
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
                  성인 주간활동 프로그램
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  일상생활기술훈련 및 사회적응기술훈련
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  쉼(힐링)프로그램 및 재미(여가)프로그램
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  지역사회활용훈련 및 건강생활관리
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
                  방과후 프로그램
                </h3>
              </div>
              <ul className="space-y-3 text-wizfore-text-secondary">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  토요방과후 사회성교실 운영
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  평일방과후 기초학습교실 운영
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-wizfore-warm-brown rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  진로적성 및 직업체험 프로그램
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 교사진 전문성 섹션 */}
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
              교사진의 전문성
            </h2>
            <p className="text-wizfore-text-secondary">
              위즈포레 주간·방과후 교사들의 특별한 전문성을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "사회복지 전문성",
                description: "사회복지사 자격을 바탕으로 한 전문적인 사례관리와 서비스 제공",
                icon: <Heart className="w-8 h-8" />
              },
              {
                title: "개별화 교육", 
                description: "각 이용자의 발달 수준과 특성에 맞춘 개별화된 교육 프로그램 운영",
                icon: <Users className="w-8 h-8" />
              },
              {
                title: "안전 관리",
                description: "간호교사의 전문적인 건강관리와 안전한 프로그램 환경 조성",
                icon: <Shield className="w-8 h-8" />
              },
              {
                title: "지속적 발전",
                description: "정기적인 교육과 연수를 통한 전문성 향상과 서비스 질 개선",
                icon: <GraduationCap className="w-8 h-8" />
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
              프로그램 문의
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed mb-8">
              성인 주간활동이나 방과후 프로그램에 대해 궁금한 사항이 있으시다면 
              언제든지 연락주세요. 전문 교사진과의 상담을 통해 자세한 안내를 받으실 수 있습니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-wizfore-text-secondary">전화 상담</div>
                  <div className="text-lg font-semibold text-wizfore-text-primary">051-324-0940</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-wizfore-warm-brown rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
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