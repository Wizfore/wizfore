'use client'

import TeamOverviewSection from '../common/TeamOverviewSection'
import type { TeamFeature } from '@/types'

interface TherapistsOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: TeamFeature[]
}

const TherapistsOverviewSection: React.FC<TherapistsOverviewSectionProps> = ({ 
  aboutMessage,
  features = []
}) => {
  return (
    <TeamOverviewSection
      aboutMessage={aboutMessage}
      features={features}
      defaultTitle="전문 치료진 소개"
      defaultDescription="위즈포레 사회서비스센터는 여러 명의 전문 치료·상담사가 개인별 특성에 맞는 맞춤형 치료 서비스를 제공하고 있습니다. 각 분야의 전문성을 바탕으로 체계적이고 효과적인 치료를 통해 내담자의 발달과 성장을 지원합니다."
    />
  )
}

export default TherapistsOverviewSection