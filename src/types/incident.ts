export type PriorityLevel = "STANDARD" | "ELEVATED" | "URGENT" | "CRITICAL REVIEW";
export type IncidentStatus = "NEW" | "ASSESSING" | "TEAM ASSIGNED" | "RESOLVED";
export type Accuracy = "UNKNOWN" | "UNRESOLVED" | "APPROXIMATE" | "CONFIRMED";

export interface Evidence { field: string; value: string; quote: string; confidence: number; timestamp: string }
export interface TranscriptLine { id: string; speaker: "CALLER" | "RAKSHA"; text: string; time: string }
export interface Location { rawText: string | null; district: string | null; municipality: string | null; ward: string | null; tole: string | null; landmark: string | null; latitude: number | null; longitude: number | null; accuracy: Accuracy }
export interface Incident {
  id: number; simulated: boolean; phoneMasked: string; status: IncidentStatus; createdAt: string;
  peopleCount: number | null; trapped: boolean | null; canEvacuate: boolean | null;
  injuredCount: number | null; seriousInjury: boolean | null; childrenCount: number | null;
  elderlyCount: number | null; mobilityImpaired: boolean | null; pregnantPerson: boolean | null;
  waterRising: boolean | null; structuralDanger: boolean | null; foodNeeded: boolean | null;
  drinkingWaterNeeded: boolean | null; medicineNeeded: boolean | null; location: Location;
  summary: string; priorityScore: number; priorityLevel: PriorityLevel; priorityReasons: string[];
  recommendedResponse: string[]; assignedTeam: string | null; evidence: Evidence[]; transcript: TranscriptLine[];
}

export interface Responder { id: string; name: string; type: string; status: "AVAILABLE" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "UNAVAILABLE"; latitude?: number; longitude?: number }
