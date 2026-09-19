import { WebSocketServer, WebSocket } from "ws";

type Session = { callSid:string; streamSid:string; audio:Buffer[]; startedAt:number };
const sessions = new Map<string,Session>();
const port = Number(process.env.MEDIA_STREAM_PORT ?? 8080);
const wss = new WebSocketServer({ port });
wss.on("connection", socket => {
  let session: Session | undefined;
  socket.on("message", raw => {
    const event = JSON.parse(raw.toString());
    if (event.event === "start") { session={callSid:event.start.callSid,streamSid:event.start.streamSid,audio:[],startedAt:Date.now()}; sessions.set(session.streamSid,session); }
    if (event.event === "media" && session && event.media.track === "inbound") session.audio.push(Buffer.from(event.media.payload,"base64")); // Twilio sends 8kHz mu-law.
    if (event.event === "stop" && session) { sessions.delete(session.streamSid); session=undefined; }
    if (event.event === "mark") { /* Playback boundary acknowledged. */ }
    if (event.event === "clear") { /* Twilio cleared buffered outbound audio. */ }
  });
  socket.on("close",()=>{if(session)sessions.delete(session.streamSid)});
  socket.on("error",()=>socket.readyState===WebSocket.OPEN&&socket.close());
});
console.log(`RAKSHA media stream listening on ${port}`);
