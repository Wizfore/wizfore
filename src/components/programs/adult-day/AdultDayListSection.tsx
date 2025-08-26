import ProgramListSection from '@/components/programs/common/ProgramListSection'
import type { ProgramDetail } from '@/types'

interface AdultDayListSectionProps {
  programs: ProgramDetail[]
}

export default function AdultDayListSection({ programs }: AdultDayListSectionProps) {
  return <ProgramListSection programs={programs} programType="adult-day" />
}