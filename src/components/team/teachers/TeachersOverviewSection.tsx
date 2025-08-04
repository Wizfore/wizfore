'use client'

import TeamOverviewSection from '../common/TeamOverviewSection'
import type { TeamFeature } from '@/types'

interface TeachersOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
}

const TeachersOverviewSection: React.FC<TeachersOverviewSectionProps> = ({ 
  aboutMessage,
  features = []
}) => {
  return (
    <TeamOverviewSection
      aboutMessage={aboutMessage}
      features={features}
      defaultTitle="전문 교육진 소개"
      defaultDescription="위즈포레 사회서비스센터는 여러 명의 전문 교사진이 성인 발달장애인 주간활동 프로그램과 학령기 아동 방과후 프로그램을 운영하고 있습니다. 사회복지, 특수교육, 간호 등 다양한 전문 분야의 교사들이 개별 맞춤형 교육과 돌봄 서비스를 제공합니다."
    />
  )
}

export default TeachersOverviewSection