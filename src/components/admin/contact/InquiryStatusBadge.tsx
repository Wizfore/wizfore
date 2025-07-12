'use client'

import { Clock, CheckCircle, CheckCircle2 } from 'lucide-react'
import { Inquiry } from '@/lib/services/inquiryService'

interface InquiryStatusBadgeProps {
  status: Inquiry['status']
}

export default function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  const getStatusConfig = (status: Inquiry['status']) => {
    switch (status) {
      case 'unread':
        return {
          label: '대기',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: Clock,
          iconColor: 'text-red-600'
        }
      case 'replied':
        return {
          label: '처리중',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: CheckCircle,
          iconColor: 'text-yellow-600'
        }
      case 'resolved':
        return {
          label: '완료',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600'
        }
      default:
        return {
          label: '알 수 없음',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600'
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className={`w-3 h-3 mr-1 ${config.iconColor}`} />
      {config.label}
    </span>
  )
}