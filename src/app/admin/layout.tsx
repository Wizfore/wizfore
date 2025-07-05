import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutContent'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </AuthProvider>
  )
}