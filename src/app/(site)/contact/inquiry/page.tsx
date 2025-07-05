'use client'

import React, { useState, useEffect } from 'react'
import { getInquiryHeroMessage, getInquiryAboutMessage, getInquiryCategories } from '@/lib/services/dataService'
import InquiryHeroSection from '@/components/contact/InquiryHeroSection'
import OnlineInquirySection from '@/components/contact/OnlineInquirySection'

export default function OnlineInquiryPage() {
  const [heroMessage, setHeroMessage] = useState<{
    title: string
    description: string
  } | null>(null)
  const [aboutMessage, setAboutMessage] = useState<{
    title: string
    messages: string[]
  } | null>(null)
  const [categories, setCategories] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [heroMessageData, aboutMessageData, categoriesData] = await Promise.all([
          getInquiryHeroMessage(),
          getInquiryAboutMessage(),
          getInquiryCategories()
        ])
        setHeroMessage(heroMessageData)
        setAboutMessage(aboutMessageData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error fetching inquiry hero message:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wizfore-warm-brown via-wizfore-coral-primary to-wizfore-soft-pink flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white text-xl font-semibold">문의 페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <InquiryHeroSection heroMessage={heroMessage || undefined} />
      
      {/* 온라인 문의 폼 섹션 */}
      <OnlineInquirySection 
        aboutMessage={aboutMessage || undefined}
        categories={categories || undefined}
      />
    </div>
  )
}