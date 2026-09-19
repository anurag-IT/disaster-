import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request } from "express";
import twilio, { twiml } from "twilio";
import { z } from "zod";
import { normalizeNepalPhone } from "../src/lib/phone";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const attempts = new Map<string, number>();
const requestSchema = z.object({ phoneNumber: z.string().max(32) }).strict();

app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));

function isPublicOrigin(value?: string) {
  if (!value) return false;
  try { const url = new URL(value); return url.protocol === "https:" && !["localhost", "127.0.0.1", "::1"].includes(url.hostname); }
  catch { return false; }
}

function verifyTwilioRequest(request: Request) {
  const shouldValidate = process.env.NODE_ENV === "production" || process.env.TWILIO_VALIDATE_WEBHOOKS !== "false";
  if (!shouldValidate) return true;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.header("x-twilio-signature");
  if (!token || !signature) return false;
  const origin = process.env.APP_URL ?? `${request.protocol}://${request.get("host")}`;
  const url = new URL(request.originalUrl, origin).toString();
  return twilio.validateRequest(token, signature, url, request.body as Record<string, string>);
}

app.post("/api/calls/start", async (request, response) => {
  try {
    const parsed = requestSchema.safeParse(request.body);
    if (!parsed.success) { response.status(400).json({ error: "A phone number is required." }); return; }
    const phone = normalizeNepalPhone(parsed.data.phoneNumber);
    if (!phone) { response.status(400).json({ error: "Invalid Nepal mobile number." }); return; }
    const key = `${request.ip}:${phone}`;
    if (Date.now() - (attempts.get(key) ?? 0) < 30_000) { response.status(429).json({ error: "Please wait before calling this number again." }); return; }
    const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_PHONE_NUMBER: from, APP_URL: appUrl } = process.env;
    const configuredUrl = process.env.TWILIO_TWIML_URL?.trim();
    const voiceUrl = configuredUrl || (appUrl ? new URL("/api/twilio/voice", appUrl).toString() : undefined);
    if (!sid || !token || !from || !voiceUrl) { response.status(503).json({ error: "Live calling is not configured." }); return; }
    const call = await twilio(sid, token).calls.create({
      to: phone, from, url: voiceUrl, method: "POST",
      ...(isPublicOrigin(appUrl) && { statusCallback: new URL("/api/twilio/status", appUrl).toString(), statusCallbackMethod: "POST" as const, statusCallbackEvent: ["initiated", "ringing", "answered", "completed"] as const }),
    });
    attempts.set(key, Date.now());
    response.status(201).json({ callSid: call.sid, status: call.status, phoneNumber: phone.replace(/^(\+977\d{2})\d{4}(\d{3})$/, "$1****$2") });
  } catch (error) {
    console.error("Call initiation failed", error instanceof Error ? error.message : "Unknown error");
    response.status(502).json({ error: "The call provider could not start this call." });
  }
});

app.post("/api/twilio/voice", (request, response) => {
  if (!verifyTwilioRequest(request)) { response.status(403).send("Invalid Twilio signature"); return; }
  const voice = new twiml.VoiceResponse();
  const wsUrl = process.env.WEBSOCKET_PUBLIC_URL;
  if (wsUrl) voice.connect().stream({ url: wsUrl });
  else { voice.say({ language: "en-IN" }, "Namaste. Raksha emergency assistance is temporarily unavailable. Please contact your local emergency services."); voice.hangup(); }
  response.type("text/xml").send(voice.toString());
});

app.post("/api/twilio/status", (request, response) => {
  if (!verifyTwilioRequest(request)) { response.status(403).json({ error: "Invalid Twilio signature." }); return; }
  response.json({ received: true, callSid: request.body.CallSid, status: request.body.CallStatus });
});

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
  app.use(express.static(root));
  app.get("/*splat", (_request, response) => response.sendFile(path.join(root, "index.html")));
}

app.listen(port, () => console.log(`RAKSHA API listening on http://localhost:${port}`));
