import ProgramOverviewSection from '@/components/programs/common/ProgramOverviewSection'

interface SportsOverviewSectionProps {
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

export default function SportsOverviewSection(props: SportsOverviewSectionProps) {
  return <ProgramOverviewSection {...props} />
}