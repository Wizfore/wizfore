'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

const NewsDetailNavigationSection = () => {
  const router = useRouter()

  return (
    <div className="container-custom mx-auto px-4 pb-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="text-center">
          <ShimmerButton
            onClick={() => router.push('/community/news')}
            className="inline-flex items-center px-6 py-3 bg-wizfore-coral-primary text-white rounded-lg hover:bg-wizfore-coral-secondary transition-colors"
            shimmerColor="#FFFFFF"
            shimmerSize="md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </ShimmerButton>
        </div>
      </motion.div>
    </div>
  )
}

export default NewsDetailNavigationSection