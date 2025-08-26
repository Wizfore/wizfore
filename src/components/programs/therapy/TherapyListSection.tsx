import ProgramListSection from '@/components/programs/common/ProgramListSection'
import type { ProgramDetail } from '@/types'

interface TherapyListSectionProps {
  programs: ProgramDetail[]
}

export default function TherapyListSection({ programs }: TherapyListSectionProps) {
  return <ProgramListSection programs={programs} programType="therapy" />
}