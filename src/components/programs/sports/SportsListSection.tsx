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

interface SportsListSectionProps {
  programs: Program[]
}

export default function SportsListSection({ programs }: SportsListSectionProps) {
  const iconMapper = getIconMapper('afterschool') // sports uses afterschool mapper (2-column grid)
  const gridConfig = getGridConfig('afterschool')

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
                  cardType="afterschool"
                />
              )
            })}
        </div>
      </div>
    </section>
  )
}