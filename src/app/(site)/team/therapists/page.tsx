'use client'

import { motion } from 'framer-motion'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { Users, GraduationCap, Award, Heart, Brain, Palette, Music, Activity, Target } from 'lucide-react'

export default function TherapistsPage() {
  const therapistCategory = defaultSiteData.team.find(category => category.id === 'therapists')
  const therapists = therapistCategory?.members || []
  
  // 전문분야별 그룹화
  const groupedTherapists = therapists.reduce((acc, therapist) => {
    therapist.specialization.forEach(spec => {
      if (!acc[spec]) {
        acc[spec] = []
      }
      acc[spec].push(therapist)
    })
    return acc
  }, {} as Record<string, typeof therapists>)

  // 전문분야별 아이콘 매핑
  const getSpecializationIcon = (specialization: string) => {
    if (specialization.includes('언어')) return <Brain className="w-6 h-6" />
    if (specialization.includes('미술')) return <Palette className="w-6 h-6" />
    if (specialization.includes('음악')) return <Music className="w-6 h-6" />
    if (specialization.includes('놀이')) return <Heart className="w-6 h-6" />
    if (specialization.includes('감각') || specialization.includes('작업')) return <Activity className="w-6 h-6" />
    if (specialization.includes('특수체육') || specialization.includes('놀이체육')) return <Activity className="w-6 h-6" />
    if (specialization.includes('심리')) return <Brain className="w-6 h-6" />
    if (specialization.includes('원예')) return <Target className="w-6 h-6" />
    return <Users className="w-6 h-6" />
  }

  const getSpecializationColor = (specialization: string) => {
    if (specialization.includes('언어')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (specialization.includes('미술')) return 'bg-pink-50 text-pink-700 border-pink-200'
    if (specialization.includes('음악')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (specialization.includes('놀이')) return 'bg-green-50 text-green-700 border-green-200'
    if (specialization.includes('감각') || specialization.includes('작업')) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    if (specialization.includes('특수체육') || specialization.includes('놀이체육')) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (specialization.includes('심리')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (specialization.includes('원예')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  // 주요 전문분야 통계
  const mainSpecializations = [
    { name: '언어치료', count: therapists.filter(t => t.specialization.some(s => s.includes('언어'))).length },
    { name: '미술치료', count: therapists.filter(t => t.specialization.some(s => s.includes('미술'))).length },
    { name: '음악치료', count: therapists.filter(t => t.specialization.some(s => s.includes('음악'))).length },
    { name: '감각통합/작업치료', count: therapists.filter(t => t.specialization.some(s => s.includes('감각') || s.includes('작업'))).length },
    { name: '특수체육', count: therapists.filter(t => t.specialization.some(s => s.includes('특수체육') || s.includes('놀이체육'))).length },
    { name: '놀이치료', count: therapists.filter(t => t.specialization.some(s => s.includes('놀이') && !s.includes('놀이체육'))).length }
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
            치료·상담사
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            전문적이고 따뜻한 마음으로 함께하는 치료 전문가들을 소개합니다
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
              전문 치료진 소개
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              위즈포레 사회서비스센터는 다양한 분야의 전문 자격을 갖춘 {therapists.length}명의 치료·상담사가 
              개인별 특성에 맞는 맞춤형 치료 서비스를 제공하고 있습니다. 
              각 분야의 전문성을 바탕으로 체계적이고 효과적인 치료를 통해 
              내담자의 발달과 성장을 지원합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 전문분야별 통계 섹션 */}
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
              전문분야별 현황
            </h2>
            <p className="text-wizfore-text-secondary">
              각 치료 영역별 전문가 현황을 확인해보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {mainSpecializations.map((spec, index) => (
              <motion.div
                key={spec.name}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-wizfore-warm-brown/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-wizfore-warm-brown">
                    {getSpecializationIcon(spec.name)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-wizfore-warm-brown mb-1">
                  {spec.count}
                </div>
                <p className="text-wizfore-text-primary text-sm font-medium">{spec.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 치료진 목록 섹션 */}
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
              치료·상담사 소개
            </h2>
            <p className="text-wizfore-text-secondary">
              총 {therapists.length}명의 전문 치료·상담사가 함께합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {therapists
              .sort((a, b) => a.order - b.order)
              .map((therapist, index) => (
                <motion.div
                  key={therapist.name}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 12) * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* 카드 헤더 */}
                  <div className="bg-gradient-to-r from-wizfore-warm-brown/10 to-wizfore-warm-brown/5 p-4 text-center">
                    <div className="w-16 h-16 bg-wizfore-warm-brown/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-wizfore-warm-brown" />
                    </div>
                    <h3 className="text-lg font-bold text-wizfore-text-primary mb-2">
                      {therapist.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {therapist.specialization.map((spec, specIndex) => (
                        <div 
                          key={specIndex} 
                          className={`inline-block px-2 py-1 rounded-full text-xs border ${getSpecializationColor(spec)}`}
                        >
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 카드 본문 */}
                  <div className="p-4">
                    {/* 학력 */}
                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <GraduationCap className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">학력</span>
                      </div>
                      <p className="text-wizfore-text-secondary text-xs leading-relaxed pl-6">
                        {therapist.education}
                      </p>
                    </div>

                    {/* 자격증 */}
                    <div>
                      <div className="flex items-center mb-1">
                        <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
                        <span className="text-sm font-medium text-wizfore-text-primary">자격증</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {therapist.certifications.map((cert, certIndex) => (
                          <p key={certIndex} className="text-wizfore-text-secondary text-xs leading-relaxed">
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

      {/* 전문성 특징 섹션 */}
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
              치료진의 전문성
            </h2>
            <p className="text-wizfore-text-secondary">
              위즈포레 치료·상담사들의 특별한 전문성을 소개합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "국가자격 보유",
                description: "모든 치료사가 해당 분야의 국가공인 자격증을 보유하여 전문성을 보장합니다",
                icon: <Award className="w-8 h-8" />
              },
              {
                title: "지속적 교육", 
                description: "정기적인 교육과 연수를 통해 최신 치료 기법과 이론을 습득합니다",
                icon: <GraduationCap className="w-8 h-8" />
              },
              {
                title: "개별화 접근",
                description: "각 내담자의 특성과 필요에 맞춘 개별화된 치료 계획을 수립합니다",
                icon: <Target className="w-8 h-8" />
              },
              {
                title: "팀워크 협력",
                description: "다학제적 팀 접근을 통해 종합적이고 효과적인 치료를 제공합니다",
                icon: <Users className="w-8 h-8" />
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

    </div>
  )
}