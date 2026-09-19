import { useState } from 'react'
import { Users, LifeBuoy, Radio, HeartPulse, Home } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import '../styles/teams-resources-page.css'

export default function TeamsResources() {
  const resources = useCommandStore((state) => state.resources)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'team' | 'resource'>('all')

  const filteredResources = resources.filter((r) => {
    if (categoryFilter === 'all') return true
    return r.category === categoryFilter
  })

  const getCategoryIcon = (name: string) => {
    if (name.includes('Boat')) return <LifeBuoy size={20} className="res-icon boat" />
    if (name.includes('Radio')) return <Radio size={20} className="res-icon radio" />
    if (name.includes('Medical')) return <HeartPulse size={20} className="res-icon medical" />
    if (name.includes('Shelter')) return <Home size={20} className="res-icon shelter" />
    return <Users size={20} className="res-icon team" />
  }

  return (
    <div className="page-container teams-resources-page">
      <div className="page-header-block">
        <div>
          <h2>TEAMS & RESOURCES</h2>
          <p className="page-subtitle">
            Inventory of disaster response teams, rescue watercraft, communications, and emergency equipment.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`cat-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            ALL RESOURCES ({resources.length})
          </button>
          <button
            className={`cat-btn ${categoryFilter === 'team' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('team')}
          >
            OPERATIONAL TEAMS
          </button>
          <button
            className={`cat-btn ${categoryFilter === 'resource' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('resource')}
          >
            EQUIPMENT & BOATS
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="resources-grid">
        {filteredResources.map((item) => (
          <div key={item.id} className="resource-card">
            <div className="res-card-header">
              <div className="res-title-group">
                {getCategoryIcon(item.name)}
                <div>
                  <span className="res-id">#{item.id} • {item.type}</span>
                  <h3>{item.name}</h3>
                </div>
              </div>
              <span className={`res-status-tag st-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {item.status}
              </span>
            </div>

            <div className="res-card-body">
              <div className="count-metrics-grid">
                <div className="metric-box">
                  <span className="m-lbl">Available</span>
                  <span className="m-val avail-val">{item.available}</span>
                </div>
                <div className="metric-box">
                  <span className="m-lbl">Deployed</span>
                  <span className="m-val dep-val">{item.deployed}</span>
                </div>
                <div className="metric-box">
                  <span className="m-lbl">Maintenance</span>
                  <span className="m-val maint-val">{item.maintenance}</span>
                </div>
                <div className="metric-box">
                  <span className="m-lbl">Total Units</span>
                  <span className="m-val">{item.total}</span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="allocation-progress-bar">
                <div
                  className="bar-fill deployed-fill"
                  style={{ width: `${(item.deployed / item.total) * 100}%` }}
                  title="Deployed"
                />
                <div
                  className="bar-fill available-fill"
                  style={{ width: `${(item.available / item.total) * 100}%` }}
                  title="Available"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
