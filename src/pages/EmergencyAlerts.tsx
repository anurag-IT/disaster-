import { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Users, CheckCircle, ShieldAlert, Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/emergency-alerts-page.css'

export default function EmergencyAlerts() {
  const alerts = useCommandStore((state) => state.alerts)
  const acknowledgeAlert = useCommandStore((state) => state.acknowledgeAlert)
  const setAdminModalOpen = useCommandStore((state) => state.setAdminModalOpen)
  const setSelectedRiskZone = useCommandStore((state) => state.setSelectedRiskZone)
  const riskZones = useCommandStore((state) => state.riskZones)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin-command') {
      setAdminModalOpen(true)
    }
  }, [location.pathname, setAdminModalOpen])

  const [activeTab, setActiveTab] = useState('ALL')


  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'ALL') return true
    return a.status === activeTab
  })

  const handleViewOnMap = (areaName: string) => {
    const matchedZone = riskZones.find((z) => z.name.toLowerCase().includes(areaName.toLowerCase()))
    if (matchedZone) {
      setSelectedRiskZone(matchedZone)
    }
    navigate('/map')
  }

  return (
    <div className="page-container emergency-alerts-page">
      <div className="page-header-block">
        <div>
          <h2>EMERGENCY ALERTS</h2>
          <p className="page-subtitle">
            Broad warnings regarding high-risk geographic areas issued by Admin Command Center & Hydrology Dept.
          </p>
        </div>

        <button className="btn-admin-flow" onClick={() => setAdminModalOpen(true)}>
          <Plus size={16} /> Simulate Admin Alert Push
        </button>
      </div>

      {/* Alert vs Incident Concept Clarification Banner */}
      <div className="concept-notice-banner">
        <ShieldAlert size={20} className="notice-icon" />
        <div>
          <strong>System Distinction:</strong> <em>Incidents</em> represent specific victim emergency cases (e.g. trapped families), while <em>Alerts</em> represent broad geographic area hazard warnings issued to police units for monitoring & evacuation prep.
        </div>
      </div>

      {/* Tabs */}
      <div className="alerts-status-tabs">
        {['ALL', 'NEW', 'ACKNOWLEDGED', 'MONITORING', 'RESOLVED', 'EXPIRED'].map((tab) => (
          <button
            key={tab}
            className={`alert-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="alerts-grid">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts">No emergency alerts in "{activeTab}" status.</div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card risk-${alert.risk.toLowerCase()}`}>
              <div className="alert-card-header">
                <div className="title-group">
                  <AlertTriangle size={18} className="alert-risk-icon" />
                  <h3>{alert.title}</h3>
                </div>
                <span className={`risk-tag r-${alert.risk.toLowerCase()}`}>{alert.risk}</span>
              </div>

              <div className="alert-body">
                <div className="alert-field">
                  <span className="field-label">Area / Location:</span>
                  <span className="field-val highlight"><MapPin size={12} /> {alert.area}</span>
                </div>

                <div className="alert-field">
                  <span className="field-label">Risk Reason:</span>
                  <span className="field-val">{alert.reason}</span>
                </div>

                <div className="alert-field">
                  <span className="field-label">Forecast:</span>
                  <span className="field-val">{alert.forecast}</span>
                </div>

                <div className="alert-field-row">
                  <div className="alert-field">
                    <span className="field-label">Affected Population:</span>
                    <span className="field-val"><Users size={12} /> {alert.population.toLocaleString()} residents</span>
                  </div>
                  <div className="alert-field">
                    <span className="field-label">Issued By:</span>
                    <span className="field-val">{alert.createdBy} ({alert.createdAt})</span>
                  </div>
                </div>

                <div className="alert-status-line">
                  <span>Police Status:</span>
                  <span className={`status-pill st-${alert.status.toLowerCase()}`}>{alert.status}</span>
                </div>
              </div>

              <div className="alert-card-actions">
                <button
                  className="btn-alert-action btn-view-map"
                  onClick={() => handleViewOnMap(alert.area)}
                >
                  <MapPin size={14} /> VIEW ON MAP
                </button>

                {alert.status === 'NEW' ? (
                  <button
                    className="btn-alert-action btn-ack"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <CheckCircle size={14} /> ACKNOWLEDGE
                  </button>
                ) : (
                  <button className="btn-alert-action btn-ack-done" disabled>
                    ✓ ACKNOWLEDGED
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
