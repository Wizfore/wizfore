'use client'

import ProgramCard from '@/components/programs/ProgramCard'
import { getIconMapper, getGridConfig } from '@/lib/utils/programIconMapper'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

interface CounselingListSectionProps {
  programs: Program[]
}

export default function CounselingListSection({ programs }: CounselingListSectionProps) {
  const iconMapper = getIconMapper('therapy') // counseling uses therapy mapper
  const gridConfig = getGridConfig('therapy')

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <div className={gridConfig}>
          {programs
            .sort((a, b) => a.order - b.order)
            .map((program, index) => {
              const IconComponent = iconMapper.getIcon(program.title)
              return (
                <ProgramCard
                  key={program.title}
                  program={program}
                  icon={<IconComponent className="w-6 h-6" />}
                  colorClass={iconMapper.getColorClass(program.title)}
                  index={index}
                  cardType="therapy"
                />
              )
            })}
        </div>
      </div>
    </section>
  )
}