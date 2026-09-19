import { BarChart3, TrendingUp, Cpu } from 'lucide-react'

import '../styles/reports-page.css'

export default function Reports() {
  const dailyData = [
    { day: 'Mon', count: 120 },
    { day: 'Tue', count: 185 },
    { day: 'Wed', count: 240 },
    { day: 'Thu', count: 310 },
    { day: 'Fri', count: 280 },
    { day: 'Sat', count: 113 }
  ]

  const maxCount = 350

  return (
    <div className="page-container reports-page">
      <div className="page-header-block">
        <div>
          <h2>REPORTS & INTELLIGENCE</h2>
          <p className="page-subtitle">
            Historical incident analytics, response latency trends, and AI-driven pattern insights.
          </p>
        </div>
      </div>

      {/* Top Intelligence Stats */}
      <div className="reports-stats-grid">
        <div className="r-stat-card">
          <div className="r-lbl">TOTAL INCIDENTS (24H)</div>
          <div className="r-val">1,248</div>
          <span className="r-sub">Last updated 16:32</span>
        </div>
        <div className="r-stat-card green-card">
          <div className="r-lbl">RESOLVED CASES</div>
          <div className="r-val">984</div>
          <span className="r-sub">78.8% Resolution Rate</span>
        </div>
        <div className="r-stat-card red-card">
          <div className="r-lbl">CRITICAL EMERGENCIES</div>
          <div className="r-val">128</div>
          <span className="r-sub">10.2% High Priority</span>
        </div>
        <div className="r-stat-card blue-card">
          <div className="r-lbl">AVG RESPONSE TIME</div>
          <div className="r-val">14 min</div>
          <span className="r-sub">↓ 3 min faster than avg</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="reports-charts-grid">
        {/* Incidents by Day Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={18} className="chart-icon" />
            <h3>Incidents Volume by Day</h3>
          </div>
          <div className="bar-chart-container">
            {dailyData.map((item) => (
              <div key={item.day} className="bar-col">
                <div className="bar-tooltip">{item.count}</div>
                <div
                  className="bar-fill-element"
                  style={{ height: `${(item.count / maxCount) * 100}%` }}
                />
                <span className="bar-day-lbl">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents by Severity Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <TrendingUp size={18} className="chart-icon" />
            <h3>Incidents Severity Breakdown</h3>
          </div>
          <div className="severity-progress-list">
            <div className="sev-item">
              <div className="sev-hdr">
                <span>Critical</span>
                <span>128 (10.2%)</span>
              </div>
              <div className="prog-track"><div className="prog-bar bg-crit" style={{ width: '10.2%' }} /></div>
            </div>

            <div className="sev-item">
              <div className="sev-hdr">
                <span>High Priority</span>
                <span>312 (25.0%)</span>
              </div>
              <div className="prog-track"><div className="prog-bar bg-high" style={{ width: '25%' }} /></div>
            </div>

            <div className="sev-item">
              <div className="sev-hdr">
                <span>Medium Priority</span>
                <span>540 (43.2%)</span>
              </div>
              <div className="prog-track"><div className="prog-bar bg-med" style={{ width: '43.2%' }} /></div>
            </div>

            <div className="sev-item">
              <div className="sev-hdr">
                <span>Low Priority</span>
                <span>268 (21.6%)</span>
              </div>
              <div className="prog-track"><div className="prog-bar bg-low" style={{ width: '21.6%' }} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Generated AI Analysis Box */}
      <div className="ai-analysis-card">
        <div className="ai-analysis-header">
          <Cpu size={20} className="ai-cpu-icon" />
          <div>
            <h3>SYSTEM-GENERATED AI INCIDENT ANALYSIS</h3>
            <span className="ai-disclaimer">SYSTEM-GENERATED ANALYSIS — HUMAN REVIEW & VERIFICATION RECOMMENDED</span>
          </div>
        </div>

        <div className="ai-analysis-grid">
          <div className="analysis-box">
            <span className="a-lbl">Most Affected Sector:</span>
            <span className="a-val">Budhanilkantha & Balkhu River Corridor</span>
          </div>
          <div className="analysis-box">
            <span className="a-lbl">Most Frequent Emergency Type:</span>
            <span className="a-val">Submerged ground floors with trapped elderly/children</span>
          </div>
          <div className="analysis-box">
            <span className="a-lbl">Peak Emergency Call Volume:</span>
            <span className="a-val">15:00 – 18:00 (Heavy Rainfall Window)</span>
          </div>
          <div className="analysis-box">
            <span className="a-lbl">Primary Bottleneck:</span>
            <span className="a-val">Watercraft availability during peak flood wave</span>
          </div>
        </div>
      </div>
    </div>
  )
}
