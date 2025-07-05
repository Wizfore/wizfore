'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import { 
  getProgramsByCategory, 
  deleteProgram, 
  updateProgram,
  type Program 
} from '@/lib/services/programService'

export default function TherapyProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    loadPrograms()
  }, [])

  async function loadPrograms() {
    try {
      setLoading(true)
      setError(null)
      const data = await getProgramsByCategory('therapy')
      setPrograms(data)
    } catch (err) {
      console.error('프로그램 로드 오류:', err)
      setError('프로그램 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 프로그램 삭제
  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 프로그램을 정말 삭제하시겠습니까?`)) {
      return
    }

    try {
      setDeleteLoading(id)
      await deleteProgram(id)
      await loadPrograms() // 목록 새로고침
      alert('프로그램이 삭제되었습니다.')
    } catch (err) {
      console.error('프로그램 삭제 오류:', err)
      alert('프로그램 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteLoading(null)
    }
  }

  // 프로그램 상태 토글
  async function handleStatusToggle(program: Program) {
    try {
      const newStatus = program.status === 'active' ? 'inactive' : 'active'
      await updateProgram(program.id!, { status: newStatus })
      await loadPrograms() // 목록 새로고침
    } catch (err) {
      console.error('프로그램 상태 변경 오류:', err)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 필터링된 프로그램 목록
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || program.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>프로그램 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">오류 발생</span>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadPrograms}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">치료 프로그램 관리</h1>
          <p className="text-gray-600">위즈포레에서 제공하는 치료 프로그램을 관리합니다</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>새 프로그램 추가</span>
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="프로그램명이나 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={loadPrograms}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 프로그램 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            프로그램 목록 ({filteredPrograms.length}개)
          </h2>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    프로그램명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    대상연령
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    소요시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {program.name}
                          </div>
                          {program.featured && (
                            <span className="ml-2 inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              추천
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {program.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {program.targetAge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {program.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(program)}
                        className={`inline-block px-2 py-1 text-xs rounded-full transition-colors ${
                          program.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {program.status === 'active' ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {program.createdAt 
                        ? program.createdAt.toDate().toLocaleDateString('ko-KR')
                        : '날짜 없음'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1" title="보기">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1" title="수정">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(program.id!, program.name)}
                          disabled={deleteLoading === program.id}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          title="삭제"
                        >
                          {deleteLoading === program.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? '검색 조건에 맞는 프로그램이 없습니다.' 
                : '등록된 치료 프로그램이 없습니다.'
              }
            </div>
            {!searchTerm && filterStatus === 'all' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                첫 번째 프로그램 추가하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}