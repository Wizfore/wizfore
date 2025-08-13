'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Building2, 
  BookOpen, 
  MessageSquare,
  Settings,
  Trash2,
  Download,
  Home,
  Mail
} from 'lucide-react'

import { 
  addDefaultDataByCategory, 
  checkAllCategoriesDataStatus,
  deleteAllDefaultData,
  addAllDefaultData,
  deleteCategoryData
} from '@/lib/services/seedService'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ProgressDialog from '@/components/ui/ProgressDialog'

interface DataCategory {
  id: string
  title: string
  description: string
  icon: React.ElementType
  collections: string[]
  color: string
}

const dataCategories: DataCategory[] = [
  {
    id: 'site-info',
    title: '사이트 기본 정보',
    description: '기관 개요, 연락처, 핵심 가치 등 기본 정보를 추가합니다.',
    icon: Settings,
    collections: ['siteInfo'],
    color: 'blue'
  },
  {
    id: 'about-info',
    title: '센터 소개',
    description: '센터장 정보, 발자취, 자문위원 정보를 추가합니다.',
    icon: Building2,
    collections: ['aboutInfo'],
    color: 'green'
  },
  {
    id: 'programs',
    title: '프로그램 정보',
    description: '모든 치료 및 활동 프로그램 정보를 추가합니다.',
    icon: BookOpen,
    collections: ['programs'],
    color: 'purple'
  },
  {
    id: 'team',
    title: '전문가 소개',
    description: '치료사 및 교사 정보를 추가합니다.',
    icon: Users,
    collections: ['team'],
    color: 'orange'
  },
  {
    id: 'community',
    title: '커뮤니티',
    description: '센터 소식, 공지사항 정보를 추가합니다.',
    icon: MessageSquare,
    collections: ['community'],
    color: 'pink'
  },
  {
    id: 'home-config',
    title: '홈페이지 설정',
    description: '히어로 슬라이드, 섹션 활성화 설정을 추가합니다.',
    icon: Home,
    collections: ['homeConfig'],
    color: 'indigo'
  },
  {
    id: 'inquiry',
    title: '문의 정보',
    description: '온라인 문의 히어로, 메시지, 카테고리 정보를 추가합니다.',
    icon: Mail,
    collections: ['inquiry'],
    color: 'teal'
  }
]

interface DataCategoryCardProps {
  category: DataCategory
  hasData: boolean
  isLoading: boolean
  onAddData: (_categoryId: string) => void
  onDeleteData: (_categoryId: string) => void
}

