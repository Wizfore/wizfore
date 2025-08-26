import ProgramListSection from '@/components/programs/common/ProgramListSection'
import type { ProgramDetail } from '@/types'

interface AfterschoolListSectionProps {
  programs: ProgramDetail[]
}

export default function AfterschoolListSection({ programs }: AfterschoolListSectionProps) {
  return <ProgramListSection programs={programs} programType="afterschool" />
}