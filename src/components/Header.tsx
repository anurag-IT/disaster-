import { useState, useEffect } from 'react'
import { Menu, Clock, Bell, Search, ShieldAlert, Activity } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import '../styles/header.css'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [time, setTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHealth, setShowHealth] = useState(false)

  const notifications = useCommandStore((state) => state.notifications)
  const globalSearch = useCommandStore((state) => state.globalSearch)
  const setGlobalSearch = useCommandStore((state) => state.setGlobalSearch)
  const setAdminModalOpen = useCommandStore((state) => state.setAdminModalOpen)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const setSelectedIncident = useCommandStore((state) => state.setSelectedIncident)
  const incidents = useCommandStore((state) => state.incidents)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleNotificationClick = (notif: any) => {
    if (notif.incidentId) {
      const inc = incidents.find((i) => i.id === notif.incidentId)
      if (inc) {
        setSelectedIncident(inc)
        setIncidentModalOpen(true)
      }
    }
    setShowNotifications(false)
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <div className="header-logo">
          <img 
            src="/Nepal_Police_logo.png" 
            alt="Nepal Police Logo" 
            className="header-logo-image"
          />
        </div>
        <div className="header-title">
          <h1>RAKSHA</h1>
          <p>AI-Powered Flood Emergency Command Center</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="header-search-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Global Search (Incident ID, Call ID, Location, Unit)..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="header-center">
        <button
          className="admin-trigger-btn"
          onClick={() => setAdminModalOpen(true)}
          title="Simulate Admin Alert Flow"
        >
          <ShieldAlert size={16} />
          <span>Simulate Admin Alert</span>
        </button>
      </div>

      <div className="header-right">
        {/* System Health Popup Button */}
        <div className="system-health-trigger" onClick={() => setShowHealth(!showHealth)}>
          <span className="health-dot online-dot" />
          <span className="health-label">System Status</span>
          {showHealth && (
            <div className="system-health-dropdown">
              <div className="health-dropdown-header">
                <Activity size={14} /> System Health Indicators
              </div>
              <div className="health-item"><span className="dot online-dot" /> Flood ResQ AI: <strong>Online</strong></div>
              <div className="health-item"><span className="dot online-dot" /> Map Service: <strong>Online</strong></div>
              <div className="health-item"><span className="dot online-dot" /> Emergency Call Service: <strong>Online</strong></div>
              <div className="health-item"><span className="dot online-dot" /> Police Network: <strong>Online</strong></div>
              <div className="health-item"><span className="dot online-dot" /> Database: <strong>Online</strong></div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="notifications-wrapper">
          <button
            className="notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="notif-count-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notif-dropdown-header">
                <span>System Notifications</span>
                <span className="notif-qty">{notifications.length} New</span>
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className="notif-item" onClick={() => handleNotificationClick(n)}>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="time-section">
          <Clock size={18} />
          <div className="time-details">
            <span className="current-time">{formatTime(time)}</span>
            <span className="current-date">{formatDate(time)}</span>
          </div>
        </div>

        <div className="operator-section">
          <div className="operator-avatar-mini">CS</div>
          <div className="operator-info-mini">
            <span className="operator-name">Constable Sharma</span>
            <span className="operator-role">Police Operator</span>
          </div>
        </div>
      </div>
    </header>
  )
}
