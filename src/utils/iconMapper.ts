import { 
  Heart, 
  Users, 
  Shield, 
  GraduationCap, 
  Award, 
  Target,
  type LucideIcon 
} from 'lucide-react'

export const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'Heart': Heart,
    'Users': Users,
    'Shield': Shield,
    'GraduationCap': GraduationCap,
    'Award': Award,
    'Target': Target
  }
  
  return iconMap[iconName] || Users
}