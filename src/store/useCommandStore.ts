import { create } from 'zustand'
import {
  Incident,
  RiskZone,
  EmergencyAlert,
  VoiceCall,
  PoliceUnit,
  TeamResource,
  INITIAL_INCIDENTS,
  INITIAL_RISK_ZONES,
  INITIAL_ALERTS,
  INITIAL_CALLS,
  INITIAL_POLICE_UNITS,
  INITIAL_RESOURCES
} from '../data/mockData'

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'incident' | 'alert' | 'unit' | 'call'
  incidentId?: string
}

interface CommandState {
  incidents: Incident[]
  selectedIncident: Incident
  riskZones: RiskZone[]
  selectedRiskZone: RiskZone | null
  alerts: EmergencyAlert[]
  calls: VoiceCall[]
  units: PoliceUnit[]
  resources: TeamResource[]
  notifications: NotificationItem[]
  globalSearch: string
  isAdminModalOpen: boolean
  isIncidentModalOpen: boolean

  // Actions
  setSelectedIncident: (incident: Incident) => void
  setSelectedRiskZone: (zone: RiskZone | null) => void
  setIncidentModalOpen: (open: boolean) => void
  setAdminModalOpen: (open: boolean) => void
  setGlobalSearch: (query: string) => void

  assignUnitToIncident: (incidentId: string, unitId: string) => void
  updateIncidentStatus: (incidentId: string, newStatus: Incident['status']) => void
  acknowledgeAlert: (alertId: string) => void
  acknowledgeRiskZone: (zoneId: string) => void
  createIncidentFromCall: (callId: string) => Incident
  createAdminRiskZoneAndAlert: (payload: {
    name: string
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    population: number
    reason: string
    forecast: string
    coordinates: [number, number]
  }) => void
  toggleUnitStatus: (unitId: string, status: PoliceUnit['status']) => void
}

