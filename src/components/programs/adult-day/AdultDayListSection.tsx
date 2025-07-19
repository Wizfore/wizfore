import ProgramListSection from '@/components/programs/common/ProgramListSection'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

interface AdultDayListSectionProps {
  programs: Program[]
}

export default function AdultDayListSection({ programs }: AdultDayListSectionProps) {
  return <ProgramListSection programs={programs} programType="adult-day" />
}