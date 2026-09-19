import { calculatePriority } from "@/lib/priority";
import type { Incident, Responder } from "@/types/incident";

type Seed = Omit<Incident, "priorityScore" | "priorityLevel" | "priorityReasons">;
const now = new Date().toISOString();
const base = { simulated: true, status: "ASSESSING" as const, createdAt: now, injuredCount: null, pregnantPerson: null, foodNeeded: null, drinkingWaterNeeded: null, medicineNeeded: null, assignedTeam: null };
const loc = (rawText: string, latitude: number, longitude: number, district: string) => ({ rawText, latitude, longitude, district, municipality: null, ward: null, tole: null, landmark: null, accuracy: "APPROXIMATE" as const });
const t = (id: string, speaker: "CALLER" | "RAKSHA", text: string, time: string) => ({ id, speaker, text, time });

const seeds: Seed[] = [
  { ...base, id: 1042, phoneMasked: "+97798****123", peopleCount: 5, trapped: true, canEvacuate: false, seriousInjury: null, childrenCount: 1, elderlyCount: 1, mobilityImpaired: true, waterRising: true, structuralDanger: null, location: loc("Imadol, Lalitpur", 27.6563, 85.3420, "Lalitpur"), summary: "Five people surrounded by flood water. A child and an elderly person with limited mobility are present; the family cannot evacuate.", recommendedResponse: ["Water Rescue", "Medical Support"], evidence: [{ field: "people_count", value: "5", quote: "Hami 5 jana chhau.", confidence: .98, timestamp: now }, { field: "mobility_impaired", value: "true", quote: "Hajurama hidna saknu hunna.", confidence: .97, timestamp: now }], transcript: [t("a","CALLER","Hamro ghar wari pari pani aaisakyo. Hami 5 jana chhau. Euta sano bachcha cha ra hajurama hidna saknu hunna.","09:41"),t("b","RAKSHA","तपाईं अहिले कहाँ हुनुहुन्छ?","09:41"),t("c","CALLER","Imadol, Lalitpur.","09:42"),t("d","RAKSHA","तपाईंहरू सुरक्षित रूपमा घरबाट बाहिर निस्कन सक्नुहुन्छ?","09:42"),t("e","CALLER","Sakdainau, pani dherai cha.","09:42")] },
  { ...base, id: 1041, phoneMasked: "+97798****781", peopleCount: 3, trapped: false, canEvacuate: true, seriousInjury: false, childrenCount: 1, elderlyCount: 0, mobilityImpaired: false, waterRising: false, structuralDanger: false, location: loc("Bharatpur-10, Chitwan",27.6817,84.4325,"Chitwan"), summary:"Family is safe and able to evacuate; water is nearby but stable.", recommendedResponse:["Relief Team"], evidence:[], transcript:[] },
  { ...base, id: 1040, phoneMasked: "+97798****410", peopleCount: 2, trapped: true, canEvacuate: false, seriousInjury: true, childrenCount: 0, elderlyCount: 0, mobilityImpaired: false, waterRising: true, structuralDanger: true, location: loc("Melamchi Bazaar",27.8294,85.5847,"Sindhupalchok"), summary:"Two people trapped with a serious injury and reported structural danger.", recommendedResponse:["Water Rescue","Ambulance","Fire & Rescue"], evidence:[], transcript:[] },
  { ...base, id: 1039, phoneMasked: "+97797****882", peopleCount: 6, trapped: null, canEvacuate: null, seriousInjury: false, childrenCount: 2, elderlyCount: 0, mobilityImpaired: false, waterRising: true, structuralDanger: null, location: loc("Biratnagar-12",26.4525,87.2718,"Morang"), summary:"Six people report rising water; evacuation ability is not yet confirmed.", recommendedResponse:["Water Rescue"], evidence:[], transcript:[] },
  { ...base, id: 1038, phoneMasked: "+97798****552", peopleCount: 1, trapped: false, canEvacuate: true, seriousInjury: false, childrenCount: 0, elderlyCount: 1, mobilityImpaired: false, waterRising: false, structuralDanger: false, location: loc("Nepalgunj",28.05,81.6167,"Banke"), summary:"Caller is safe and can relocate without assistance.", recommendedResponse:["Relief Team"], evidence:[], transcript:[] },
  { ...base, id: 1037, phoneMasked: "+97798****114", peopleCount: 4, trapped: true, canEvacuate: false, seriousInjury: false, childrenCount: 0, elderlyCount: 1, mobilityImpaired: true, waterRising: false, structuralDanger: null, location: loc("Tikapur-1",28.5286,81.117,"Kailali"), summary:"Four people unable to evacuate; one elderly person has limited mobility.", recommendedResponse:["Water Rescue"], evidence:[], transcript:[] },
];

export const seedIncidents: Incident[] = seeds.map(seed => ({ ...seed, ...Object.fromEntries(Object.entries(calculatePriority(seed)).map(([k,v]) => [k === "score" ? "priorityScore" : k === "level" ? "priorityLevel" : "priorityReasons", v])) } as Incident));
export const responders: Responder[] = [
  { id:"wr-a", name:"Water Rescue Alpha", type:"WATER RESCUE", status:"AVAILABLE", latitude:27.68, longitude:85.32 },
  { id:"wr-b", name:"Water Rescue Bravo", type:"WATER RESCUE", status:"EN_ROUTE", latitude:27.7, longitude:85.35 },
  { id:"amb-1", name:"Ambulance Team 1", type:"AMBULANCE", status:"AVAILABLE" },
  { id:"pol-1", name:"Police Response 1", type:"POLICE", status:"AVAILABLE" },
  { id:"fire-1", name:"Fire & Rescue 1", type:"FIRE & RESCUE", status:"AVAILABLE" },
  { id:"relief-1", name:"Relief Team 1", type:"RELIEF", status:"AVAILABLE" },
];
