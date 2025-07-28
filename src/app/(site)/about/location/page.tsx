'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getLocationData, getLocationHero, getLocationAboutMessage } from '@/lib/services/dataService'
import type { ContactInfo, TransportationInfo } from '@/types'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import TransportationSection from '@/components/about/location/TransportationSection'

interface LocationData {
  contact: ContactInfo
  transportation: TransportationInfo[]
  siteName: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export default function LocationPage() {
  const [data, setData] = useState<LocationData | null>(null)
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [locationData, heroData, aboutMessageData] = await Promise.all([
          getLocationData(),
          getLocationHero(),
          getLocationAboutMessage()
        ])
        setData(locationData)
        setHero(heroData)
        setAboutMessage(aboutMessageData)
        setError(null)
      } catch (err) {
        console.error('Error fetching location data:', err)
        setError('오시는길 정보를 불러오는데 실패했습니다.')
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
          <p className="text-white text-xl font-semibold">오시는길 정보를 불러오는 중...</p>
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
          <p className="text-white text-lg">오시는길 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <CommonHeroSection 
        title={hero?.title || "오시는길"}
        description={hero?.description || "상시와 사회서비스센터로 오시는 길을 안내해드립니다"}
        backgroundImage={(hero?.imageUrl && hero.imageUrl.trim() !== '') ? hero.imageUrl : hero?.defaultImageUrl}
      />
      <TransportationSection 
        contact={data.contact}
        transportation={data.transportation}
        siteName={data.siteName}
        aboutMessage={aboutMessage || undefined}
      />
    </div>
  )
}