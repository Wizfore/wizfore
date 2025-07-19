import ProgramOverviewSection from '@/components/programs/common/ProgramOverviewSection'

interface AdultDayOverviewSectionProps {
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

export default function AdultDayOverviewSection(props: AdultDayOverviewSectionProps) {
  return <ProgramOverviewSection {...props} />
}