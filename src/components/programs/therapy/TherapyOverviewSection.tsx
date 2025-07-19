import ProgramOverviewSection from '@/components/programs/common/ProgramOverviewSection'

interface TherapyOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
}

export default function TherapyOverviewSection(props: TherapyOverviewSectionProps) {
  return <ProgramOverviewSection {...props} />
}