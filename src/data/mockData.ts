export interface Incident {
  id: string
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  location: string
  coordinates: [number, number]
  people: number
  children: number
  elderly: number | string
  injuries: string
  trapped: 'YES' | 'NO'
  food: string
  water: string
  otherNeeds?: string
  priority: number // e.g. 92/100
  status: 'PENDING' | 'ASSIGNED' | 'DISPATCHED' | 'ON_SCENE' | 'RESOLVED'
  createdAt: string
  reportedAgo: string
  callId: string
  assignedUnit?: string
  aiSummary: string
  aiRecommendation: string
  transcript: string
  timeline: Array<{ time: string; event: string }>
}

export interface RiskZone {
  id: string
  name: string
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  polygon: [number, number][]
  population: number
  forecast: string
  reason: string
  createdBy: string
  createdAt: string
  policeStatus: 'NEW' | 'ACKNOWLEDGED' | 'MONITORING' | 'RESOLVED'
  status: 'ACTIVE' | 'RESOLVED'
}

export interface EmergencyAlert {
  id: string
  title: string
  area: string
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  reason: string
  forecast: string
  population: number
  createdBy: string
  createdAt: string
  status: 'NEW' | 'ACKNOWLEDGED' | 'MONITORING' | 'RESOLVED' | 'EXPIRED'
}

export interface VoiceCall {
  id: string
  time: string
  location: string
  coordinates: [number, number]
  duration: string
  aiStatus: 'ANALYZED' | 'PROCESSING' | 'PENDING'
  priority: number
  incidentId: string
  callerName?: string
  phone?: string
  extractedInfo: {
    people: number
    elderly: number
    children: number
    trapped: boolean
    injuries: string
    food: string
    water: string
  }
  transcript: string
  aiSummary: string
  aiRecommendation: string
}

export interface PoliceUnit {
  id: string
  name: string
  type: string
  officers: number
  vehicles: number
  location: string
  coordinates: [number, number]
  status: 'AVAILABLE' | 'DEPLOYED' | 'OFFLINE' | 'MAINTENANCE'
  currentAssignment?: string
  contact: string
  lastUpdate: string
}

