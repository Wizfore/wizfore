import ProgramListSection from '@/components/programs/common/ProgramListSection'

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
  return <ProgramListSection programs={programs} programType="sports" />
}