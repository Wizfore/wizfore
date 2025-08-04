'use client'

import TeamListSection from '../common/TeamListSection'
import type { TeamMember } from '@/types'

interface TeachersListSectionProps {
  teachers: TeamMember[]
}

const TeachersListSection: React.FC<TeachersListSectionProps> = ({ teachers }) => {
  return (
    <TeamListSection 
      members={teachers} 
      memberType="teachers"
    />
  )
}

export default TeachersListSection