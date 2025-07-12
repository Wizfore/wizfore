import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminLayoutWrapper from '@/components/admin/layout/AdminLayoutContent'
import { Toaster } from 'react-hot-toast'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutWrapper>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </AdminLayoutWrapper>
    </AuthProvider>
  )
}