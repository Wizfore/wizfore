'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

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
          <button
            onClick={() => router.push('/community/news')}
            className="group inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white hover:bg-wizfore-coral-primary text-wizfore-coral-primary hover:text-white border-2 border-wizfore-coral-primary rounded-lg md:rounded-xl font-medium text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
            목록으로 돌아가기
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NewsDetailNavigationSection