export interface TeamResource {
  id: string
  name: string
  category: 'team' | 'resource'
  type: string
  available: number
  deployed: number
  maintenance: number
  total: number
  status: 'AVAILABLE' | 'DEPLOYED' | 'MAINTENANCE' | 'LOW STOCK' | 'UNAVAILABLE'
}

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'FLOOD-0287',
    title: 'Trapped Family — No Drinking Water',
    severity: 'CRITICAL',
    location: 'Budhanilkantha, Kathmandu',
    coordinates: [27.7504, 85.3728],
    people: 4,
    children: 0,
    elderly: '1 (cannot walk)',
    injuries: 'None reported',
    trapped: 'YES',
    food: 'Low',
    water: 'Critical',
    otherNeeds: 'Rescue, clean water, medical check',
    priority: 92,
    status: 'PENDING',
    createdAt: '16:40',
    reportedAgo: '2 min ago',
    callId: 'CALL-0287',
    aiSummary: '4 people are trapped in a flooded home. One elderly person is unable to walk and drinking water is critically low.',
    aiRecommendation: 'Immediate rescue assessment recommended. High risk of dehydration and hypothermia.',
    transcript: '"We are trapped inside our house in Budhanilkantha. There are four of us here. My grandmother cannot walk at all and flood waters are entering the first floor. We are running out of drinking water. Please send help!"',
    timeline: [
      { time: '16:40', event: 'Victim voice call received (CALL-0287)' },
      { time: '16:40', event: 'Speech converted to text via Flood ResQ AI Voice Engine' },
      { time: '16:41', event: 'AI extracted emergency entity information & vulnerability metrics' },
      { time: '16:41', event: 'Priority score calculated: 92/100 (CRITICAL)' },
      { time: '16:42', event: 'Structured incident #FLOOD-0287 created in RAKSHA' },
      { time: '16:43', event: 'Police command operator notified' }
    ]
  },
  {
    id: 'FLOOD-0248',
    title: 'Submerged Home — 5 People Trapped',
    severity: 'CRITICAL',
    location: 'Imadol, Lalitpur',
    coordinates: [27.6563, 85.3420],
    people: 5,
    children: 1,
    elderly: 1,
    injuries: 'Unknown',
    trapped: 'YES',
    food: 'Low',
    water: 'Low',
    otherNeeds: 'Immediate evacuation boat',
    priority: 95,
    status: 'ASSIGNED',
    createdAt: '16:30',
    reportedAgo: '12 min ago',
    callId: 'CALL-0248',
    assignedUnit: 'UNIT-02',
    aiSummary: 'Five people surrounded by rising flood water. 1 child and 1 elderly person with limited mobility present.',
    aiRecommendation: 'Deploy inflatable rescue raft and medical team immediately.',
    transcript: '"Water is up to our waists in Imadol Ward 3. Five of us are trapped on top of the dining table, including a child and my sick father. Water is rising fast!"',
    timeline: [
      { time: '16:30', event: 'Victim voice call received (CALL-0248)' },
      { time: '16:31', event: 'AI analysis completed, priority 95/100' },
      { time: '16:32', event: 'Incident #FLOOD-0248 created' },
      { time: '16:35', event: 'Assigned to Patrol Unit 02' }
    ]
  },
  {
    id: 'FLOOD-0247',
    title: 'Landslide Blockade & Flash Flood',
    severity: 'HIGH',
    location: 'Ward 1, Bhaktapur',
    coordinates: [27.6710, 85.4293],
    people: 3,
    children: 1,
    elderly: 0,
    injuries: '1 Minor',
    trapped: 'NO',
    food: 'Moderate',
    water: 'Low',
    otherNeeds: 'Debris clearing & road clearance',
    priority: 78,
    status: 'DISPATCHED',
    createdAt: '16:15',
    reportedAgo: '27 min ago',
    callId: 'CALL-0247',
    assignedUnit: 'UNIT-07',
    aiSummary: 'Mudslide blocked main arterial road. River water creeping into 3 adjacent houses. 1 minor arm injury reported.',
    aiRecommendation: 'Dispatch traffic control and road clearance heavy equipment.',
    transcript: '"A mudslide just came down the hill behind Ward 1 Bhaktapur. The road is completely blocked and river water is entering our porch. My son cut his arm on debris."',
    timeline: [
      { time: '16:15', event: 'Call received & analyzed' },
      { time: '16:17', event: 'Priority score 78/100 assigned' },
      { time: '16:20', event: 'UNIT-07 dispatched to location' }
    ]
  },
  {
    id: 'FLOOD-0246',
    title: 'Rooftop Trapped Residents',
    severity: 'MEDIUM',
    location: 'Tokha, Kathmandu',
    coordinates: [27.7600, 85.3200],
    people: 4,
    children: 2,
    elderly: 0,
    injuries: 'None',
    trapped: 'YES',
    food: 'Sufficient',
    water: 'Sufficient',
    otherNeeds: 'Boat evacuation',
    priority: 65,
    status: 'ASSIGNED',
    createdAt: '16:00',
    reportedAgo: '42 min ago',
    callId: 'CALL-0246',
    assignedUnit: 'UNIT-01',
    aiSummary: 'Lower floor flooded with 3 feet of water. 4 family members safe on rooftop. Supplies are stable.',
    aiRecommendation: 'Schedule boat evacuation when rapid response units clear higher priority cases.',
    transcript: '"We moved up to the roof in Tokha. The ground floor is completely underwater, but we have warm clothes and some food. Please send a boat when possible."',
    timeline: [
      { time: '16:00', event: 'Call received' },
      { time: '16:05', event: 'Assigned to Rescue Team 01' }
    ]
  },
  {
    id: 'FLOOD-0245',
    title: 'Bridge Approach Overflow',
    severity: 'HIGH',
    location: 'Kirtipur Bridge, Kathmandu',
    coordinates: [27.6795, 85.2800],
    people: 2,
    children: 0,
    elderly: 0,
    injuries: 'None',
    trapped: 'NO',
    food: 'N/A',
    water: 'N/A',
    otherNeeds: 'Traffic diversion & tow support',
    priority: 75,
    status: 'PENDING',
    createdAt: '15:45',
    reportedAgo: '57 min ago',
    callId: 'CALL-0245',
    aiSummary: 'Kirtipur river bridge approach submerged. 2 vehicles stranded on high embankment.',
    aiRecommendation: 'Dispatch traffic police to block bridge access and coordinate tow truck.',
    transcript: '"The river has crossed the bridge level near Kirtipur entrance. Cars cannot pass and two vehicles are stuck on the bank slope."',
    timeline: [
      { time: '15:45', event: 'Call received & logged' },
      { time: '15:48', event: 'Priority calculated: 75/100' }
    ]
  }
]

