import { useState } from 'react'
import { Phone, Activity, ArrowRight, ShieldCheck } from 'lucide-react'

import { useCommandStore } from '../store/useCommandStore'
import { VoiceCall } from '../data/mockData'
import '../styles/calls-page.css'

export default function Calls() {
  const calls = useCommandStore((state) => state.calls)
  const setSelectedIncident = useCommandStore((state) => state.setSelectedIncident)
  const setIncidentModalOpen = useCommandStore((state) => state.setIncidentModalOpen)
  const createIncidentFromCall = useCommandStore((state) => state.createIncidentFromCall)
  const incidents = useCommandStore((state) => state.incidents)

  const [activeCall, setActiveCall] = useState<VoiceCall>(calls[0])

  const handleCreateOrViewIncident = (call: VoiceCall) => {
    const existingInc = incidents.find((i) => i.callId === call.id)
    if (existingInc) {
      setSelectedIncident(existingInc)
      setIncidentModalOpen(true)
    } else {
      const newInc = createIncidentFromCall(call.id)
      setSelectedIncident(newInc)
      setIncidentModalOpen(true)
    }
  }

  return (
    <div className="page-container calls-page">
      <div className="page-header-block">
        <div>
          <h2>EMERGENCY CALLS</h2>
          <p className="page-subtitle">
            Incoming emergency voice calls transcribed and analyzed in real-time by Flood ResQ AI Voice Engine.
          </p>
        </div>
      </div>

      <div className="calls-layout-grid">
        {/* Left List of Incoming Calls */}
        <div className="calls-list-card">
          <div className="card-title">INCOMING AI VOICE CALLS</div>
          <div className="calls-list">
            {calls.map((call) => {
              const isActive = activeCall.id === call.id
              const hasIncident = incidents.some((i) => i.callId === call.id)
              return (
                <div
                  key={call.id}
                  className={`call-item-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCall(call)}
                >
                  <div className="call-item-header">
                    <span className="call-id-tag"><Phone size={12} /> {call.id}</span>
                    <span className="call-time-tag">{call.time}</span>
                  </div>

                  <div className="call-location">{call.location}</div>

                  <div className="call-meta-row">
                    <span>Duration: <strong>{call.duration}</strong></span>
                    <span className="ai-status-tag">{call.aiStatus}</span>
                  </div>

                  <div className="call-prio-row">
                    <span className="prio-label">Priority:</span>
                    <span className="prio-score-val">{call.priority}/100</span>
                    {hasIncident ? (
                      <span className="inc-linked-tag">✓ Incident #{call.incidentId}</span>
                    ) : (
                      <span className="inc-unlinked-tag">Unlinked</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Call Detail & AI Extraction Panel */}
        <div className="call-detail-view-card">
          {activeCall ? (
            <div className="call-detail-content">
              <div className="detail-top-bar">
                <div>
                  <span className="call-badge">VOICE CALL {activeCall.id}</span>
                  <h2>{activeCall.location} Emergency Call</h2>
                </div>
                <div className="call-prio-badge">
                  Priority Score: <strong>{activeCall.priority}/100</strong>
                </div>
              </div>

              {/* AI Connection Pipeline Indicator */}
              <div className="pipeline-flow-box">
                <span className="step">VOICE CALL ({activeCall.id})</span>
                <ArrowRight size={14} />
                <span className="step">AI VOICE ENGINE</span>
                <ArrowRight size={14} />
                <span className="step">STRUCTURED DATA</span>
                <ArrowRight size={14} />
                <button
                  className="step-btn"
                  onClick={() => handleCreateOrViewIncident(activeCall)}
                >
                  {incidents.some((i) => i.callId === activeCall.id) ? 'VIEW INCIDENT' : 'CREATE INCIDENT'}
                </button>
              </div>

              {/* Professional Call Transcript Box */}
              <div className="transcript-section">
                <div className="section-label">
                  <Phone size={15} /> PROFESSIONAL AUDIO CALL TRANSCRIPT
                </div>
                <div className="transcript-audio-player">
                  <pre>{activeCall.transcript}</pre>
                </div>
              </div>

              {/* AI Extraction Data Grid */}
              <div className="ai-extraction-section">
                <div className="section-label">
                  <Activity size={15} /> STRUCTURED AI EXTRACTION
                </div>
                <div className="extraction-grid">
                  <div className="ext-item">
                    <span className="lbl">People Affected:</span>
                    <span className="val">{activeCall.extractedInfo.people}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Elderly:</span>
                    <span className="val">{activeCall.extractedInfo.elderly}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Children:</span>
                    <span className="val">{activeCall.extractedInfo.children}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Trapped Status:</span>
                    <span className={`val ${activeCall.extractedInfo.trapped ? 'crit' : ''}`}>
                      {activeCall.extractedInfo.trapped ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Injuries:</span>
                    <span className="val">{activeCall.extractedInfo.injuries}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Food Supply:</span>
                    <span className="val">{activeCall.extractedInfo.food}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Water Supply:</span>
                    <span className="val crit">{activeCall.extractedInfo.water}</span>
                  </div>
                  <div className="ext-item">
                    <span className="lbl">Location Status:</span>
                    <span className="val">Detected ({activeCall.location})</span>
                  </div>
                </div>
              </div>

              {/* AI Summary & AI Recommendation Box */}
              <div className="ai-summary-recommendation-box">
                <div className="ai-sum-col">
                  <span className="tag-label">AI-GENERATED SUMMARY</span>
                  <p>{activeCall.aiSummary}</p>
                </div>

                <div className="ai-rec-col">
                  <span className="tag-label rec-tag">AI RECOMMENDATION</span>
                  <p>{activeCall.aiRecommendation}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="call-action-footer">
                <button
                  className="btn-create-view-incident"
                  onClick={() => handleCreateOrViewIncident(activeCall)}
                >
                  <ShieldCheck size={16} />
                  {incidents.some((i) => i.callId === activeCall.id)
                    ? `VIEW LINKED INCIDENT #${activeCall.incidentId}`
                    : `CREATE INCIDENT FROM CALL ${activeCall.id}`}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-call-selection">Select an emergency call to view transcript & AI extractions.</div>
          )}
        </div>
      </div>
    </div>
  )
}
