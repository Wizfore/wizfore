import ProgramOverviewSection from '@/components/programs/common/ProgramOverviewSection'

interface AfterschoolOverviewSectionProps {
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

export default function AfterschoolOverviewSection(props: AfterschoolOverviewSectionProps) {
  return <ProgramOverviewSection {...props} />
}