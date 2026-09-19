# Twilio flow

`POST /api/calls/start` validates and normalizes Nepal numbers, blocks cross-origin browser requests, rate-limits repeated attempts, and creates an outbound call. Set `TWILIO_TWIML_URL` to a Twilio-hosted voice template URL, or leave it empty to use `/api/twilio/voice`, which returns TwiML with `<Connect><Stream>`. `/api/twilio/status` receives lifecycle callbacks. Both local webhooks validate Twilio signatures. `server/media-stream.ts` handles `start`, inbound `media`, `mark`, `clear`, `stop`, disconnect cleanup, and per-stream isolation.

Use a public HTTPS `APP_URL` and WSS `WEBSOCKET_PUBLIC_URL`. For local unsigned webhook testing only, set `TWILIO_VALIDATE_WEBHOOKS=false`; production always validates signatures. Live calling has not been claimed as tested until fresh credentials, a public tunnel, and a permitted destination number are available.

Never commit the Account SID or Auth Token. If a token is pasted into chat, logs, or source code, rotate it in the Twilio Console before continuing.
