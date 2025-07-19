import ProgramListSection from '@/components/programs/common/ProgramListSection'

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
  return <ProgramListSection programs={programs} programType="counseling" />
}