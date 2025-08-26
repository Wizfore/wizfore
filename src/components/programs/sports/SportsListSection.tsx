import ProgramListSection from '@/components/programs/common/ProgramListSection'
import type { ProgramDetail } from '@/types'

interface SportsListSectionProps {
  programs: ProgramDetail[]
}

export default function SportsListSection({ programs }: SportsListSectionProps) {
  return <ProgramListSection programs={programs} programType="sports" />
}