'use client'

import { motion } from 'framer-motion'
import { Youtube, MessageCircle, Share2, Heart } from 'lucide-react'

interface SNSYouTubeSectionProps {
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
}

export default function SNSYouTubeSection({ aboutMessage, youtube }: SNSYouTubeSectionProps) {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
      <div className="container-custom mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-wizfore-text-primary mb-3 md:mb-4">
            {aboutMessage?.title || "위즈포레 YouTube"}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-wizfore-text-secondary">
            {aboutMessage?.description || "센터의 생생한 활동 모습을 만나보세요"}
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {youtube?.link ? (
            /* YouTube 비디오 임베드 */
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src={youtube.link}
                  title="위즈포레 소개 영상"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            
            {/* 비디오 정보 */}
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-wizfore-text-primary mb-2 md:mb-3">
                    {youtube?.message?.title || "위즈포레 사회서비스센터 소개"}
                  </h3>
                  <p className="text-sm md:text-base text-wizfore-text-secondary mb-3 md:mb-4 leading-relaxed">
                    {youtube?.message?.description || "위즈포레에서 제공하는 다양한 치료 프로그램과 서비스를 소개하는 영상입니다. 센터의 시설과 전문가들, 그리고 이용자들의 모습을 통해 위즈포레가 추구하는 가치를 확인해보세요."}
                  </p>
                </div>
              </div>
              
              {/* 영상 액션 버튼들 */}
              <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-100">
                <button className="flex items-center gap-1.5 md:gap-2 text-wizfore-text-secondary hover:text-wizfore-warm-brown transition-colors">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">좋아요</span>
                </button>
                <button className="flex items-center gap-1.5 md:gap-2 text-wizfore-text-secondary hover:text-wizfore-warm-brown transition-colors">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">댓글</span>
                </button>
                <button className="flex items-center gap-1.5 md:gap-2 text-wizfore-text-secondary hover:text-wizfore-warm-brown transition-colors">
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">공유</span>
                </button>
              </div>
            </div>
            </div>
          ) : (
            /* YouTube 링크가 없을 때 */
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden p-8 md:p-12 text-center">
              <Youtube className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-wizfore-text-primary mb-2">
                준비 중입니다
              </h3>
              <p className="text-sm md:text-base text-wizfore-text-secondary">
                YouTube 영상을 준비 중입니다. 조금만 기다려주세요.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}