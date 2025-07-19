import ProgramListSection from '@/components/programs/common/ProgramListSection'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

interface AfterschoolListSectionProps {
  programs: Program[]
}

export default function AfterschoolListSection({ programs }: AfterschoolListSectionProps) {
  return <ProgramListSection programs={programs} programType="afterschool" />
}