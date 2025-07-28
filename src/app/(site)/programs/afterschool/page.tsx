'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPrograms } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import AfterschoolOverviewSection from '@/components/programs/afterschool/AfterschoolOverviewSection'
import AfterschoolListSection from '@/components/programs/afterschool/AfterschoolListSection'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

export default function AfterschoolPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [hero, setHero] = useState<{
    title: string
    description: string
    imageUrl?: string
    defaultImageUrl?: string
  } | null>(null)
  const [aboutMessage, setAboutMessage] = useState<{
    title: string
    description: string
  } | null>(null)
  const [features, setFeatures] = useState<Array<{
    icon: string
    title: string
    description: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAfterschoolData = async () => {
      try {
        setLoading(true)
        const programsData = await getPrograms()
        const afterschoolProgram = programsData.find((p: any) => p.id === 'afterschool')
        
        if (afterschoolProgram) {
          setPrograms(afterschoolProgram.programs || [])
          setHero(afterschoolProgram.hero)
          setAboutMessage(afterschoolProgram.aboutMessage)
          setFeatures([])
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching afterschool data:', err)
        setError('방과후 프로그램 정보를 불러오는데 실패했습니다.')
        
        // Fallback to default data
        const afterschoolProgram = defaultSiteData.programs.find(p => p.id === 'afterschool')
        if (afterschoolProgram) {
          setPrograms(afterschoolProgram.programs || [])
          setHero(afterschoolProgram.hero || null)
          setAboutMessage(afterschoolProgram.aboutMessage || null)
          setFeatures([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAfterschoolData()
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
          <p className="text-white text-xl font-semibold">방과후 프로그램 정보를 불러오는 중...</p>
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
        title={hero?.title || "방과후 프로그램"}
        description={hero?.description || "아동·청소년을 위한 특별한 방과후 프로그램을 제공합니다"}
        backgroundImage={hero?.imageUrl || hero?.defaultImageUrl}
      />

      {/* 개요 섹션 */}
      <AfterschoolOverviewSection 
        aboutMessage={aboutMessage || undefined}
        features={features}
      />

      {/* 방과후 프로그램 목록 섹션 */}
      <AfterschoolListSection programs={programs} />
    </div>
  )
}