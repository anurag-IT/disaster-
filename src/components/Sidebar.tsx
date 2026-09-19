import { Link, useLocation } from 'react-router-dom'

import {
  Home,
  AlertCircle,
  Bell,
  Map,
  MapPin,
  Phone,
  Shield,
  Users,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/sidebar.css'

interface SidebarProps {
  open: boolean
}

export default function Sidebar({ open }: SidebarProps) {
  const location = useLocation()
  const incidents = useCommandStore((state) => state.incidents)
  const unresolvedCount = incidents.filter((i) => i.status !== 'RESOLVED').length

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/incidents', icon: AlertCircle, label: 'Live Incidents', badge: unresolvedCount },
    { path: '/alerts', icon: Bell, label: 'Emergency Alerts' },
    { path: '/map', icon: Map, label: 'Map View' },
    { path: '/risk-zones', icon: MapPin, label: 'Risk Zones' },
    { path: '/calls', icon: Phone, label: 'Emergency Calls' },
    { path: '/units', icon: Shield, label: 'Police Units' },
    { path: '/resources', icon: Users, label: 'Teams & Resources' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img 
            src="/Nepal_Police_logo.png" 
            alt="Nepal Police Logo" 
            className="logo-image"
          />
          <div className="logo-text">
            <div className="logo-title">RAKSHA</div>
            <div className="logo-subtitle">Police Emergency Response</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge ? <span className="badge">{item.badge}</span> : null}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="operator-profile">
          <div className="operator-avatar">CS</div>
          <div className="operator-info">
            <div className="operator-name">Constable Sharma</div>
            <div className="operator-role">Police Operator</div>
            <div className="operator-status">● Online</div>
          </div>
        </div>
        <button className="logout-btn" title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
