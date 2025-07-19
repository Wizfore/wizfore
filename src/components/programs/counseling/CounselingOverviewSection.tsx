import ProgramOverviewSection from '@/components/programs/common/ProgramOverviewSection'

interface CounselingOverviewSectionProps {
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

export default function CounselingOverviewSection(props: CounselingOverviewSectionProps) {
  return <ProgramOverviewSection {...props} />
}