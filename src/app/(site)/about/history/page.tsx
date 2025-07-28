'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getHistoryData, getHistoryHero, getHistoryStats } from '@/lib/services/dataService'
import type { Milestone, HistoryStats } from '@/types'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import StatsSection from '@/components/about/history/StatsSection'
import TimelineSection from '@/components/about/history/TimelineSection'

interface HistoryData {
  milestones: Milestone[]
  siteName: string
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [hero, setHero] = useState<{
    title: string
    description: string
    imageUrl?: string
    defaultImageUrl?: string
  } | null>(null)
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [historyData, heroData, statsData] = await Promise.all([
          getHistoryData(),
          getHistoryHero(),
          getHistoryStats()
        ])
        setData(historyData)
        setHero(heroData)
        setStats(statsData)
        setError(null)
      } catch (err) {
        console.error('Error fetching history data:', err)
        setError('센터 연혁 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
          <p className="text-white text-xl font-semibold">센터 연혁을 불러오는 중...</p>
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

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">센터 연혁 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeroSection 
        title={hero?.title || "센터 연혁"}
        description={hero?.description || "상시와 사회서비스센터의 역사와 발전 과정을 만나보세요"}
        backgroundImage={(hero?.imageUrl && hero.imageUrl.trim() !== '') ? hero.imageUrl : hero?.defaultImageUrl}
      />
      <StatsSection milestones={data.milestones} stats={stats} />
      <TimelineSection milestones={data.milestones} />
    </div>
  )
}