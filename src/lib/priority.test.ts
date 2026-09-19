import { describe, expect, it } from "vitest";
import { calculatePriority } from "./priority";
const blank={seriousInjury:null,trapped:null,structuralDanger:null,canEvacuate:null,waterRising:null,mobilityImpaired:null,childrenCount:null,elderlyCount:null,medicineNeeded:null,drinkingWaterNeeded:null};
describe("deterministic priority",()=>{
 it("keeps unknown values neutral",()=>expect(calculatePriority(blank)).toMatchObject({score:0,level:"STANDARD"}));
 it("scores trapped and elderly",()=>expect(calculatePriority({...blank,trapped:true,elderlyCount:1})).toMatchObject({score:35,level:"ELEVATED"}));
 it("scores serious injury",()=>expect(calculatePriority({...blank,seriousInjury:true})).toMatchObject({score:30,level:"ELEVATED"}));
 it("does not penalize safe evacuation",()=>expect(calculatePriority({...blank,canEvacuate:true,trapped:false})).toMatchObject({score:0}));
 it("requires critical review at 75",()=>expect(calculatePriority({...blank,trapped:true,canEvacuate:false,waterRising:true,mobilityImpaired:true})).toMatchObject({score:80,level:"CRITICAL REVIEW"}));
});
