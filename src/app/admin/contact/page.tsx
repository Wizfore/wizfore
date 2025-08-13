'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw,
  Clock,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  getAllInquiries, 
  updateInquiryStatus, 
  deleteInquiry,
  type Inquiry 
} from '@/lib/services/inquiryService'
import InquiryDetailModal from '@/components/admin/contact/InquiryDetailModal'
import InquiryStatusBadge from '@/components/admin/contact/InquiryStatusBadge'
import toast from 'react-hot-toast'

type FilterStatus = 'all' | 'unread' | 'replied' | 'resolved'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiries, filterStatus, searchTerm])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await getAllInquiries()
      setInquiries(data)
    } catch (error) {
      console.error('문의 목록 조회 오류:', error)
      toast.error('문의 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const filterInquiries = () => {
    let filtered = inquiries

    // 상태별 필터링
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === filterStatus)
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredInquiries(filtered)
    setCurrentPage(1)
  }

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      await updateInquiryStatus(id, newStatus)
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
      ))
      toast.success('상태가 변경되었습니다.')
    } catch (error) {
      console.error('상태 변경 오류:', error)
      toast.error('상태 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 문의를 삭제하시겠습니까?')) return

    try {
      await deleteInquiry(id)
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== id))
      toast.success('문의가 삭제되었습니다.')
    } catch (error) {
      console.error('문의 삭제 오류:', error)
      toast.error('문의 삭제에 실패했습니다.')
    }
  }

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  const formatDate = (timestamp: { toDate?: () => Date } | Date | string | null) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 페이지네이션
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex)

  const statusStats = {
    total: inquiries.length,
    unread: inquiries.filter(i => i.status === 'unread').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>문의 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
          <p className="text-gray-600">고객 문의를 확인하고 관리하세요</p>
        </div>
        <button
          onClick={fetchInquiries}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>새로고침</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 문의</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">대기</p>
              <p className="text-2xl font-bold text-red-600">{statusStats.unread}</p>
            </div>
            <Clock className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">처리중</p>
              <p className="text-2xl font-bold text-yellow-600">{statusStats.replied}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">완료</p>
              <p className="text-2xl font-bold text-green-600">{statusStats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 이메일, 분류, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 상태</option>
              <option value="unread">대기</option>
              <option value="replied">처리중</option>
              <option value="resolved">완료</option>
            </select>
          </div>
        </div>
      </div>

      {/* 문의 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  문의자 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  분류
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInquiries.map((inquiry) => (
                <motion.tr
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => handleViewDetails(inquiry)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{inquiry.email}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{inquiry.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {inquiry.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {inquiry.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InquiryStatusBadge status={inquiry.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(inquiry.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          if (inquiry.id) {
                            handleStatusChange(inquiry.id, e.target.value as Inquiry['status'])
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="unread">대기</option>
                        <option value="replied">처리중</option>
                        <option value="resolved">완료</option>
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (inquiry.id) {
                            handleDelete(inquiry.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                전체 {filteredInquiries.length}개 중 {startIndex + 1}-{Math.min(endIndex, filteredInquiries.length)}개 표시
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 빈 상태 */}
      {filteredInquiries.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">문의가 없습니다</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? '검색 조건에 맞는 문의를 찾을 수 없습니다.' 
              : '아직 접수된 문의가 없습니다.'}
          </p>
        </div>
      )}

      {/* 상세 모달 */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <InquiryDetailModal
            inquiry={selectedInquiry}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}