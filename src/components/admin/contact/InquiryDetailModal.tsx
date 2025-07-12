'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Tag,
  Clock,
  CheckCircle,
  CheckCircle2,
  Trash2,
  Save
} from 'lucide-react'
import { Inquiry } from '@/lib/services/inquiryService'
import InquiryStatusBadge from './InquiryStatusBadge'

interface InquiryDetailModalProps {
  inquiry: Inquiry
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: Inquiry['status']) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function InquiryDetailModal({
  inquiry,
  isOpen,
  onClose,
  onStatusChange,
  onDelete
}: InquiryDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Inquiry['status']>(inquiry.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setSelectedStatus(inquiry.status)
  }, [inquiry.status])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleStatusUpdate = async () => {
    if (selectedStatus === inquiry.status) return

    setIsUpdating(true)
    try {
      await onStatusChange(inquiry.id!, selectedStatus)
    } catch (error) {
      console.error('상태 변경 오류:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

    setIsDeleting(true)
    try {
      await onDelete(inquiry.id!)
      onClose()
    } catch (error) {
      console.error('삭제 오류:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStatusIcon = (status: Inquiry['status']) => {
    switch (status) {
      case 'unread':
        return <Clock className="w-4 h-4 text-red-500" />
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      />

      {/* 모달 컨텐츠 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">문의 상세 정보</h2>
                <p className="text-sm text-gray-500">ID: {inquiry.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <InquiryStatusBadge status={inquiry.status} />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* 내용 */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {/* 문의자 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  문의자 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">이름</p>
                      <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">전화번호</p>
                      <p className="text-sm font-medium text-gray-900">{inquiry.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">이메일</p>
                      <p className="text-sm font-medium text-gray-900">{inquiry.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 문의 정보 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  문의 내용
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">분류</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {inquiry.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">문의 내용</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed break-words">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 처리 정보 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  처리 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">접수일시</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(inquiry.createdAt)}</p>
                    </div>
                  </div>
                  {inquiry.repliedAt && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500">답변일시</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(inquiry.repliedAt)}</p>
                      </div>
                    </div>
                  )}
                  {inquiry.adminNote && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">관리자 메모</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">{inquiry.adminNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 상태 변경 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  {getStatusIcon(selectedStatus)}
                  <span className="ml-2">상태 변경</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Inquiry['status'])}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unread">대기</option>
                    <option value="replied">처리중</option>
                    <option value="resolved">완료</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={selectedStatus === inquiry.status || isUpdating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>변경중...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>변경</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>삭제 중...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>문의 삭제</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}