'use client'

import { useState, useEffect } from 'react'
import { getCommunity } from '@/lib/services/dataService'
import SNSHeroSection from '@/components/community/sns/SNSHeroSection'
import SNSYouTubeSection from '@/components/community/sns/SNSYouTubeSection'

export default function SNSPage() {
  const [snsData, setSnsData] = useState<{
    heroMessage?: {
      title?: string
      description?: string
    }
    aboutMessage?: {
      title?: string
      description?: string
    }
    youtube?: {
      link?: string
      message?: {
        title?: string
        description?: string
      }
    }
    instagram?: string
    facebook?: string
    blog?: string
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true)
        const communityData = await getCommunity()
        setSnsData(communityData.sns || {})
      } catch (err) {
        console.error('Error fetching community data:', err)
        setError('SNS 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wizfore-warm-brown mx-auto mb-4"></div>
          <p className="text-wizfore-text-secondary">SNS 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-wizfore-warm-brown text-white rounded hover:bg-wizfore-warm-brown/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SNSHeroSection heroMessage={snsData.heroMessage} />
      <SNSYouTubeSection 
        aboutMessage={snsData.aboutMessage} 
        youtube={snsData.youtube} 
      />
    </div>
  )
}