export const INITIAL_RISK_ZONES: RiskZone[] = [
  {
    id: 'RZ-01',
    name: 'Balkhu Riverside',
    riskLevel: 'CRITICAL',
    polygon: [
      [27.6850, 85.2950],
      [27.6920, 85.3050],
      [27.6880, 85.3120],
      [27.6800, 85.3020]
    ],
    population: 2400,
    forecast: 'Heavy rainfall expected for next 6 hours (80-120mm)',
    reason: 'Balkhu river level rising rapidly above danger threshold (+1.8m)',
    createdBy: 'Admin Command Center',
    createdAt: '16:25',
    policeStatus: 'ACKNOWLEDGED',
    status: 'ACTIVE'
  },
  {
    id: 'RZ-02',
    name: 'Sundarijal Upper River Basin',
    riskLevel: 'HIGH',
    polygon: [
      [27.7550, 85.4150],
      [27.7650, 85.4250],
      [27.7600, 85.4350],
      [27.7480, 85.4220]
    ],
    population: 1850,
    forecast: 'Continuous severe precipitation and reservoir overflow potential',
    reason: 'Upstream catchment runoff swelling Bagmati headwaters',
    createdBy: 'Admin Command Center',
    createdAt: '15:50',
    policeStatus: 'MONITORING',
    status: 'ACTIVE'
  },
  {
    id: 'RZ-03',
    name: 'Bishnumati Corridor (Tokha - Gongabu)',
    riskLevel: 'MEDIUM',
    polygon: [
      [27.7350, 85.3100],
      [27.7450, 85.3180],
      [27.7400, 85.3260],
      [27.7300, 85.3180]
    ],
    population: 3200,
    forecast: 'Moderate to heavy rain expected overnight',
    reason: 'Drainage bottlenecking near urban flood plain',
    createdBy: 'Hydrology Dept',
    createdAt: '14:30',
    policeStatus: 'ACKNOWLEDGED',
    status: 'ACTIVE'
  }
]

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'ALERT-01',
    title: 'CRITICAL FLOOD ALERT',
    area: 'Balkhu Riverside',
    risk: 'CRITICAL',
    reason: 'River level rising rapidly above danger mark',
    forecast: 'Heavy rainfall expected (80-120 mm)',
    population: 2400,
    createdBy: 'Admin Command Center',
    createdAt: '16:25',
    status: 'NEW'
  },
  {
    id: 'ALERT-02',
    title: 'FLASH FLOOD WARNING',
    area: 'Sundarijal Basin',
    risk: 'HIGH',
    reason: 'Reservoir spillway discharge increase',
    forecast: 'Severe localized downpour',
    population: 1850,
    createdBy: 'Admin Command Center',
    createdAt: '15:50',
    status: 'ACKNOWLEDGED'
  },
  {
    id: 'ALERT-03',
    title: 'RIVER LEVEL MONITORING ALERT',
    area: 'Bishnumati Corridor',
    risk: 'MEDIUM',
    reason: 'Urban drainage saturation',
    forecast: 'Intermittent rainfall',
    population: 3200,
    createdBy: 'Hydrology Command',
    createdAt: '14:30',
    status: 'MONITORING'
  }
]

export const INITIAL_CALLS: VoiceCall[] = [
  {
    id: 'CALL-0287',
    time: '16:40',
    location: 'Budhanilkantha, Kathmandu',
    coordinates: [27.7504, 85.3728],
    duration: '02:34',
    aiStatus: 'ANALYZED',
    priority: 92,
    incidentId: 'FLOOD-0287',
    phone: '+977 9841****82',
    callerName: 'Resident of Ward 4',
    extractedInfo: {
      people: 4,
      elderly: 1,
      children: 0,
      trapped: true,
      injuries: 'None reported',
      food: 'Low',
      water: 'Critical'
    },
    transcript: '"We are trapped inside our house in Budhanilkantha. There are four of us here. My grandmother cannot walk at all and flood waters are entering the first floor. We are running out of drinking water. Please send help!"',
    aiSummary: '4 people are trapped in a flooded home. One elderly person is unable to walk and drinking water is critically low.',
    aiRecommendation: 'Immediate rescue assessment recommended. Deploy boat team with clean drinking water provisions.'
  },
  {
    id: 'CALL-0248',
    time: '16:30',
    location: 'Imadol, Lalitpur',
    coordinates: [27.6563, 85.3420],
    duration: '03:12',
    aiStatus: 'ANALYZED',
    priority: 95,
    incidentId: 'FLOOD-0248',
    phone: '+977 9803****19',
    extractedInfo: {
      people: 5,
      elderly: 1,
      children: 1,
      trapped: true,
      injuries: 'Unknown',
      food: 'Low',
      water: 'Low'
    },
    transcript: '"Water is up to our waists in Imadol Ward 3. Five of us are trapped on top of the dining table, including a child and my sick father. Water is rising fast!"',
    aiSummary: '5 people trapped inside home with rising waist-high water.',
    aiRecommendation: 'Urgent rescue raft dispatch required.'
  },
  {
    id: 'CALL-0247',
    time: '16:15',
    location: 'Ward 1, Bhaktapur',
    coordinates: [27.6710, 85.4293],
    duration: '01:55',
    aiStatus: 'ANALYZED',
    priority: 78,
    incidentId: 'FLOOD-0247',
    phone: '+977 9818****04',
    extractedInfo: {
      people: 3,
      elderly: 0,
      children: 1,
      trapped: false,
      injuries: '1 Minor arm cut',
      food: 'Moderate',
      water: 'Low'
    },
    transcript: '"A mudslide just came down the hill behind Ward 1 Bhaktapur. The road is completely blocked and river water is entering our porch. My son cut his arm on debris."',
    aiSummary: 'Mudslide road blockade with 1 minor injury.',
    aiRecommendation: 'Send medical kit and heavy road clearing vehicle.'
  }
]

