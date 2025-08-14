import { useState, useEffect, useCallback } from 'react'

interface UseAdminFormProps<T> {
  fetchData: () => Promise<T>
  saveData: (data: T) => Promise<void>
  defaultData: T
  validate?: (data: T) => string[]
  cleanData?: (data: T) => T
  onSaveSuccess?: () => void | Promise<void>
}

interface UseAdminFormReturn<T> {
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  originalData: T
  loading: boolean
  saving: boolean
  saveStatus: 'idle' | 'success' | 'error'
  error: string | null
  hasChanges: boolean
  handleSave: () => Promise<void>
  handleReset: () => void
}

export function useAdminForm<T>({
  fetchData,
  saveData,
  defaultData,
  validate,
  cleanData,
  onSaveSuccess
}: UseAdminFormProps<T>): UseAdminFormReturn<T> {
  const [data, setData] = useState<T>(defaultData)
  const [originalData, setOriginalData] = useState<T>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  // fetchData 함수를 메모이제이션하여 불필요한 리렌더링 방지
  const memoizedFetchData = useCallback(fetchData, [fetchData])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedData = await memoizedFetchData()
        setData(fetchedData)
        setOriginalData(fetchedData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        setData(defaultData)
        setOriginalData(defaultData)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [memoizedFetchData, defaultData])

  const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData)
  

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaveStatus('idle')
      
      // 검증
      if (validate) {
        const validationErrors = validate(data)
        if (validationErrors.length > 0) {
          setError(validationErrors.join('\n'))
          setSaveStatus('error')
          setTimeout(() => {
            setSaveStatus('idle')
            setError(null)
          }, 5000)
          return
        }
      }
      
      // 데이터 정리
      const cleanedData = cleanData ? cleanData(data) : data
      
      // 저장
      await saveData(cleanedData)
      setOriginalData(cleanedData)
      setData(cleanedData)
      setSaveStatus('success')
      
      // 저장 성공 콜백 호출 (async 지원)
      if (onSaveSuccess) {
        await onSaveSuccess()
      }
      
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      console.error('Error saving data:', err)
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      setSaveStatus('error')
      setTimeout(() => {
        setSaveStatus('idle')
        setError(null)
      }, 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setData(originalData)
    setSaveStatus('idle')
    setError(null)
  }

  return {
    data,
    setData,
    originalData,
    loading,
    saving,
    saveStatus,
    error,
    hasChanges,
    handleSave,
    handleReset
  }
}