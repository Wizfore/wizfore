'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Database, Plus, Trash2, RefreshCw, AlertTriangle, Users, Key } from 'lucide-react'
import { 
  addAllSampleData, 
  addSamplePrograms, 
  addSampleInquiries, 
  addSampleNews 
} from '@/lib/utils/sampleData'
import {
  createAllDefaultAccounts,
  createDefaultAdminAccount,
  createDefaultStaffAccount
} from '@/lib/utils/createDefaultAccounts'

export default function DevToolsPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [message, ...prev])
  }

  const clearResults = () => {
    setResults([])
  }

  const handleAddSampleData = async (type: 'all' | 'programs' | 'inquiries' | 'news') => {
    try {
      setLoading(type)
      
      switch (type) {
        case 'all':
          await addAllSampleData()
          addResult('✅ 모든 샘플 데이터가 성공적으로 추가되었습니다.')
          break
        case 'programs':
          await addSamplePrograms()
          addResult('✅ 샘플 프로그램 데이터가 추가되었습니다.')
          break
        case 'inquiries':
          await addSampleInquiries()
          addResult('✅ 샘플 문의 데이터가 추가되었습니다.')
          break
        case 'news':
          await addSampleNews()
          addResult('✅ 샘플 뉴스 데이터가 추가되었습니다.')
          break
      }
    } catch (error) {
      console.error('샘플 데이터 추가 오류:', error)
      addResult(`❌ 오류 발생: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  const handleCreateAccounts = async (type: 'all' | 'admin' | 'staff') => {
    try {
      setLoading(`account-${type}`)
      
      switch (type) {
        case 'all':
          await createAllDefaultAccounts()
          addResult('✅ 모든 기본 계정이 성공적으로 생성되었습니다.')
          break
        case 'admin':
          await createDefaultAdminAccount()
          addResult('✅ 관리자 계정이 생성되었습니다. (admin@wizfore.com / wizfore123)')
          break
        case 'staff':
          await createDefaultStaffAccount()
          addResult('✅ 직원 계정이 생성되었습니다. (staff@wizfore.com / wizfore123)')
          break
      }
    } catch (error) {
      console.error('계정 생성 오류:', error)
      addResult(`❌ 계정 생성 오류: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center space-x-3">
        <Database className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">개발자 도구</h1>
          <p className="text-gray-600">Firebase 데이터베이스 관리 및 계정 설정</p>
        </div>
      </div>

      {/* 경고 메시지 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">주의사항</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>• 이 도구는 개발 및 테스트 목적으로만 사용하세요.</p>
              <p>• 샘플 데이터 추가는 기존 데이터와 중복될 수 있습니다.</p>
              <p>• 운영 환경에서는 사용하지 마세요.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 계정 관리 도구 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Key className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">테스트 계정 생성</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 모든 계정 생성 */}
          <button
            onClick={() => handleCreateAccounts('all')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'account-all' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Users className="w-5 h-5 text-green-600" />
            )}
            <span className="font-medium text-green-700">모든 계정 생성</span>
          </button>

          {/* 관리자 계정 생성 */}
          <button
            onClick={() => handleCreateAccounts('admin')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'account-admin' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Key className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium text-red-700">관리자 계정</span>
          </button>

          {/* 직원 계정 생성 */}
          <button
            onClick={() => handleCreateAccounts('staff')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'account-staff' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Users className="w-5 h-5 text-blue-600" />
            )}
            <span className="font-medium text-blue-700">직원 계정</span>
          </button>
        </div>

        {/* 계정 정보 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">생성될 계정 정보</h3>
          <div className="text-xs text-blue-700 space-y-2">
            <div>
              <p className="font-medium">관리자 계정:</p>
              <p>이메일: admin@wizfore.com | 비밀번호: wizfore123</p>
            </div>
            <div>
              <p className="font-medium">직원 계정:</p>
              <p>이메일: staff@wizfore.com | 비밀번호: wizfore123</p>
            </div>
          </div>
        </div>
      </div>

      {/* 샘플 데이터 추가 도구 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">샘플 데이터 추가</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 모든 샘플 데이터 추가 */}
          <button
            onClick={() => handleAddSampleData('all')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'all' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-blue-600" />
            )}
            <span className="font-medium text-blue-700">모든 샘플 데이터 추가</span>
          </button>

          {/* 프로그램 샘플 데이터 */}
          <button
            onClick={() => handleAddSampleData('programs')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'programs' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-green-600" />
            )}
            <span className="font-medium text-green-700">프로그램 샘플 데이터</span>
          </button>

          {/* 문의 샘플 데이터 */}
          <button
            onClick={() => handleAddSampleData('inquiries')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'inquiries' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-purple-600" />
            )}
            <span className="font-medium text-purple-700">문의 샘플 데이터</span>
          </button>

          {/* 뉴스 샘플 데이터 */}
          <button
            onClick={() => handleAddSampleData('news')}
            disabled={loading !== null}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'news' ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-orange-600" />
            )}
            <span className="font-medium text-orange-700">뉴스 샘플 데이터</span>
          </button>
        </div>
      </div>

      {/* 실행 결과 */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">실행 결과</h2>
            <button
              onClick={clearResults}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>지우기</span>
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm font-mono ${
                  result.startsWith('✅')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : result.startsWith('❌')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : result.startsWith('ℹ️')
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Firebase 연결 상태 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Firebase 연결 상태</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Firestore 연결됨</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Firebase Auth 연결됨</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Project ID: wizfore-demo
          </div>
        </div>
      </div>
    </div>
  )
}