'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTeachers } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import TeachersOverviewSection from '@/components/team/teachers/TeachersOverviewSection'
import TeachersListSection from '@/components/team/teachers/TeachersListSection'
import type { TeamMember } from '@/types'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeamMember[]>([])
  const [hero, setHero] = useState<{
    title: string
    description: string
    imageUrl?: string
  } | null>(null)
  const [aboutMessage, setAboutMessage] = useState<{
    title: string
    description: string
  } | null>(null)
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        setLoading(true)
        const teachersData = await getTeachers()
        setTeachers(teachersData.members)
        setHero(teachersData.hero)
        setAboutMessage(teachersData.aboutMessage)
        setFeatures(teachersData.features)
        setError(null)
      } catch (err) {
        console.error('Error fetching teachers data:', err)
        setError('교사진 정보를 불러오는데 실패했습니다.')
        
        // Fallback to default data
        const teacherCategory = defaultSiteData.team.find(category => category.id === 'teachers')
        setTeachers(teacherCategory?.members || [])
        setHero(teacherCategory?.hero || null)
        setAboutMessage(teacherCategory?.aboutMessage || null)
        setFeatures(teacherCategory?.features || [])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachersData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wizfore-warm-brown via-wizfore-coral-primary to-wizfore-soft-pink flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-white text-xl font-semibold">교사진 정보를 불러오는 중...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-wizfore-coral-primary text-white rounded-lg hover:bg-wizfore-coral-secondary transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <CommonHeroSection 
        title={hero?.title || "주간·방과후 교사"}
        description={hero?.description || "성인 주간활동과 방과후 프로그램을 전담하는 전문 교사진을 소개합니다"}
        backgroundImage={hero?.imageUrl || '/images/hero/defaultHero.jpg'}
      />

      {/* 개요 섹션 */}
      <TeachersOverviewSection 
        aboutMessage={aboutMessage || undefined}
        features={features}
      />

      {/* 교사진 목록 섹션 */}
      <TeachersListSection teachers={teachers} />
    </div>
  )
}