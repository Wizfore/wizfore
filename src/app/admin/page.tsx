import { redirect } from 'next/navigation'

export default function AdminPage() {
  // 관리자 대시보드로 리다이렉트
  redirect('/admin/dashboard')
}