import Groq from "groq-sdk";
import { z } from "zod";

const extractionSchema = z.object({ people_count:z.number().int().nonnegative().nullable(), trapped:z.boolean().nullable(), can_evacuate:z.boolean().nullable(), serious_injury:z.boolean().nullable(), children_count:z.number().int().nonnegative().nullable(), elderly_count:z.number().int().nonnegative().nullable(), mobility_impaired:z.boolean().nullable(), water_rising:z.boolean().nullable(), structural_danger:z.boolean().nullable(), location_text:z.string().nullable(), summary:z.string(), follow_up_question:z.string().nullable() });
export type Extraction = z.infer<typeof extractionSchema>;

export async function extractIncidentTurn(text: string): Promise<Extraction> {
  if (!process.env.GROQ_API_KEY || !process.env.GROQ_CHAT_MODEL) throw new Error("Groq is not configured");
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({ model:process.env.GROQ_CHAT_MODEL, temperature:0, response_format:{type:"json_object"}, messages:[{role:"system",content:"Extract only explicitly stated flood emergency facts. Unknown booleans must be null, never false. Ask exactly one short question for the highest-priority missing fact: location, life danger, evacuation, injury, people. Return JSON only."},{role:"user",content:text}] });
  return extractionSchema.parse(JSON.parse(completion.choices[0]?.message?.content ?? "{}"));
}
