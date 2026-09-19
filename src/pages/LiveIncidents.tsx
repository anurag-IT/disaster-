import { useState } from 'react'
import { Search, Eye, AlertOctagon, AlertTriangle, AlertCircle, CheckCircle, Filter } from 'lucide-react'
import { useCommandStore } from '../store/useCommandStore'
import { Incident } from '../data/mockData'
import '../styles/live-incidents-page.css'

export default function LiveIncidents() {
  const incidents = useCommandStore((state) => state.incidents)
  const setSelectedIncident = useCommandStore((state) => state.setSelectedIncident)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const globalSearch = useCommandStore((state) => state.globalSearch)

  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const query = search || globalSearch

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(query.toLowerCase()) ||
      inc.location.toLowerCase().includes(query.toLowerCase()) ||
      inc.title.toLowerCase().includes(query.toLowerCase())

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return <AlertOctagon size={14} />
      case 'HIGH': return <AlertTriangle size={14} />
      case 'MEDIUM': return <AlertCircle size={14} />
      default: return <CheckCircle size={14} />
    }
  }

  const handleViewIncident = (inc: Incident) => {
    setSelectedIncident(inc)
    setIncidentModalOpen(true)
  }

  return (
    <div className="page-container live-incidents-page">
      <div className="page-header-block">
        <div>
          <h2>LIVE INCIDENTS</h2>
          <p className="page-subtitle">Real-time emergency cases received from Flood ResQ AI.</p>
        </div>
        <div className="incidents-count-tag">
          Total Incidents: <strong>{filteredIncidents.length}</strong>
        </div>
      </div>

      {/* Top Filter Controls */}
      <div className="filter-controls-card">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search incident ID, location, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label"><Filter size={12} /> Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              className={`filter-tab ${severityFilter === sev ? 'active' : ''}`}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          {['ALL', 'PENDING', 'ASSIGNED', 'DISPATCHED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Incidents Table */}
      <div className="table-card">
        <div className="incidents-list-table">
          <div className="t-head">
            <div className="col-id">INCIDENT ID</div>
            <div className="col-sev">SEVERITY</div>
            <div className="col-title">TITLE</div>
            <div className="col-loc">LOCATION</div>
            <div className="col-people">PEOPLE</div>
            <div className="col-vuln">VULNERABLE</div>
            <div className="col-prio">PRIORITY</div>
            <div className="col-time">TIME</div>
            <div className="col-status">STATUS</div>
            <div className="col-action">ACTION</div>
          </div>

          <div className="t-body">
            {filteredIncidents.length === 0 ? (
              <div className="empty-state">No incidents match the active filters.</div>
            ) : (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`t-row row-sev-${inc.severity.toLowerCase()}`}
                  onClick={() => handleViewIncident(inc)}
                >
                  <div className="col-id">#{inc.id}</div>
                  <div className="col-sev">
                    <span className={`sev-badge badge-${inc.severity.toLowerCase()}`}>
                      {getSeverityIcon(inc.severity)}
                      {inc.severity}
                    </span>
                  </div>
                  <div className="col-title">{inc.title}</div>
                  <div className="col-loc">{inc.location}</div>
                  <div className="col-people">People: {inc.people}</div>
                  <div className="col-vuln">Elderly: {inc.elderly}</div>
                  <div className="col-prio">
                    <span className="prio-tag">{inc.priority}/100</span>
                  </div>
                  <div className="col-time">{inc.reportedAgo}</div>
                  <div className="col-status">
                    <span className={`status-badge st-${inc.status.toLowerCase().replace(/_/g, '-')}`}>
                      {inc.status}
                    </span>
                  </div>
                  <div className="col-action">
                    <button
                      className="btn-view"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewIncident(inc)
                      }}
                    >
                      <Eye size={13} /> VIEW
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
