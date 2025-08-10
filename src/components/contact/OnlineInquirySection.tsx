'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Check, AlertCircle } from 'lucide-react'
import { addInquiry } from '@/lib/services/inquiryService'

// Magic Card 컴포넌트 (inline 구현)
const MagicCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 md:p-6 lg:p-8 shadow-lg transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-30 transition duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 182, 193, 0.15), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// 폼 스키마 정의
const inquirySchema = z.object({
  name: z.string().min(2, '이름을 2자 이상 입력해주세요'),
  phone: z.string().min(10, '전화번호를 정확히 입력해주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  category: z.string().min(1, '문의 분류를 선택해주세요'),
  message: z.string().min(10, '문의 내용을 10자 이상 입력해주세요'),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface OnlineInquirySectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  categories?: string[]
}

const OnlineInquirySection: React.FC<OnlineInquirySectionProps> = ({ aboutMessage, categories }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const inquiryCategories = categories || [
    '프로그램 문의',
    '상담 문의', 
    '시설 이용 문의',
    '일반 문의',
    '기타'
  ]

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    
    try {
      await addInquiry(data)
      
      console.log('문의 데이터:', data)
      setIsSubmitted(true)
      reset()
      
      // 3초 후 성공 상태 초기화
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('문의 제출 실패:', error)
      alert('문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-custom mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wizfore-text-primary mb-4">
            {aboutMessage?.title || "문의하기"}
          </h2>
          <div className="text-sm md:text-base lg:text-lg text-wizfore-text-secondary max-w-2xl mx-auto">
            <p className="whitespace-pre-line">
              {aboutMessage?.description || "궁금한 사항이나 상담을 원하시는 내용을 자세히 적어주시면, 빠른 시일 내에 답변드리겠습니다."}
            </p>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MagicCard className="max-w-2xl mx-auto">
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Check className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-wizfore-text-primary mb-4">
                    문의가 접수되었습니다
                  </h3>
                  <p className="text-sm md:text-base text-wizfore-text-secondary">
                    빠른 시일 내에 답변드리겠습니다.<br />
                    감사합니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-medium text-wizfore-text-primary mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wizfore-coral-primary focus:border-transparent outline-none transition-all text-sm md:text-base"
                      placeholder="이름을 입력해주세요"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* 전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-wizfore-text-primary mb-2">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wizfore-coral-primary focus:border-transparent outline-none transition-all text-sm md:text-base"
                      placeholder="010-0000-0000"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-wizfore-text-primary mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wizfore-coral-primary focus:border-transparent outline-none transition-all text-sm md:text-base"
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* 문의 분류 */}
                  <div>
                    <label className="block text-sm font-medium text-wizfore-text-primary mb-2">
                      문의 분류 <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wizfore-coral-primary focus:border-transparent outline-none transition-all text-sm md:text-base"
                    >
                      <option value="">문의 분류를 선택해주세요</option>
                      {inquiryCategories.map((category, index) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* 문의 내용 */}
                  <div>
                    <label className="block text-sm font-medium text-wizfore-text-primary mb-2">
                      문의 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wizfore-coral-primary focus:border-transparent outline-none transition-all resize-none text-sm md:text-base"
                      placeholder="문의하실 내용을 자세히 작성해주세요"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* 제출 버튼 */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-wizfore-coral-primary hover:bg-wizfore-coral-primary/90 disabled:bg-gray-400 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          문의 접수 중...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 md:w-5 md:h-5" />
                          문의 접수하기
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </MagicCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default OnlineInquirySection