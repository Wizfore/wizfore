import ProgramListSection from '@/components/programs/common/ProgramListSection'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

interface TherapyListSectionProps {
  programs: Program[]
}

export default function TherapyListSection({ programs }: TherapyListSectionProps) {
  return <ProgramListSection programs={programs} programType="therapy" />
}