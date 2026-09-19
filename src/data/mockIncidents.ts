import { Incident, INITIAL_INCIDENTS, INITIAL_POLICE_UNITS } from './mockData'

export type { Incident }

export const MOCK_INCIDENTS = INITIAL_INCIDENTS.map((inc) => ({
  ...inc,
  score: inc.priority,
  reported: inc.reportedAgo,
  coordinatesText: `${inc.coordinates[0]}° N, ${inc.coordinates[1]}° E`,
  keyInfo: {
    people: inc.people,
    elderly: String(inc.elderly),
    children: inc.children,
    injuries: inc.injuries,
    food: inc.food,
    drinkingWater: inc.water,
    otherNeeds: inc.otherNeeds
  },
  priority: inc.severity,
  unit: inc.assignedUnit
    ? {
        name: inc.assignedUnit,
        officers: 6,
        distance: '2.4 km',
        status: 'AVAILABLE'
      }
    : undefined
}))

export const MOCK_UNITS = INITIAL_POLICE_UNITS.map((u) => ({
  id: u.id,
  name: u.name,
  type: u.type.toLowerCase().includes('rescue') ? ('rescue' as const) : ('police' as const),
  coordinates: u.coordinates,
  status: u.status
}))
