'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAboutSectionData } from '@/lib/services/dataService'
import type { DirectorInfo } from '@/types'
import DirectorHeroSection from '@/components/about/director/DirectorHeroSection'
import DirectorMessageSection from '@/components/about/director/DirectorMessageSection'
import DirectorProfileSection from '@/components/about/director/DirectorProfileSection'

interface DirectorData {
  siteName: string
  director: DirectorInfo
}

const DirectorPage = () => {
  const [data, setData] = useState<DirectorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const directorData = await getAboutSectionData()
        setData(directorData)
      } catch (error) {
        console.error('Error fetching director data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wizfore-coral-primary via-wizfore-coral-secondary to-wizfore-soft-pink flex items-center justify-center">
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
          <p className="text-white text-xl font-semibold">센터장 정보를 불러오는 중...</p>
        </motion.div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">센터장 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const { director } = data

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* 히어로 섹션 */}
      <DirectorHeroSection director={director} />
      
      {/* 센터장 메시지 섹션 */}
      <DirectorMessageSection director={director} />
      
      {/* 프로필 및 요약 정보 섹션 */}
      <DirectorProfileSection director={director} />
      
    </div>
  )
}

export default DirectorPage