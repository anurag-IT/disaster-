import type { Incident, PriorityLevel } from "@/types/incident";

type PriorityInput = Pick<Incident, "seriousInjury" | "trapped" | "structuralDanger" | "canEvacuate" | "waterRising" | "mobilityImpaired" | "childrenCount" | "elderlyCount" | "medicineNeeded" | "drinkingWaterNeeded">;

const rules: Array<{ points: number; reason: string; matches: (i: PriorityInput) => boolean }> = [
  { points: 30, reason: "Serious injury reported", matches: i => i.seriousInjury === true },
  { points: 25, reason: "Caller reports being trapped", matches: i => i.trapped === true },
  { points: 25, reason: "Structural danger reported", matches: i => i.structuralDanger === true },
  { points: 20, reason: "Unable to evacuate safely", matches: i => i.canEvacuate === false },
  { points: 20, reason: "Flood water reportedly rising", matches: i => i.waterRising === true },
  { points: 15, reason: "Mobility limitation reported", matches: i => i.mobilityImpaired === true },
  { points: 10, reason: "Child present", matches: i => (i.childrenCount ?? 0) > 0 },
  { points: 10, reason: "Elderly person present", matches: i => (i.elderlyCount ?? 0) > 0 },
  { points: 10, reason: "Medicine needed", matches: i => i.medicineNeeded === true },
  { points: 5, reason: "Drinking water needed", matches: i => i.drinkingWaterNeeded === true },
];

export function calculatePriority(input: PriorityInput) {
  const matched = rules.filter(rule => rule.matches(input));
  const score = matched.reduce((total, rule) => total + rule.points, 0);
  const level: PriorityLevel = score >= 75 ? "CRITICAL REVIEW" : score >= 50 ? "URGENT" : score >= 25 ? "ELEVATED" : "STANDARD";
  return { score, level, reasons: matched.map(rule => rule.reason) };
}
