import { ReactNode } from 'react'

interface DevToolsLayoutProps {
  children: ReactNode
}

export default function DevToolsLayout({ children }: DevToolsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}