export const useCommandStore = create<CommandState>((set, get) => ({
  incidents: INITIAL_INCIDENTS,
  selectedIncident: INITIAL_INCIDENTS[0],
  riskZones: INITIAL_RISK_ZONES,
  selectedRiskZone: null,
  alerts: INITIAL_ALERTS,
  calls: INITIAL_CALLS,
  units: INITIAL_POLICE_UNITS,
  resources: INITIAL_RESOURCES,
  globalSearch: '',
  isAdminModalOpen: false,
  isIncidentModalOpen: false,
  notifications: [
    {
      id: 'N-1',
      title: '🚨 New Critical Incident',
      message: '#FLOOD-0287 in Budhanilkantha (Priority: 92/100)',
      time: '2 min ago',
      type: 'incident',
      incidentId: 'FLOOD-0287'
    },
    {
      id: 'N-2',
      title: '⚠️ New Risk Zone Alert',
      message: 'Balkhu Riverside Critical Risk Zone declared by Admin',
      time: '16:25',
      type: 'alert'
    }
  ],

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

  setSelectedRiskZone: (zone) => set({ selectedRiskZone: zone }),

  setIncidentModalOpen: (open) => set({ isIncidentModalOpen: open }),

  setAdminModalOpen: (open) => set({ isAdminModalOpen: open }),

  setGlobalSearch: (query) => set({ globalSearch: query }),

  assignUnitToIncident: (incidentId, unitId) => {
    const state = get()
    const targetUnit = state.units.find((u) => u.id === unitId)
    if (!targetUnit) return

    const updatedIncidents = state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        const newTimeline = [
          ...inc.timeline,
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: `Assigned to ${targetUnit.name}` }
        ]
        return {
          ...inc,
          assignedUnit: targetUnit.name,
          status: 'ASSIGNED' as const,
          timeline: newTimeline
        }
      }
      return inc
    })

    const updatedUnits = state.units.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'DEPLOYED' as const,
          currentAssignment: `${incidentId}`
        }
      }
      return u
    })

    const selectedInc = updatedIncidents.find((i) => i.id === incidentId) || state.selectedIncident

    set({
      incidents: updatedIncidents,
      units: updatedUnits,
      selectedIncident: selectedInc,
      notifications: [
        {
          id: `N-${Date.now()}`,
          title: '🛡️ Police Unit Assigned',
          message: `${targetUnit.name} assigned to ${incidentId}`,
          time: 'Just now',
          type: 'unit',
          incidentId
        },
        ...state.notifications
      ]
    })
  },

  updateIncidentStatus: (incidentId, newStatus) => {
    const state = get()
    const updatedIncidents = state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        const newTimeline = [
          ...inc.timeline,
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: `Status updated to ${newStatus}` }
        ]
        return { ...inc, status: newStatus, timeline: newTimeline }
      }
      return inc
    })

    const selectedInc = updatedIncidents.find((i) => i.id === incidentId) || state.selectedIncident
    set({ incidents: updatedIncidents, selectedIncident: selectedInc })
  },

  acknowledgeAlert: (alertId) => {
    const state = get()
    const updatedAlerts = state.alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, status: 'ACKNOWLEDGED' as const }
      }
      return a
    })

    set({ alerts: updatedAlerts })
  },

  acknowledgeRiskZone: (zoneId) => {
    const state = get()
    const updatedZones = state.riskZones.map((z) => {
      if (z.id === zoneId) {
        return { ...z, policeStatus: 'ACKNOWLEDGED' as const }
      }
      return z
    })
    set({ riskZones: updatedZones })
  },

  createIncidentFromCall: (callId) => {
    const state = get()
    const call = state.calls.find((c) => c.id === callId)
    if (!call) return state.selectedIncident

    const existingInc = state.incidents.find((i) => i.callId === callId)
    if (existingInc) return existingInc

    const newIncId = `FLOOD-0${Math.floor(100 + Math.random() * 900)}`
    const newIncident: Incident = {
      id: newIncId,
      title: `Emergency Call Response — ${call.location}`,
      severity: call.priority > 85 ? 'CRITICAL' : 'HIGH',
      location: call.location,
      coordinates: call.coordinates,
      people: call.extractedInfo.people,
      children: call.extractedInfo.children,
      elderly: call.extractedInfo.elderly,
      injuries: call.extractedInfo.injuries,
      trapped: call.extractedInfo.trapped ? 'YES' : 'NO',
      food: call.extractedInfo.food,
      water: call.extractedInfo.water,
      priority: call.priority,
      status: 'PENDING',
      createdAt: call.time,
      reportedAgo: 'Just now',
      callId,
      aiSummary: call.aiSummary,
      aiRecommendation: call.aiRecommendation,
      transcript: call.transcript,
      timeline: [
        { time: call.time, event: `AI Call Received (${callId})` },
        { time: call.time, event: 'AI Extraction Completed' },
        { time: 'Just now', event: `Incident ${newIncId} Created by Police Operator` }
      ]
    }

    set({
      incidents: [newIncident, ...state.incidents],
      selectedIncident: newIncident,
      isIncidentModalOpen: true
    })

    return newIncident
  },

  createAdminRiskZoneAndAlert: ({ name, riskLevel, population, reason, forecast, coordinates }) => {
    const state = get()
    const newId = `RZ-0${state.riskZones.length + 1}`

    // Calculate approximate bounding polygon around coordinate
    const lat = coordinates[0]
    const lng = coordinates[1]
    const polygon: [number, number][] = [
      [lat + 0.008, lng - 0.008],
      [lat + 0.012, lng + 0.008],
      [lat - 0.005, lng + 0.012],
      [lat - 0.008, lng - 0.005]
    ]

    const newZone: RiskZone = {
      id: newId,
      name,
      riskLevel,
      polygon,
      population,
      forecast,
      reason,
      createdBy: 'Admin Command Center',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      policeStatus: 'NEW',
      status: 'ACTIVE'
    }

    const newAlertId = `ALERT-0${state.alerts.length + 1}`
    const newAlert: EmergencyAlert = {
      id: newAlertId,
      title: `${riskLevel} FLOOD ALERT`,
      area: name,
      risk: riskLevel,
      reason,
      forecast,
      population,
      createdBy: 'Admin Command Center',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'NEW'
    }

    set({
      riskZones: [newZone, ...state.riskZones],
      alerts: [newAlert, ...state.alerts],
      isAdminModalOpen: false,
      notifications: [
        {
          id: `N-${Date.now()}`,
          title: `🚨 ${riskLevel} Risk Zone Created`,
          message: `Admin created Risk Zone: ${name} (${population.toLocaleString()} affected)`,
          time: 'Just now',
          type: 'alert'
        },
        ...state.notifications
      ]
    })
  },

  toggleUnitStatus: (unitId, status) => {
    const state = get()
    const updatedUnits = state.units.map((u) => {
      if (u.id === unitId) {
        return { ...u, status }
      }
      return u
    })
    set({ units: updatedUnits })
  }
}))