function DataCategoryCard({ category, hasData, isLoading, onAddData, onDeleteData }: DataCategoryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    teal: 'bg-teal-50 border-teal-200 text-teal-900'
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
    teal: 'text-teal-600'
  }

  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    pink: 'bg-pink-600 hover:bg-pink-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    teal: 'bg-teal-600 hover:bg-teal-700'
  }

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[category.color as keyof typeof colorClasses]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <category.icon className={`w-8 h-8 ${iconColorClasses[category.color as keyof typeof iconColorClasses]}`} />
          <div>
            <h3 className="text-lg font-semibold">{category.title}</h3>
            <p className="text-sm opacity-75 mt-1">{category.description}</p>
          </div>
        </div>
        
        {hasData ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">데이터 존재</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-500">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">데이터 없음</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">관련 컬렉션:</p>
        <div className="flex flex-wrap gap-2">
          {category.collections.map((collection) => (
            <span
              key={collection}
              className="px-2 py-1 text-xs rounded-md bg-white bg-opacity-60"
            >
              {collection}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onAddData(category.id)}
          disabled={hasData || isLoading}
          className={`flex-1 px-4 py-2 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            hasData 
              ? 'bg-gray-400' 
              : buttonColorClasses[category.color as keyof typeof buttonColorClasses]
          }`}
        >
          {isLoading ? '추가 중...' : hasData ? '이미 추가됨' : '기본 데이터 추가'}
        </button>
        
        <button
          onClick={() => onDeleteData(category.id)}
          disabled={!hasData || isLoading}
          className="flex-1 px-4 py-2 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
        >
          {isLoading ? '삭제 중...' : !hasData ? '삭제할 데이터 없음' : '기본 데이터 삭제'}
        </button>
      </div>
    </div>
  )
}

export default function DefaultDataPage() {
  const [dataStatus, setDataStatus] = useState<Record<string, boolean>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isCheckingData, setIsCheckingData] = useState(true)
  
  // 전체 작업 관련 상태
  const [isGlobalLoading, setIsGlobalLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddConfirm, setShowAddConfirm] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressInfo, setProgressInfo] = useState({
    title: '',
    current: '',
    completed: 0,
    total: 0,
    isCompleted: false
  })

  useEffect(() => {
    checkAllDataStatus()
  }, [])

  const checkAllDataStatus = async () => {
    setIsCheckingData(true)
    
    try {
      const status = await checkAllCategoriesDataStatus()
      setDataStatus(status)
    } catch (error) {
      console.error('데이터 상태 확인 실패:', error)
    } finally {
      setIsCheckingData(false)
    }
  }

  const handleAddData = async (categoryId: string) => {
    setLoadingStates(prev => ({ ...prev, [categoryId]: true }))
    
    try {
      await addDefaultDataByCategory(categoryId)
      setDataStatus(prev => ({ ...prev, [categoryId]: true }))
      alert('기본 데이터가 성공적으로 추가되었습니다!')
    } catch (error) {
      console.error('데이터 추가 실패:', error)
      alert('데이터 추가에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoadingStates(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  const handleDeleteData = async (categoryId: string) => {
    if (!confirm('정말로 이 카테고리의 기본 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [categoryId]: true }))
    
    try {
      await deleteCategoryData(categoryId)
      setDataStatus(prev => ({ ...prev, [categoryId]: false }))
      alert('기본 데이터가 성공적으로 삭제되었습니다!')
    } catch (error) {
      console.error('데이터 삭제 실패:', error)
      alert('데이터 삭제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoadingStates(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  // 모든 데이터 삭제
  const handleDeleteAll = async () => {
    setIsGlobalLoading(true)
    setShowDeleteConfirm(false)
    
    try {
      setProgressInfo({
        title: '모든 데이터 삭제 중...',
        current: 'Firebase 컬렉션 삭제 중',
        completed: 0,
        total: 1,
        isCompleted: false
      })
      setShowProgress(true)
      
      await deleteAllDefaultData()
      
      setProgressInfo(prev => ({
        ...prev,
        completed: 1,
        isCompleted: true,
        current: '삭제 완료'
      }))
      
      // 데이터 상태 갱신
      await checkAllDataStatus()
      
      setTimeout(() => {
        setShowProgress(false)
        alert('모든 기본 데이터가 삭제되었습니다.')
      }, 1500)
      
    } catch (error) {
      console.error('전체 데이터 삭제 실패:', error)
      setShowProgress(false)
      alert('데이터 삭제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGlobalLoading(false)
    }
  }

  // 모든 데이터 추가
  const handleAddAll = async () => {
    setIsGlobalLoading(true)
    setShowAddConfirm(false)
    
    try {
      setProgressInfo({
        title: '모든 데이터 추가 중...',
        current: '시작 중...',
        completed: 0,
        total: 8,
        isCompleted: false
      })
      setShowProgress(true)
      
      await addAllDefaultData((completed, total, current) => {
        setProgressInfo(prev => ({
          ...prev,
          completed,
          total,
          current,
          isCompleted: completed === total
        }))
      })
      
      // 데이터 상태 갱신
      await checkAllDataStatus()
      
      setTimeout(() => {
        setShowProgress(false)
        alert('모든 기본 데이터가 추가되었습니다!')
      }, 1500)
      
    } catch (error) {
      console.error('전체 데이터 추가 실패:', error)
      setShowProgress(false)
      alert('데이터 추가에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGlobalLoading(false)
    }
  }

  const hasAnyData = Object.values(dataStatus).some(exists => exists)
  const hasAllData = Object.values(dataStatus).every(exists => exists)

  if (isCheckingData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">데이터 상태를 확인하는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">기본 데이터 추가</h1>
              <p className="text-gray-600">
                wizfore_archive.md의 데이터를 Firebase에 추가할 수 있습니다. 
                데이터가 이미 존재하는 카테고리는 추가할 수 없습니다.
              </p>
            </div>
            
            {/* 전체 관리 버튼들 */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={!hasAnyData || isGlobalLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>모든 데이터 삭제</span>
              </button>
              
              <button
                onClick={() => setShowAddConfirm(true)}
                disabled={hasAllData || isGlobalLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>모든 데이터 추가</span>
              </button>
            </div>
          </div>
        </div>

        {/* 전체 상태 요약 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">전체 현황</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(dataStatus).filter(exists => exists).length}
              </div>
              <div className="text-sm text-gray-600">추가된 카테고리</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(dataStatus).filter(exists => !exists).length}
              </div>
              <div className="text-sm text-gray-600">추가 가능한 카테고리</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{dataCategories.length}</div>
              <div className="text-sm text-gray-600">전체 카테고리</div>
            </div>
          </div>
        </div>

        {/* 데이터 카테고리 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataCategories.map((category) => (
            <DataCategoryCard
              key={category.id}
              category={category}
              hasData={dataStatus[category.id] || false}
              isLoading={loadingStates[category.id] || false}
              onAddData={handleAddData}
              onDeleteData={handleDeleteData}
            />
          ))}
        </div>

        {/* 주의사항 */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">주의사항</h3>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• 데이터가 이미 존재하는 카테고리는 추가할 수 없습니다.</li>
                <li>• 기본 데이터 추가 후에는 각 관리 페이지에서 수정할 수 있습니다.</li>
                <li>• 데이터 추가는 되돌릴 수 없으니 신중하게 진행해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 확인 다이얼로그들 */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAll}
          title="모든 데이터 삭제"
          message={`정말로 모든 기본 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 다음 컬렉션의 모든 데이터가 삭제됩니다:\n• 사이트 기본 정보 (siteInfo)\n• 센터 소개 (aboutInfo)\n• 프로그램 정보 (programs)\n• 전문가 소개 (team)\n• 커뮤니티 (community)\n• 홈페이지 설정 (homeConfig)\n• 문의 정보 (inquiry)\n• 사이트 에셋 (siteAssets)\n\n신중하게 결정해주세요.`}
          confirmText="모든 데이터 삭제"
          cancelText="취소"
          type="danger"
          isLoading={isGlobalLoading}
        />

        <ConfirmDialog
          isOpen={showAddConfirm}
          onClose={() => setShowAddConfirm(false)}
          onConfirm={handleAddAll}
          title="모든 데이터 추가"
          message={`wizfore_archive.md의 모든 기본 데이터를 Firebase에 추가하시겠습니까?\n\n다음 카테고리의 데이터가 추가됩니다:\n• 사이트 기본 정보\n• 센터 소개\n• 프로그램 정보\n• 전문가 소개\n• 커뮤니티\n• 홈페이지 설정\n• 문의 정보\n• 사이트 에셋\n\n이미 존재하는 데이터가 있는 카테고리는 건너뛰어집니다.`}
          confirmText="모든 데이터 추가"
          cancelText="취소"
          type="info"
          isLoading={isGlobalLoading}
        />

        {/* 진행 상태 다이얼로그 */}
        <ProgressDialog
          isOpen={showProgress}
          title={progressInfo.title}
          currentStep={progressInfo.current}
          completed={progressInfo.completed}
          total={progressInfo.total}
          isCompleted={progressInfo.isCompleted}
        />
      </div>
    </div>
  )
}