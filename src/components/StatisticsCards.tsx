import { AlertOctagon, AlertTriangle, AlertCircle, Shield, LifeBuoy, CloudRain } from 'lucide-react'
import '../styles/statistics-cards.css'

export default function StatisticsCards() {
  const stats = [
    { label: 'Critical', sublabel: 'Incidents', value: 8, icon: AlertOctagon, color: 'critical', trend: '↑ 3' },
    { label: 'High', sublabel: 'Incidents', value: 15, icon: AlertTriangle, color: 'high', trend: '↑ 2' },
    { label: 'Medium', sublabel: 'Incidents', value: 24, icon: AlertCircle, color: 'medium', trend: '↑ 1' },
    { label: 'Police Units', sublabel: '', value: 18, icon: Shield, color: 'units', trend: '↑ 2' },
    { label: 'Rescue Teams', sublabel: '', value: 7, icon: LifeBuoy, color: 'rescue', trend: '→ 0' },
  ]

  return (
    <div className="top-stats-container">
      <div className="statistics-cards">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className={`stat-card stat-${stat.color}`}>
              <div className={`stat-icon-wrapper icon-${stat.color}`}>
                <Icon size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-label-row">
                  <span className="stat-label">{stat.label}</span>
                  {stat.sublabel && <span className="stat-sublabel">{stat.sublabel}</span>}
                </div>
                <div className="stat-value-row">
                  <span className="stat-value">{stat.value}</span>
                  <span className={`stat-trend trend-${stat.color}`}>{stat.trend}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="weather-forecast-card">
        <div className="weather-header">
          <span className="weather-title">Weather & Flood Forecast</span>
          <span className="weather-timestamp">Last updated: 16:32</span>
        </div>
        <div className="weather-body">
          <div className="weather-main">
            <CloudRain size={36} className="weather-icon" />
            <div className="weather-temp-group">
              <span className="weather-temp">24°C</span>
              <span className="weather-desc">Heavy Rain</span>
            </div>
          </div>
          <div className="weather-metrics">
            <div className="weather-metric-item">
              <span className="metric-label">Rain Probability</span>
              <span className="metric-value">92%</span>
            </div>
            <div className="weather-metric-item">
              <span className="metric-label">Expected Rainfall</span>
              <span className="metric-value">80–120 mm</span>
            </div>
            <div className="weather-metric-item">
              <span className="metric-label">River Level</span>
              <span className="metric-value critical-text">RISING ↑</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
