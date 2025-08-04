'use client'

import TeamListSection from '../common/TeamListSection'
import type { TeamMember } from '@/types'

interface TherapistsListSectionProps {
  therapists: TeamMember[]
}

const TherapistsListSection: React.FC<TherapistsListSectionProps> = ({ therapists }) => {
  return (
    <TeamListSection 
      members={therapists} 
      memberType="therapists"
    />
  )
}

export default TherapistsListSection