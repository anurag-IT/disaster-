import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

import '../styles/layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  )
}