export const INITIAL_POLICE_UNITS: PoliceUnit[] = [
  {
    id: 'UNIT-04',
    name: 'Patrol Unit 04',
    type: 'Rapid Response Patrol',
    officers: 6,
    vehicles: 2,
    location: 'Budhanilkantha Sector',
    coordinates: [27.7450, 85.3650],
    status: 'AVAILABLE',
    contact: '+977 98510-04004',
    lastUpdate: '2 min ago'
  },
  {
    id: 'UNIT-02',
    name: 'Patrol Unit 02',
    type: 'Lalitpur Rescue Unit',
    officers: 4,
    vehicles: 1,
    location: 'Imadol, Lalitpur',
    coordinates: [27.6800, 85.3150],
    status: 'DEPLOYED',
    currentAssignment: 'FLOOD-0248 (Imadol)',
    contact: '+977 98510-02002',
    lastUpdate: '5 min ago'
  },
  {
    id: 'UNIT-07',
    name: 'Patrol Unit 07',
    type: 'Bhaktapur Response Team',
    officers: 5,
    vehicles: 2,
    location: 'Ward 1, Bhaktapur',
    coordinates: [27.6600, 85.4200],
    status: 'DEPLOYED',
    currentAssignment: 'FLOOD-0247 (Bhaktapur)',
    contact: '+977 98510-07007',
    lastUpdate: '10 min ago'
  },
  {
    id: 'UNIT-01',
    name: 'Rescue Team 01',
    type: 'Specialized Water Rescue',
    officers: 8,
    vehicles: 3,
    location: 'Tokha Sector',
    coordinates: [27.7300, 85.3400],
    status: 'DEPLOYED',
    currentAssignment: 'FLOOD-0246 (Tokha)',
    contact: '+977 98510-01001',
    lastUpdate: '15 min ago'
  },
  {
    id: 'UNIT-08',
    name: 'Emergency Response Team 08',
    type: 'Heavy Disaster Response',
    officers: 8,
    vehicles: 2,
    location: 'Kathmandu Central Command',
    coordinates: [27.7000, 85.3100],
    status: 'AVAILABLE',
    contact: '+977 98510-08008',
    lastUpdate: '1 min ago'
  }
]

export const INITIAL_RESOURCES: TeamResource[] = [
  { id: 'TR-01', name: 'Rapid Response Patrol Teams', category: 'team', type: 'Police Unit', available: 6, deployed: 4, maintenance: 0, total: 10, status: 'AVAILABLE' },
  { id: 'TR-02', name: 'Specialized Search & Rescue', category: 'team', type: 'Rescue Team', available: 3, deployed: 4, maintenance: 1, total: 8, status: 'DEPLOYED' },
  { id: 'TR-03', name: 'Traffic Management Police', category: 'team', type: 'Police Unit', available: 5, deployed: 3, maintenance: 0, total: 8, status: 'AVAILABLE' },
  { id: 'TR-04', name: 'Inflatable Rescue Boats', category: 'resource', type: 'Watercraft', available: 6, deployed: 4, maintenance: 1, total: 11, status: 'AVAILABLE' },
  { id: 'TR-05', name: 'Emergency Communication Radios', category: 'resource', type: 'Equipment', available: 42, deployed: 35, maintenance: 3, total: 80, status: 'AVAILABLE' },
  { id: 'TR-06', name: 'Trauma & First Aid Medical Kits', category: 'resource', type: 'Medical', available: 8, deployed: 20, maintenance: 0, total: 28, status: 'LOW STOCK' },
  { id: 'TR-07', name: 'Temporary Emergency Shelters', category: 'resource', type: 'Facility', available: 4, deployed: 2, maintenance: 0, total: 6, status: 'AVAILABLE' }
]
