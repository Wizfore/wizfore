import ProgramListSection from '@/components/programs/common/ProgramListSection'
import type { ProgramDetail } from '@/types'

interface CounselingListSectionProps {
  programs: ProgramDetail[]
}

export default function CounselingListSection({ programs }: CounselingListSectionProps) {
  return <ProgramListSection programs={programs} programType="counseling" />
}