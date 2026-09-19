import { useState } from 'react'
import { X, MapPin, Users, Phone, Shield, Clock, AlertTriangle, ExternalLink, CheckCircle2, Navigation } from 'lucide-react'
import { useCommandStore } from '../store/useCommandStore'
import '../styles/incident-modal.css'

export default function IncidentDetailModal() {
  const isIncidentModalOpen = useCommandStore((state) => state.isIncidentModalOpen)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const selectedIncident = useCommandStore((state) => state.selectedIncident)
  const units = useCommandStore((state) => state.units)
  const assignUnitToIncident = useCommandStore((state) => state.assignUnitToIncident)
  const updateIncidentStatus = useCommandStore((state) => state.updateIncidentStatus)

  const [selectedUnitId, setSelectedUnitId] = useState('UNIT-04')

  if (!isIncidentModalOpen || !selectedIncident) return null

  const handleAssign = () => {
    assignUnitToIncident(selectedIncident.id, selectedUnitId)
  }

  return (
    <div className="incident-modal-overlay">
      <div className="incident-modal-panel">
        <div className="panel-header-top">
          <div className="header-meta">
            <span className="inc-id-badge">#{selectedIncident.id}</span>
            <span className={`inc-severity-tag tag-${selectedIncident.severity.toLowerCase()}`}>
              {selectedIncident.severity}
            </span>
            <span className="priority-score-tag">Priority Score: {selectedIncident.priority}/100</span>
          </div>
          <button className="panel-close-btn" onClick={() => setIncidentModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="panel-scroll-content">
          {/* Main Title & Location */}
          <div className="incident-title-block">
            <h2>{selectedIncident.title}</h2>
            <div className="location-info-row">
              <MapPin size={16} className="loc-pin" />
              <span>{selectedIncident.location}</span>
              <a
                href={`https://www.google.com/maps?q=${selectedIncident.coordinates[0]},${selectedIncident.coordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-map-link"
              >
                <ExternalLink size={12} /> Open Map
              </a>
            </div>
          </div>

          {/* AI Call Origin Banner */}
          <div className="ai-source-banner">
            <Phone size={16} />
            <span>SOURCE: <strong>Flood ResQ AI Voice Call ({selectedIncident.callId})</strong></span>
            <span className="ai-verified-tag">AI ANALYZED</span>
          </div>

          {/* AI Summary & Recommendation Section (Human in the Loop) */}
          <div className="section-block ai-summary-card">
            <div className="block-title">
              <AlertTriangle size={16} className="title-icon" />
              <span>AI INCIDENT ANALYSIS</span>
              <span className="human-review-badge">HUMAN REVIEW REQUIRED</span>
            </div>

            <div className="ai-box">
              <div className="ai-sub-label">AI-GENERATED SUMMARY</div>
              <p className="summary-text">{selectedIncident.aiSummary}</p>
            </div>

            <div className="ai-box recommendation-box">
              <div className="ai-sub-label">AI RECOMMENDATION</div>
              <p className="recommendation-text">{selectedIncident.aiRecommendation}</p>
            </div>
          </div>

          {/* Key Information Extraction Grid */}
          <div className="section-block">
            <div className="block-title">
              <Users size={16} className="title-icon" />
              <span>STRUCTURED INCIDENT DATA</span>
            </div>

            <div className="info-grid-2">
              <div className="grid-item">
                <span className="g-label">Total People Affected:</span>
                <span className="g-val">{selectedIncident.people}</span>
              </div>
              <div className="grid-item">
                <span className="g-label">Elderly (Vulnerable):</span>
                <span className="g-val">{selectedIncident.elderly}</span>
              </div>
              <div className="grid-item">
                <span className="g-label">Children:</span>
                <span className="g-val">{selectedIncident.children}</span>
              </div>
              <div className="grid-item">
                <span className="g-label">Trapped Status:</span>
                <span className={`g-val ${selectedIncident.trapped === 'YES' ? 'critical-val' : ''}`}>
                  {selectedIncident.trapped}
                </span>
              </div>
              <div className="grid-item">
                <span className="g-label">Injuries:</span>
                <span className="g-val">{selectedIncident.injuries}</span>
              </div>
              <div className="grid-item">
                <span className="g-label">Food Supply:</span>
                <span className="g-val">{selectedIncident.food}</span>
              </div>
              <div className="grid-item">
                <span className="g-label">Drinking Water:</span>
                <span className={`g-val ${selectedIncident.water.toLowerCase() === 'critical' ? 'critical-val' : ''}`}>
                  {selectedIncident.water}
                </span>
              </div>
              {selectedIncident.otherNeeds && (
                <div className="grid-item full-span">
                  <span className="g-label">Other Immediate Needs:</span>
                  <span className="g-val">{selectedIncident.otherNeeds}</span>
                </div>
              )}
            </div>
          </div>

          {/* Call Transcript Section */}
          <div className="section-block">
            <div className="block-title">
              <Phone size={16} className="title-icon" />
              <span>EMERGENCY VOICE CALL TRANSCRIPT</span>
            </div>
            <div className="transcript-box">
              <pre>{selectedIncident.transcript}</pre>
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="section-block">
            <div className="block-title">
              <Clock size={16} className="title-icon" />
              <span>AI TO POLICE RESPONSE TIMELINE</span>
            </div>
            <div className="timeline-list">
              {selectedIncident.timeline.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <span className="t-time">{item.time}</span>
                  <div className="t-dot" />
                  <span className="t-event">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Police Response & Dispatch Controls */}
          <div className="section-block dispatch-control-block">
            <div className="block-title">
              <Shield size={16} className="title-icon" />
              <span>POLICE UNIT ASSIGNMENT & DISPATCH</span>
            </div>

            <div className="current-status-row">
              <span>Current Status:</span>
              <span className={`status-pill status-${selectedIncident.status.toLowerCase().replace(/_/g, '-')}`}>
                {selectedIncident.status}
              </span>
              {selectedIncident.assignedUnit && (
                <span className="assigned-unit-text">Assigned: <strong>{selectedIncident.assignedUnit}</strong></span>
              )}
            </div>

            <div className="assign-controls-row">
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="unit-select"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.type} - {u.status})
                  </option>
                ))}
              </select>
              <button onClick={handleAssign} className="btn-assign-unit">
                ASSIGN UNIT
              </button>
            </div>

            <div className="status-step-buttons">
              <button
                onClick={() => updateIncidentStatus(selectedIncident.id, 'DISPATCHED')}
                className="btn-status-step btn-dispatch-step"
              >
                <Navigation size={14} /> DISPATCH UNIT
              </button>
              <button
                onClick={() => updateIncidentStatus(selectedIncident.id, 'ON_SCENE')}
                className="btn-status-step btn-scene-step"
              >
                MARK ON SCENE
              </button>
              <button
                onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED')}
                className="btn-status-step btn-resolve-step"
              >
                <CheckCircle2 size={14} /> RESOLVE INCIDENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
