'use client'

import TeamMemberCard from './TeamMemberCard'
import type { TeamMember } from '@/types'

interface TeamListSectionProps {
  members: TeamMember[]
  memberType: 'teachers' | 'therapists'
  labels?: {
    education?: string
    certifications?: string
  }
}

const TeamListSection: React.FC<TeamListSectionProps> = ({ 
  members, 
  memberType,
  labels 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {members
            .sort((a, b) => a.order - b.order)
            .map((member, index) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                index={index}
                memberType={memberType}
                labels={labels}
              />
            ))}
        </div>
      </div>
    </section>
  )
}

export default TeamListSection